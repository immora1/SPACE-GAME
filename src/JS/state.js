import { CONFIG } from './config.js';

export const state = {
    active: true,
    totalTime: 0,
    currentMonth: 0,
    armor: CONFIG.startArmor,
    fuel: 100,
    timeScale: 1.0,
    targetAlt: 550, 
    targetInc: 20 * Math.PI / 180,
    currentIncDeg: 20,
    satAngle: 0
};