import * as THREE from 'three';

export function createSatellite() {
    const satWrapper = new THREE.Group(); 
    
    // --- 1. 轨道线 ---
    const baseCurve = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);
    const points2D = baseCurve.getPoints(100);
    const points3D = points2D.map(p => new THREE.Vector3(p.x, p.y, 0));
    const orbitCurve = new THREE.CatmullRomCurve3(points3D);
    orbitCurve.closed = true;

    // 保持细管子 (0.005)
    const orbitGeo = new THREE.TubeGeometry(orbitCurve, 128, 0.005, 8, true);
    
    // 【修改点】：换回 MeshBasicMaterial
    // 这种材质不参与光照计算，永远保持你设定的颜色 (纯白)
    const orbitMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,       
        transparent: true, 
        opacity: 0.6,          // 适当的透明度
        side: THREE.DoubleSide,
        
        // 保持物理遮挡逻辑：
        depthTest: true,  // 被地球挡住
        depthWrite: false // 不挡住卫星
    });
    
    const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
    orbitLine.rotation.x = Math.PI / 2;
    orbitLine.renderOrder = 1; 
    
    satWrapper.add(orbitLine);


    // --- 2. 卫星 (保持不变) ---
    const satMesh = new THREE.Group();
    satMesh.renderOrder = 999;

    const bodyMat = new THREE.MeshPhongMaterial({ 
        color: 0xffffff, 
        emissive: 0x333333, 
        shininess: 100
    });
    const panelMat = new THREE.MeshPhongMaterial({ 
        color: 0x3366ff, 
        emissive: 0x112244, 
        shininess: 80
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), bodyMat);
    satMesh.add(body);

    const panelGeo = new THREE.BoxGeometry(0.05, 0.25, 0.9);
    
    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.x = -0.3;
    satMesh.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.x = 0.3;
    satMesh.add(rightPanel);
    
    satWrapper.add(satMesh);

    return { wrapper: satWrapper, mesh: satMesh, orbit: orbitLine };
}