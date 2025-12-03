export const CONFIG = {
    earthR: 6371, 
    scale: 0.001,
    // 【关键修改】数量从 3000 -> 8000
    debrisCount: 8000, 
    
    // 稍微降低一点碰撞概率，因为现在垃圾太多了，不然太难玩
    collisionProb: 0.001, 
    
    monthsToWin: 36,
    secondsPerMonth: 5,
    startArmor: 100
};
export const R = CONFIG.earthR * CONFIG.scale;