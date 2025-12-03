import * as THREE from 'three';
import { CONFIG, R } from './config.js';

export function createDebris() {
    // 【关键修改】从 TetrahedronGeometry (三角面) 改为 BoxGeometry (四边形面)
    const debrisGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04); 
    
    // 使用 Basic 材质，纯白不反光
    const debrisMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
    const debrisMesh = new THREE.InstancedMesh(debrisGeo, debrisMat, CONFIG.debrisCount);
    
    const debrisData = [];
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let currentCount = 0;

    // ==================================================================================
    // 第一部分：原子模型轨道 (90%) - 保持不变
    // ==================================================================================
    const numberOfRings = 40; 
    const particlesPerRing = Math.floor((CONFIG.debrisCount * 0.90) / numberOfRings);

    const rings = [];
    for(let r=0; r<numberOfRings; r++) {
        rings.push({
            alt: 500 + Math.pow(Math.random(), 2) * 20000,
            inc: Math.random() * Math.PI,
            raan: Math.random() * Math.PI * 2,
            spread: 50 + Math.random() * 250 
        });
    }

    rings.forEach(ring => {
        for(let k=0; k<particlesPerRing; k++) {
            const index = currentCount + k;
            if(index >= CONFIG.debrisCount) break;

            let theta = (k / particlesPerRing) * Math.PI * 2;
            const alt = ring.alt + (Math.random() - 0.5) * ring.spread;
            theta += (Math.random() - 0.5) * 0.1;

            addDebris(index, alt, theta, ring.raan, ring.inc);
        }
        currentCount += particlesPerRing;
    });

    // ==================================================================================
    // 第二部分：散落背景 (10%) - 保持不变
    // ==================================================================================
    const scatterCount = CONFIG.debrisCount - currentCount;
    for(let i=0; i<scatterCount; i++) {
        const index = currentCount + i;
        const theta = Math.random() * Math.PI * 2; 
        const alt = 400 + Math.random() * 36000; 
        const inc = Math.acos(2 * Math.random() - 1); 
        const raan = Math.random() * Math.PI * 2;
        addDebris(index, alt, theta, raan, inc);
    }

    // --- 辅助函数 ---
    function addDebris(index, alt, theta, raan, inc) {
        const radius = (CONFIG.earthR + alt) * CONFIG.scale;
        
        debrisData.push({
            radius, theta, raan, inc,
            speed: (0.6 * Math.sqrt(R/radius)) * (Math.random()>0.5?1:-1)
        });

        // 轨道力学位置计算
        const cT = Math.cos(theta), sT = Math.sin(theta);
        const cI = Math.cos(inc), sI = Math.sin(inc);
        const cR = Math.cos(raan), sR = Math.sin(raan);
        
        const x = radius * (cR * cT - sR * sT * cI);
        const z = radius * (sR * cT + cR * sT * cI);
        const y = radius * (sT * sI);

        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        dummy.updateMatrix();
        debrisMesh.setMatrixAt(index, dummy.matrix);
        debrisMesh.setColorAt(index, color.setHex(0xffffff));
    }
    
    return { mesh: debrisMesh, data: debrisData };
}