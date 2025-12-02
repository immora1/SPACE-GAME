export const CONFIG = {
    earthR: 6371, 
    scale: 0.001,
    debrisCount: 3000, // 稍微减少一点数量，保持画面干净
    collisionProb: 0.002, 
    monthsToWin: 36,
    secondsPerMonth: 5,
    startArmor: 100
};
export const R = CONFIG.earthR * CONFIG.scale;