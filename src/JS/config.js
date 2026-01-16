export const CONFIG = {
    earthR: 6371, 
    scale: 0.001,
    
    // 垃圾数量：8000 (保持你的高密度设定)
    debrisCount: 8000, 
    
    // 碰撞检测概率系数 (配合主逻辑中的距离判断)
    collisionProb: 0.001, 
    
    // 游戏胜利条件
    monthsToWin: 36,
    secondsPerMonth: 5,
    startArmor: 100,

    // === 平衡性核心参数 (Game Balancing) ===
    // 燃油消耗基数 (Kf)：值越大，变轨和高轨飞行越费油
    fuelBaseK: 2.5, 
    
    // 轨道特性表 
    // maxAlt: 该区域的上限高度 (km)
    // dmg: 单次碰撞扣除的护甲值
    // label: 警告文字
    orbitZones: {
        // 低轨 (LEO): 碎片极多，像“砂纸”一样频繁打磨，单次伤害低 (2%)
        LEO: { 
            maxAlt: 2000,  
            dmg: 2.0,  
            label: "HIGH DENSITY / LOW IMPACT" 
        },
        // 中轨 (MEO): 风险适中，单次伤害中等 (15%)
        MEO: { 
            maxAlt: 30000, 
            dmg: 15.0, 
            label: "MEDIUM DENSITY / MODERATE" 
        },
        // 高轨 (GEO): 碎片极少但致命，一旦撞击直接游戏结束 (100%)
        GEO: { 
            maxAlt: 99999, 
            dmg: 100.0, 
            label: "LOW DENSITY / CRITICAL" 
        }
    }
};

// 导出地球半径的缩放值，用于场景计算
export const R = CONFIG.earthR * CONFIG.scale;