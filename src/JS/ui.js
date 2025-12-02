import { state } from './state.js';

export function initUI() {
    // 1. 轨道选择按钮
    document.querySelectorAll('.orbit-btn').forEach(btn => {
        // 排除掉没有数据的元素（防止报错）
        if(!btn.dataset.alt) return;

        btn.addEventListener('click', (e) => {
            // 【核心修复】将 e.target 改为 e.currentTarget
            // 这样无论你点到文字、边缘还是缝隙，它都能精准识别到这个按钮
            const targetBtn = e.currentTarget;
            
            const alt = parseInt(targetBtn.dataset.alt);
            
            // 防止无效数据导致的模型消失
            if (isNaN(alt)) return; 

            state.targetAlt = alt;
            
            // 按钮高亮切换
            document.querySelectorAll('.orbit-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            
            // 文字更新
            const zDiv = document.getElementById('zone-display');
            if(zDiv) {
                if(alt < 2000) zDiv.innerText = `LEO / ${alt}KM`;
                else if(alt > 30000) zDiv.innerText = `GEO / ${alt}KM`;
                else zDiv.innerText = `MEO / ${alt}KM`;
            }
        });
    });

    // 2. 倾角控制
    const updateInc = () => {
        state.targetInc = state.currentIncDeg * (Math.PI / 180);
        const incEl = document.getElementById('incVal');
        if(incEl) incEl.innerText = state.currentIncDeg + "°";
    };
    
    // 同样加上安全检查
    const incMinus = document.getElementById('inc-minus');
    if(incMinus) incMinus.addEventListener('click', () => { state.currentIncDeg -= 5; updateInc(); });
    
    const incPlus = document.getElementById('inc-plus');
    if(incPlus) incPlus.addEventListener('click', () => { state.currentIncDeg += 5; updateInc(); });

    // 3. 速度控制
    const speedRange = document.getElementById('speedRange');
    if(speedRange) {
        speedRange.addEventListener('input', (e) => {
            state.timeScale = parseFloat(e.target.value);
            const speedVal = document.getElementById('speedVal');
            if(speedVal) speedVal.innerText = "x" + state.timeScale;
        });
    }

    // 4. 重试按钮
    const retryBtn = document.getElementById('retry-btn');
    if(retryBtn) retryBtn.addEventListener('click', () => location.reload());
}

export function updateHUD() {
    // 燃料条
    const fuelEl = document.getElementById('fuel-bar');
    if(fuelEl) fuelEl.style.width = state.fuel + "%";

    // 完整性
    const integ = document.getElementById('integrity');
    if(integ) integ.innerText = Math.floor(state.armor) + "%";

    // 时间
    const monthEl = document.getElementById('month-display');
    if(monthEl) monthEl.innerText = state.currentMonth.toFixed(1);
}

export function showGameOver(win, reason) {
    const screen = document.getElementById('game-over');
    if(screen) screen.style.display = 'flex';
    
    const h1 = document.getElementById('end-status');
    if(h1) h1.innerText = win ? "MISSION SUCCESS" : "SIGNAL LOST";
    
    const reasonEl = document.getElementById('end-reason');
    if(reasonEl) reasonEl.innerText = reason;
}