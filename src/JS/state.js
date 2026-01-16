import { CONFIG } from './config.js';

export const state = {
    // === 核心状态 ===
    active: true,      // 游戏是否进行中
    totalTime: 0,      // 游戏总运行时间 (秒)
    currentMonth: 0,   // 当前游戏内月份
    
    // === 玩家生存属性 ===
    armor: CONFIG.startArmor,
    fuel: 100,
    
    // === 飞行参数 ===
    timeScale: 1.0,    // 时间流逝倍率
    targetAlt: 550,    // 目标高度
    targetInc: 20 * Math.PI / 180, // 目标倾角 (弧度)
    currentIncDeg: 20, // 当前倾角 (度数, 用于 UI 显示)
    satAngle: 0,       // 卫星当前角度 (用于动画)
    
    // === 视觉状态 ===
    currentZoneConfig: null, // 当前所处区域的配置 (用于变色)

    // === 【新增】统计数据 (用于最终结算) ===
    // 必须在这里预先定义，否则 main.js 读取时会报错导致卡死
    stats: {
        collisionCount: 0,    // 被碰撞次数
        avoidanceCount: 0,    // 变轨/避让次数 (倾角变化)
        eventHistory: [],     // 发生的事件列表
        orbitTime: {},        // 记录在每个轨道停留的时间 { '550': 12.5, '800': 0 ... }
    }
};