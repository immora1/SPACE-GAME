import * as THREE from 'three';

export function createSatellite() {
    const satWrapper = new THREE.Group(); 
    
    // --- 1. 轨道环 (保持不变) ---
    const baseCurve = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);
    const points2D = baseCurve.getPoints(100);
    const points3D = points2D.map(p => new THREE.Vector3(p.x, p.y, 0));
    const orbitCurve = new THREE.CatmullRomCurve3(points3D);
    orbitCurve.closed = true;

    const orbitGeo = new THREE.TubeGeometry(orbitCurve, 128, 0.01, 16, true);
    const orbitMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,       
        side: THREE.DoubleSide
    });
    
    const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
    orbitLine.rotation.x = Math.PI / 2;
    satWrapper.add(orbitLine);


    // --- 2. 卫星本体 (全新的 CubeSat 设计) ---
    const satMesh = new THREE.Group();
    satMesh.renderOrder = 999; 
    
    // 材质定义
    const coreMat = new THREE.MeshPhongMaterial({ 
        color: 0xcccccc,      // 浅灰色核心
        specular: 0xaaaaaa,   
        shininess: 60         
    });
    const frameMat = new THREE.MeshPhongMaterial({ 
        color: 0x444444,      // 深灰色框架
        specular: 0x777777,   
        shininess: 30 
    });
    const panelMat = new THREE.MeshLambertMaterial({ 
        color: 0x3b82f6,      // 科技蓝自发光太阳能板
        emissive: 0x3b82f6,   // 自发光颜色
        emissiveIntensity: 1.5, // 自发光强度
        side: THREE.DoubleSide 
    });
    const screenMat = new THREE.MeshBasicMaterial({ // 模拟屏幕，纯色自发光
        color: 0x00ffcc,      // 绿松石屏幕光
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8
    });
    const detailMat = new THREE.MeshPhongMaterial({
        color: 0x999999,      // 细节件
        specular: 0xbbbbbb,
        shininess: 40
    });
    
    const cubeSize = 0.5; // 立方体核心尺寸
    const frameThickness = 0.02; // 框架厚度
    const panelThickness = 0.005; // 太阳能板厚度，非常薄

    // --- 主体核心立方体 ---
    const coreCube = new THREE.Mesh(
        new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), 
        coreMat
    );
    satMesh.add(coreCube);

    // --- 外骨骼框架 ---
    // 创建一个 LineSegments 或 TubeGeometry 来模拟框架
    const frameEdgeGeo = new THREE.BoxGeometry(cubeSize + frameThickness*2, frameThickness, frameThickness);
    const frameCornerGeo = new THREE.BoxGeometry(frameThickness, cubeSize + frameThickness*2, frameThickness);

    // 12 根边
    for (let i = 0; i < 4; i++) {
        // Z轴方向的四条边
        const edgeZ = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, frameThickness, cubeSize + frameThickness*2), frameMat);
        edgeZ.position.set(
            (cubeSize / 2 + frameThickness / 2) * (i % 2 === 0 ? 1 : -1),
            (cubeSize / 2 + frameThickness / 2) * (Math.floor(i / 2) === 0 ? 1 : -1),
            0
        );
        coreCube.add(edgeZ);

        // X轴方向的四条边
        const edgeX = new THREE.Mesh(new THREE.BoxGeometry(cubeSize + frameThickness*2, frameThickness, frameThickness), frameMat);
        edgeX.position.set(
            0,
            (cubeSize / 2 + frameThickness / 2) * (i % 2 === 0 ? 1 : -1),
            (cubeSize / 2 + frameThickness / 2) * (Math.floor(i / 2) === 0 ? 1 : -1)
        );
        coreCube.add(edgeX);

        // Y轴方向的四条边
        const edgeY = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, cubeSize + frameThickness*2, frameThickness), frameMat);
        edgeY.position.set(
            (cubeSize / 2 + frameThickness / 2) * (i % 2 === 0 ? 1 : -1),
            0,
            (cubeSize / 2 + frameThickness / 2) * (Math.floor(i / 2) === 0 ? 1 : -1)
        );
        coreCube.add(edgeY);
    }
    // 简化创建框架
    // const frameBase = new THREE.Group();
    // const rodGeo = new THREE.BoxGeometry(frameThickness, frameThickness, cubeSize + frameThickness*2);
    // for(let i=0; i<4; i++){
    //     const rod = new THREE.Mesh(rodGeo, frameMat);
    //     rod.position.set( (cubeSize/2)*(i%2===0?1:-1), (cubeSize/2)*(Math.floor(i/2)===0?1:-1), 0 );
    //     rod.rotation.z = Math.PI/2 * i;
    //     frameBase.add(rod);
    // }
    // coreCube.add(frameBase);


    // --- 模拟屏幕/电子元件 (贴在立方体侧面) ---
    const screenPlaneGeo = new THREE.PlaneGeometry(cubeSize * 0.7, cubeSize * 0.4);
    const screen = new THREE.Mesh(screenPlaneGeo, screenMat);
    screen.position.set(0, 0, cubeSize / 2 + frameThickness); // 稍微伸出框架外
    coreCube.add(screen);

    // --- 太阳能板 (薄而发光) ---
    const panelWidth = 0.8;
    const panelLength = 1.6;
    const panelGeometry = new THREE.BoxGeometry(panelLength, panelThickness, panelWidth);

    const armLength = 0.3; // 连接臂长度
    const armThickness = 0.03; // 连接臂厚度
    const armGeo = new THREE.BoxGeometry(armLength, armThickness, armThickness); 

    // 左侧太阳能板
    const leftArm = new THREE.Mesh(armGeo, frameMat);
    leftArm.position.x = -(cubeSize / 2 + armLength / 2 + frameThickness); // 从框架中心向外伸出
    coreCube.add(leftArm);

    const leftPanel = new THREE.Mesh(panelGeometry, panelMat);
    leftPanel.position.x = -(panelLength / 2 + armLength / 2 + cubeSize / 2 + frameThickness); // 连接臂末端
    leftPanel.rotation.y = Math.PI / 2; // 旋转，使其宽面朝外
    coreCube.add(leftPanel); 

    // 右侧太阳能板
    const rightArm = new THREE.Mesh(armGeo, frameMat);
    rightArm.position.x = (cubeSize / 2 + armLength / 2 + frameThickness);
    coreCube.add(rightArm);

    const rightPanel = new THREE.Mesh(panelGeometry, panelMat);
    rightPanel.position.x = (panelLength / 2 + armLength / 2 + cubeSize / 2 + frameThickness);
    rightPanel.rotation.y = Math.PI / 2;
    coreCube.add(rightPanel);

    // --- 底部支撑杆 (连接到轨道) ---
    const supportRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 30, 8); // 细长杆
    const supportRodMat = new THREE.MeshBasicMaterial({ color: 0x999999 }); // 简单材质
    const supportRod = new THREE.Mesh(supportRodGeo, supportRodMat);
    supportRod.position.y = -15; // 放在卫星正下方，超长，确保能连接到轨道中心
    satMesh.add(supportRod);


    // 整体缩小一点，使其看起来更精致，符合 CubeSat 的小尺寸感
    satMesh.scale.set(0.3, 0.3, 0.3); 
    satWrapper.add(satMesh);

    return { wrapper: satWrapper, mesh: satMesh, orbit: orbitLine };
}