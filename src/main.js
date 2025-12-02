import './style.css'; 
import * as THREE from 'three';
import { CONFIG, R } from './js/config.js';
import { state } from './js/state.js';
import { initScene } from './js/scene.js';
import { createEarth } from './js/earth.js';
import { createDebris } from './js/debris.js';
import { createSatellite } from './js/satellite.js';
import { initUI, updateHUD, showGameOver } from './js/ui.js';

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
    // 限制每帧最大时间，防止切换浏览器标签回来时瞬间爆炸
    const safeDt = Math.min(dt, 0.1); 
    const logicDt = safeDt * state.timeScale;

    state.totalTime += logicDt;
    state.currentMonth = state.totalTime / CONFIG.secondsPerMonth;
    
    // 燃油逻辑
    const fuelCost = 0.5 * logicDt * (1 + Math.abs(satellite.wrapper.rotation.z - state.targetInc));
    state.fuel -= fuelCost * 0.1;
    if(state.fuel <= 0) { state.active = false; showGameOver(false, "FUEL DEPLETED"); }
    if(state.currentMonth >= CONFIG.monthsToWin) { state.active = false; showGameOver(true, "MISSION COMPLETE"); }

    // --- 卫星运动 (丝滑核心) ---
    const targetR = (CONFIG.earthR + state.targetAlt) * CONFIG.scale;
    const currentR = satellite.mesh.position.length() || targetR;
    
    // 【关键修改】将 0.05 改为 0.01
    // 这个数值越小，阻尼感越强，变轨越慢越丝滑
    const smoothFactor = 0.01; 

    // 高度平滑过渡
    const newR = THREE.MathUtils.lerp(currentR, targetR, smoothFactor); 
    satellite.orbit.scale.set(newR, newR, 1);
    
    // 倾角平滑过渡
    satellite.wrapper.rotation.z = THREE.MathUtils.lerp(satellite.wrapper.rotation.z, state.targetInc, smoothFactor);

    // 卫星绕地旋转
    state.satAngle -= 0.5 * logicDt;
    satellite.mesh.position.set(Math.cos(state.satAngle)*newR, 0, Math.sin(state.satAngle)*newR);
    satellite.mesh.lookAt(0,0,0);

    // --- 垃圾碰撞检测 ---
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
            if(satWorldPos.distanceTo(dummy.position) < 0.5) hit = true;
        }
    }
    debris.mesh.instanceMatrix.needsUpdate = true;

    if(hit) {
        state.armor -= 0.2; 
        const alertEl = document.getElementById('alert');
        if(alertEl) {
            alertEl.style.opacity = 1;
            setTimeout(() => alertEl.style.opacity = 0, 100);
        }
        if(state.armor <= 0) { state.active = false; showGameOver(false, "HULL FAILURE"); }
    }

    updateHUD();
    renderer.render(scene, camera);
}

animate();