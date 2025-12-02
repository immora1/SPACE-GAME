import * as THREE from 'three';
import { CONFIG, R } from './config.js';

export function createDebris() {
    // 依然保持白色极简风，使用四面体增加锐利感
    const debrisGeo = new THREE.TetrahedronGeometry(0.04, 0); 
    const debrisMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
    const debrisMesh = new THREE.InstancedMesh(debrisGeo, debrisMat, CONFIG.debrisCount);
    
    const debrisData = [];
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let currentCount = 0;

    // ==========================================
    // 第一部分：原子模型轨道 (85% 的垃圾)
    // ==========================================
    // 我们生成 20 条不同的轨道环，形成“电子云”效果
    const numberOfRings = 20; 
    const particlesPerRing = Math.floor((CONFIG.debrisCount * 0.85) / numberOfRings);

    // 预先生成这 20 个环的参数
    const rings = [];
    for(let i=0; i<numberOfRings; i++) {
        rings.push({
            // 高度：在 LEO (500km) 到 MEO (25000km) 之间随机，稍微偏向低轨
            alt: 500 + Math.random() * 25000 * (Math.random() > 0.5 ? 0.2 : 1.0),
            
            // 倾角：完全随机 (0 ~ 180度)，这样才能像原子一样各个角度都有
            inc: Math.random() * Math.PI,
            
            // RAAN (朝向)：完全随机 (0 ~ 360度)，确保环是交叉的
            raan: Math.random() * Math.PI * 2,
            
            // 扩散度：环的“厚度”，越小越像一条细线
            spread: 100 + Math.random() * 300 
        });
    }

    // 开始填充这 20 个环
    rings.forEach(ring => {
        for(let k=0; k<particlesPerRing; k++) {
            const index = currentCount + k;
            if(index >= CONFIG.debrisCount) break;

            // 1. 位置：在圆环上随机分布
            const theta = Math.random() * Math.PI * 2; 
            
            // 2. 加上一点点随机扰动，让线不要太死板
            const alt = ring.alt + (Math.random() - 0.5) * ring.spread;
            // 极小的倾角和朝向抖动，确保看起来像一条线而不是一面墙
            const inc = ring.inc + (Math.random() - 0.5) * 0.02; 
            const raan = ring.raan + (Math.random() - 0.5) * 0.02; 

            const radius = (CONFIG.earthR + alt) * CONFIG.scale;

            addDebris(index, radius, theta, raan, inc);
        }
        currentCount += particlesPerRing;
    });

    // ==========================================
    // 第二部分：背景散落 (剩余 15%)
    // ==========================================
    // 只有原子环太死板，加一点随机的“噪点”增加真实感
    const scatterCount = CONFIG.debrisCount - currentCount;
    for(let i=0; i<scatterCount; i++) {
        const index = currentCount + i;
        const theta = Math.random() * Math.PI * 2; 
        const alt = 400 + Math.random() * 36000; // 全高度覆盖
        const radius = (CONFIG.earthR + alt) * CONFIG.scale;
        
        // 完全随机的角度，打破秩序感
        const inc = Math.acos(2 * Math.random() - 1); 
        const raan = Math.random() * Math.PI * 2;

        addDebris(index, radius, theta, raan, inc);
    }

    // --- 辅助函数：生成并放置一个碎片 ---
    function addDebris(index, radius, theta, raan, inc) {
        debrisData.push({
            radius, theta, raan, inc,
            speed: (0.6 * Math.sqrt(R/radius)) * (Math.random()>0.5?1:-1)
        });

        const cT = Math.cos(theta), sT = Math.sin(theta);
        const cI = Math.cos(inc), sI = Math.sin(inc);
        const cR = Math.cos(raan), sR = Math.sin(raan);
        
        const x = radius * (cR * cT - sR * sT * cI);
        const z = radius * (sR * cT + cR * sT * cI);
        const y = radius * (sT * sI);

        dummy.position.set(x, y, z);
        
        // 让碎片随机自转，更有质感
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        dummy.updateMatrix();
        debrisMesh.setMatrixAt(index, dummy.matrix);
        // 统一纯白色
        debrisMesh.setColorAt(index, color.setHex(0xffffff));
    }
    
    return { mesh: debrisMesh, data: debrisData };
}