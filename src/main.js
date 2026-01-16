import './style.css'; 
import * as THREE from 'three';
import { CONFIG, R } from './JS/config.js';
import { state } from './JS/state.js';
import { initScene } from './JS/scene.js';
import { createEarth } from './JS/earth.js';
import { createDebris } from './JS/debris.js';
import { createSatellite } from './JS/satellite.js';
import { initUI, updateHUD, showGameOver } from './JS/ui.js';
import { initEventSystem } from './JS/eventSystem.js';

const { scene, camera, renderer, controls } = initScene();

const earth = createEarth(); 
scene.add(earth);

const debris = createDebris(); 
scene.add(debris.mesh);

const satellite = createSatellite(); 
scene.add(satellite.wrapper);

initUI();
initEventSystem();

const clock = new THREE.Clock();
const dummy = new THREE.Object3D();
const satWorldPos = new THREE.Vector3();

// 获取当前轨道特性
function getOrbitZone(altitude) {
    if (altitude <= CONFIG.orbitZones.LEO.maxAlt) return CONFIG.orbitZones.LEO;
    if (altitude <= CONFIG.orbitZones.MEO.maxAlt) return CONFIG.orbitZones.MEO;
    return CONFIG.orbitZones.GEO;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if(!state.active) {
        renderer.render(scene, camera);
        return;
    }

    const dt = clock.getDelta();
    // 逻辑时间步长：受速度滑块控制
    const logicDt = dt * state.timeScale;

    state.totalTime += logicDt;
    state.currentMonth = state.totalTime / CONFIG.secondsPerMonth;
    
    // === 【新增】数据统计逻辑 ===
    // 1. 初始化当前轨道的统计时间（如果不存在）
    if (!state.stats.orbitTime[state.targetAlt]) {
        state.stats.orbitTime[state.targetAlt] = 0;
    }
    // 2. 累加停留时间
    state.stats.orbitTime[state.targetAlt] += logicDt;


    // === 胜利判定 ===
    if(state.currentMonth >= CONFIG.monthsToWin) { 
        state.active = false; 
        showGameOver(true, "ORBIT SECURED"); 
    }

    const currentR_World = satellite.mesh.position.length() || (CONFIG.earthR + 550) * CONFIG.scale;
    const currentAlt = (currentR_World / CONFIG.scale) - CONFIG.earthR;

    // === 燃油消耗 ===
    const normalizedR = currentR_World / R; 
    const inclinationCost = 1 + Math.abs(satellite.wrapper.rotation.z - state.targetInc) * 2;
    const fuelConsumption = CONFIG.fuelBaseK * Math.log(1 + normalizedR) * inclinationCost * logicDt * 0.05;
    
    state.fuel -= fuelConsumption;
    if(state.fuel <= 0) { 
        state.active = false; 
        showGameOver(false, "PROPELLANT DRAINED"); 
    }

    // === 卫星运动 (玩家) ===
    const targetR = (CONFIG.earthR + state.targetAlt) * CONFIG.scale;
    const newR = THREE.MathUtils.lerp(currentR_World, targetR, 0.05); 
    satellite.orbit.scale.set(newR, newR, newR);
    satellite.wrapper.rotation.z = THREE.MathUtils.lerp(satellite.wrapper.rotation.z, state.targetInc, 0.05);

    state.satAngle -= 0.5 * logicDt;
    satellite.mesh.position.set(Math.cos(state.satAngle)*newR, 0, Math.sin(state.satAngle)*newR);
    satellite.mesh.lookAt(0,0,0);

    // ==========================================
    // 🌌 碎片运动与碰撞系统
    // ==========================================
    satellite.mesh.getWorldPosition(satWorldPos);
    let hit = false;
    
    const radialThreshold = 0.1;   // 高度差判定
    const distanceThreshold = 0.05; // 距离判定

    for(let i=0; i<CONFIG.debrisCount; i++) {
        const d = debris.data[i];

        // 碎片运动
        d.theta += d.speed * logicDt * 0.15; 

        const x = d.radius * (Math.cos(d.raan)*Math.cos(d.theta) - Math.sin(d.raan)*Math.sin(d.theta)*Math.cos(d.inc));
        const z = d.radius * (Math.sin(d.raan)*Math.cos(d.theta) + Math.cos(d.raan)*Math.sin(d.theta)*Math.cos(d.inc));
        const y = d.radius * (Math.sin(d.theta)*Math.sin(d.inc));

        dummy.position.set(x, y, z);
        
        // 自转效果
        dummy.rotation.x += 0.005 * i % 0.02;
        dummy.rotation.y += 0.005 * i % 0.02;

        dummy.updateMatrix();
        debris.mesh.setMatrixAt(i, dummy.matrix);

        // 碰撞检测 (3秒无敌时间后)
        if (state.totalTime > 3.0) {
            if (Math.abs(d.radius - newR) < radialThreshold) {
                if(satWorldPos.distanceTo(dummy.position) < distanceThreshold) {
                    hit = true;
                }
            }
        }
    }
    debris.mesh.instanceMatrix.needsUpdate = true;

    // === 伤害处理 ===
    if(hit) {
        const zone = getOrbitZone(currentAlt);
        state.armor -= zone.dmg; 
        
        // 【新增】统计碰撞次数
        if(state.stats) {
            state.stats.collisionCount++;
        }
        
        const alertEl = document.getElementById('alert');
        if(alertEl) {
            alertEl.innerHTML = `⚠ IMPACT: ${zone.label}`;
            alertEl.style.opacity = 1;
            setTimeout(() => alertEl.style.opacity = 0, 200);
        }

        if(state.armor <= 0) { 
            state.active = false; 
            showGameOver(false, "CRITICAL HULL FAILURE"); 
        }
    }

    updateHUD();
    renderer.render(scene, camera);
}

animate();