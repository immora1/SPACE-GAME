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
    
    // === 胜利判定 ===
    if(state.currentMonth >= CONFIG.monthsToWin) { state.active = false; showGameOver(true, "MISSION COMPLETE"); }

    const currentR_World = satellite.mesh.position.length() || (CONFIG.earthR + 550) * CONFIG.scale;
    const currentAlt = (currentR_World / CONFIG.scale) - CONFIG.earthR;

    // === 燃油消耗 ===
    const normalizedR = currentR_World / R; 
    const inclinationCost = 1 + Math.abs(satellite.wrapper.rotation.z - state.targetInc) * 2;
    const fuelConsumption = CONFIG.fuelBaseK * Math.log(1 + normalizedR) * inclinationCost * logicDt * 0.05;
    
    state.fuel -= fuelConsumption;
    if(state.fuel <= 0) { state.active = false; showGameOver(false, "FUEL DEPLETED"); }

    // === 卫星运动 (玩家) ===
    const targetR = (CONFIG.earthR + state.targetAlt) * CONFIG.scale;
    const newR = THREE.MathUtils.lerp(currentR_World, targetR, 0.05); 
    satellite.orbit.scale.set(newR, newR, newR);
    satellite.wrapper.rotation.z = THREE.MathUtils.lerp(satellite.wrapper.rotation.z, state.targetInc, 0.05);

    state.satAngle -= 0.5 * logicDt;
    satellite.mesh.position.set(Math.cos(state.satAngle)*newR, 0, Math.sin(state.satAngle)*newR);
    satellite.mesh.lookAt(0,0,0);

    // ==========================================
    // 🌌 碎片运动系统 (独立于碰撞逻辑)
    // ==========================================
    satellite.mesh.getWorldPosition(satWorldPos);
    let hit = false;
    
    // 判定参数
    const radialThreshold = 0.1;   // 高度差判定 (100km)
    const distanceThreshold = 0.05; // 距离判定 (50km)

    for(let i=0; i<CONFIG.debrisCount; i++) {
        const d = debris.data[i];

        // 1. 始终让碎片运动 (Visual Movement)
        // d.speed 已经在 debris.js 里按轨道高度计算好了 (Math.sqrt(R/radius))
        // 越近越快，越远越慢，符合物理规律
        // 系数 0.15 是调节整体视觉速度的，觉得慢可以改大
        d.theta += d.speed * logicDt * 0.15; 

        // 计算新位置
        const x = d.radius * (Math.cos(d.raan)*Math.cos(d.theta) - Math.sin(d.raan)*Math.sin(d.theta)*Math.cos(d.inc));
        const z = d.radius * (Math.sin(d.raan)*Math.cos(d.theta) + Math.cos(d.raan)*Math.sin(d.theta)*Math.cos(d.inc));
        const y = d.radius * (Math.sin(d.theta)*Math.sin(d.inc));

        dummy.position.set(x, y, z);
        
        // 增加一点自转，让画面不那么死板
        dummy.rotation.x += 0.005 * i % 0.02;
        dummy.rotation.y += 0.005 * i % 0.02;

        dummy.updateMatrix();
        debris.mesh.setMatrixAt(i, dummy.matrix);

        // 2. 碰撞检测 (Collision Check)
        // 只有过了3秒安全期才开始检测碰撞，但运动是上面一直在做的
        if (state.totalTime > 3.0) {
            // 粗略筛选：高度差太大直接不算
            if (Math.abs(d.radius - newR) < radialThreshold) {
                // 精确判定：距离够近
                if(satWorldPos.distanceTo(dummy.position) < distanceThreshold) {
                    hit = true;
                }
            }
        }
    }
    // 告诉 GPU 矩阵更新了
    debris.mesh.instanceMatrix.needsUpdate = true;

    // === 伤害处理 ===
    if(hit) {
        const zone = getOrbitZone(currentAlt);
        state.armor -= zone.dmg; 
        
        const alertEl = document.getElementById('alert');
        if(alertEl) {
            alertEl.innerHTML = `⚠ IMPACT: ${zone.label}`;
            alertEl.style.opacity = 1;
            setTimeout(() => alertEl.style.opacity = 0, 200);
        }

        if(state.armor <= 0) { state.active = false; showGameOver(false, "HULL FAILURE"); }
    }

    updateHUD();
    renderer.render(scene, camera);
}

animate();