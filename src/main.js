import './style.css'; 
import * as THREE from 'three';
import { CONFIG, R } from './JS/config.js';
import { state } from './JS/state.js';
import { initScene } from './JS/scene.js';
import { createEarth } from './JS/earth.js';
import { createDebris } from './JS/debris.js';
import { createSatellite } from './JS/satellite.js';
import { initUI, updateHUD, showGameOver } from './JS/ui.js';

const { scene, camera, renderer, controls } = initScene();

const earth = createEarth(); 
scene.add(earth);

const debris = createDebris(); 
scene.add(debris.mesh);

const satellite = createSatellite(); 
scene.add(satellite.wrapper);

initUI();

const clock = new THREE.Clock();
const dummy = new THREE.Object3D();
const satWorldPos = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if(!state.active) {
        renderer.render(scene, camera);
        return;
    }

    const dt = clock.getDelta();
    const logicDt = dt * state.timeScale;

    state.totalTime += logicDt;
    state.currentMonth = state.totalTime / CONFIG.secondsPerMonth;
    
    // 逻辑：燃油消耗
    const fuelCost = 0.5 * logicDt * (1 + Math.abs(satellite.wrapper.rotation.z - state.targetInc));
    state.fuel -= fuelCost * 0.1;
    if(state.fuel <= 0) { state.active = false; showGameOver(false, "FUEL DEPLETED"); }
    if(state.currentMonth >= CONFIG.monthsToWin) { state.active = false; showGameOver(true, "MISSION COMPLETE"); }

    // 卫星运动
    const targetR = (CONFIG.earthR + state.targetAlt) * CONFIG.scale;
    const currentR = satellite.mesh.position.length() || targetR;
    const newR = THREE.MathUtils.lerp(currentR, targetR, 0.05); 
    
    // 三轴等比缩放
    satellite.orbit.scale.set(newR, newR, newR);
    
    satellite.wrapper.rotation.z = THREE.MathUtils.lerp(satellite.wrapper.rotation.z, state.targetInc, 0.05);

    state.satAngle -= 0.5 * logicDt;
    satellite.mesh.position.set(Math.cos(state.satAngle)*newR, 0, Math.sin(state.satAngle)*newR);
    satellite.mesh.lookAt(0,0,0);

    // 垃圾碰撞
    satellite.mesh.getWorldPosition(satWorldPos);
    let hit = false;
    for(let i=0; i<CONFIG.debrisCount; i++) {
        const d = debris.data[i];
        d.theta += d.speed * logicDt * 0.1; 

        const x = d.radius * (Math.cos(d.raan)*Math.cos(d.theta) - Math.sin(d.raan)*Math.sin(d.theta)*Math.cos(d.inc));
        const z = d.radius * (Math.sin(d.raan)*Math.cos(d.theta) + Math.cos(d.raan)*Math.sin(d.theta)*Math.cos(d.inc));
        const y = d.radius * (Math.sin(d.theta)*Math.sin(d.inc));

        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        debris.mesh.setMatrixAt(i, dummy.matrix);

        if(Math.abs(d.radius - newR) < 1.0) {
            if(satWorldPos.distanceTo(dummy.position) < 0.6) hit = true;
        }
    }
    debris.mesh.instanceMatrix.needsUpdate = true;

    if(hit) {
        // 【关键修改】伤害从 0.2 降低到 0.05
        state.armor -= 0.05; 
        
        const alertEl = document.getElementById('alert');
        if(alertEl) {
            alertEl.style.opacity = 1;
            setTimeout(() => alertEl.style.opacity = 0, 150);
        }
        if(state.armor <= 0) { state.active = false; showGameOver(false, "HULL FAILURE"); }
    }

    updateHUD();
    renderer.render(scene, camera);
}

animate();