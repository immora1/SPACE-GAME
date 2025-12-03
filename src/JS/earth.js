import * as THREE from 'three';
import { R } from './config.js';

export function createEarth() {
    const earthGroup = new THREE.Group();
    const texLoader = new THREE.TextureLoader();

    // 调色板 (在这里修改颜色)
    const COLORS = {
        land: '#f0e6d2',   // 米色陆地
        ocean: '#4b8fb3',  // 灰蓝海洋
        outline: '#000000' // 黑色描边
    };

    // 资源加载
    const maskUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg';
    const earthMask = texLoader.load(maskUrl);
    
    // 纸张纹理 (bump map)
    const paperUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big.jpg';
    const paperTex = texLoader.load(paperUrl);
    paperTex.wrapS = paperTex.wrapT = THREE.RepeatWrapping;
    paperTex.repeat.set(5, 5);

    // 1. 陆地层 (Cartoon Style)
    const landGeo = new THREE.SphereGeometry(R, 64, 64);
    const landMat = new THREE.MeshToonMaterial({
        color: COLORS.land,
        bumpMap: paperTex,
        bumpScale: 0.05
    });
    const landMesh = new THREE.Mesh(landGeo, landMat);
    earthGroup.add(landMesh);

    // 2. 海洋层
    const oceanGeo = new THREE.SphereGeometry(R + 0.01, 64, 64);
    const oceanMat = new THREE.MeshToonMaterial({
        color: COLORS.ocean,
        alphaMap: earthMask,
        transparent: true,
        bumpMap: paperTex,
        bumpScale: 0.05,
        side: THREE.DoubleSide,
        opacity: 0.9
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    earthGroup.add(oceanMesh);

    // 3. 描边层 (Outline)
    const outlineGeo = new THREE.SphereGeometry(R + 0.12, 64, 64);
    const outlineMat = new THREE.MeshBasicMaterial({
        color: COLORS.outline,
        side: THREE.BackSide // 背面渲染实现描边
    });
    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    earthGroup.add(outlineMesh);

    return earthGroup;
}