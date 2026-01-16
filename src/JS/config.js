export const CONFIG = {
    earthR: 6371, 
    scale: 0.001,
    
    // 垃圾数量
    debrisCount: 8000, 
    
    // 碰撞检测概率系数
    collisionProb: 0.001, 
    
    // 游戏胜利条件
    monthsToWin: 36,
    secondsPerMonth: 5,
    startArmor: 100,

    // === 【关键修改】设置你的主页地址 ===
    // 本地开发时填 http://localhost:5173/
    // 如果以后发布上线了，记得回来改成你的正式域名
    HOME_URL: "http://localhost:5173/", 

    // === 平衡性核心参数 ===
    fuelBaseK: 2.5, 
    
    // 轨道特性表 
    orbitZones: {
        LEO: { 
            maxAlt: 2000,  
            dmg: 2.0,  
            label: "HIGH DENSITY / LOW IMPACT" 
        },
        MEO: { 
            maxAlt: 30000, 
            dmg: 15.0, 
            label: "MEDIUM DENSITY / MODERATE" 
        },
        GEO: { 
            maxAlt: 99999, 
            dmg: 100.0, 
            label: "LOW DENSITY / CRITICAL" 
        }
    }
};

export const R = CONFIG.earthR * CONFIG.scale;