import { state } from './state.js';
import { CONFIG } from './config.js'; // 引入配置以判断范围

export function initUI() {
    // ... (保持原有的 initUI 代码不变) ...
    console.log("UI Module Loaded");
    // ... (复制你之前的事件绑定代码) ...
    // 为节省篇幅，这里假设之前的 initUI 代码保留
    
    // 仅需确保 retryBtn 等逻辑存在
    const retryBtn = document.getElementById('retry-btn');
    if(retryBtn) retryBtn.addEventListener('click', () => location.reload());
    // ... (轨道按钮逻辑保持不变)
    const orbitBtns = document.querySelectorAll('.orbit-pill'); 
    orbitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const alt = parseInt(target.dataset.alt);
            if(isNaN(alt)) return;
            state.targetAlt = alt;
            orbitBtns.forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });
    // ... (倾角和速度逻辑保持不变) ...
    const speedRange = document.getElementById('speedRange');
    const speedVal = document.getElementById('speedVal');
    if(speedRange) {
        speedRange.addEventListener('input', (e) => {
            state.timeScale = parseFloat(e.target.value);
            if(speedVal) speedVal.innerText = "x" + state.timeScale;
        });
    }
    const incMinus = document.getElementById('inc-minus');
    const incPlus = document.getElementById('inc-plus');
    const incDisplay = document.getElementById('incVal');
    const updateInc = () => {
        state.targetInc = state.currentIncDeg * (Math.PI / 180);
        if(incDisplay) incDisplay.innerText = state.currentIncDeg + "°";
    };
    if(incMinus) incMinus.addEventListener('click', () => { state.currentIncDeg -= 5; updateInc(); });
    if(incPlus) incPlus.addEventListener('click', () => { state.currentIncDeg += 5; updateInc(); });
}

// === 核心修改：HUD 更新逻辑 ===
export function updateHUD() {
    const fuelBarWrapper = document.querySelector('.fuel-track'); // 找到父容器或者body
    const fuelBar = document.getElementById('fuel-bar');
    const zoneDisplay = document.getElementById('zone-display');
    
    if(fuelBar) {
        fuelBar.style.width = Math.max(0, state.fuel) + "%";
        
        // 视觉反馈：根据当前高度切换样式类
        // 我们通过给 body 或容器加类名来控制
        const body = document.body;
        
        // 状态判断
        if (state.targetAlt <= 2000) {
            // LEO 模式
            body.classList.add('fuel-mode-leo');
            body.classList.remove('fuel-mode-geo');
            if(zoneDisplay) {
                zoneDisplay.className = "value-mono zone-leo";
                // zoneDisplay.innerText = "LEO / OPTIMAL"; // 可选：更改文字提示
            }
        } else if (state.targetAlt >= 30000) {
            // GEO 模式
            body.classList.remove('fuel-mode-leo');
            body.classList.add('fuel-mode-geo');
            if(zoneDisplay) {
                zoneDisplay.className = "value-mono zone-geo";
            }
        } else {
            // MEO (默认)
            body.classList.remove('fuel-mode-leo');
            body.classList.remove('fuel-mode-geo');
            if(zoneDisplay) {
                zoneDisplay.className = "value-mono zone-meo";
            }
        }
    }

    const integ = document.getElementById('integrity');
    if(integ) integ.innerText = Math.floor(state.armor) + "%";

    const time = document.getElementById('month-display');
    if(time) time.innerText = state.currentMonth.toFixed(1);
    
    // 左上角显示详细信息
    if(zoneDisplay) {
        // 显示当前高度和风险等级
        const risk = state.targetAlt > 30000 ? "CRITICAL" : (state.targetAlt < 2000 ? "HIGH FREQ" : "MODERATE");
        zoneDisplay.innerText = `${state.targetAlt}KM / ${risk}`;
    }
}

export function showGameOver(win, reason) {
    const screen = document.getElementById('game-over');
    if(screen) {
        screen.style.display = 'flex';
        document.getElementById('end-status').innerText = win ? "MISSION SUCCESS" : "MISSION FAILED";
        document.getElementById('end-reason').innerText = reason;
    }
}