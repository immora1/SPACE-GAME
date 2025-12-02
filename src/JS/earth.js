import * as THREE from 'three';
import { R } from './config.js';

export function createEarth() {
    const earthGroup = new THREE.Group();

    // 1. 核心：纯黑哑光球体 (吸光)
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(R, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0x000000 }) 
    );
    earthGroup.add(earth);

    // 2. 线框：极细的深灰色线条 (表现结构)
    const wireframe = new THREE.Mesh(
        new THREE.SphereGeometry(R + 0.05, 32, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0x333333, // 深灰线
            wireframe: true, 
            transparent: true, 
            opacity: 0.3 
        })
    );
    earthGroup.add(wireframe);

    // 3. 边缘光：去掉原本的绿色大气，改为极其微弱的白边
    const outline = new THREE.Mesh(
        new THREE.SphereGeometry(R + 0.1, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.05, // 极淡
            blending: THREE.AdditiveBlending
        })
    );
    earthGroup.add(outline);

    return earthGroup;
}