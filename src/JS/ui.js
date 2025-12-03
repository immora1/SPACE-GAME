import { state } from './state.js';

export function initUI() {
    console.log("UI Module Loaded");

    // 绑定所有带 data-alt 属性的按钮
    const orbitBtns = document.querySelectorAll('.orbit-btn');
    orbitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log("Button clicked!"); // 调试
            
            const target = e.currentTarget;
            const alt = parseInt(target.dataset.alt);
            if(isNaN(alt)) return;

            state.targetAlt = alt;

            // 切换激活样式
            orbitBtns.forEach(b => b.classList.remove('active'));
            target.classList.add('active');

            // 更新文字
            const display = document.getElementById('zone-display');
            if(display) {
                let name = "MEO";
                if(alt < 2000) name = "LEO";
                if(alt > 30000) name = "GEO";
                display.innerText = `${name} / ${alt}KM`;
            }
        });
    });

    // 倾角控制
    const incMinus = document.getElementById('inc-minus');
    const incPlus = document.getElementById('inc-plus');
    const incDisplay = document.getElementById('incVal');

    const updateInc = () => {
        state.targetInc = state.currentIncDeg * (Math.PI / 180);
        if(incDisplay) incDisplay.innerText = state.currentIncDeg + "°";
    };

    if(incMinus) incMinus.addEventListener('click', () => {
        state.currentIncDeg -= 5;
        updateInc();
    });

    if(incPlus) incPlus.addEventListener('click', () => {
        state.currentIncDeg += 5;
        updateInc();
    });

    // 速度滑块
    const speedRange = document.getElementById('speedRange');
    const speedVal = document.getElementById('speedVal');
    if(speedRange) {
        speedRange.addEventListener('input', (e) => {
            state.timeScale = parseFloat(e.target.value);
            if(speedVal) speedVal.innerText = "x" + state.timeScale;
        });
    }

    // 重试
    const retryBtn = document.getElementById('retry-btn');
    if(retryBtn) retryBtn.addEventListener('click', () => location.reload());
}

export function updateHUD() {
    const fuelBar = document.getElementById('fuel-bar');
    if(fuelBar) fuelBar.style.width = state.fuel + "%";

    const integ = document.getElementById('integrity');
    if(integ) integ.innerText = Math.floor(state.armor) + "%";

    const time = document.getElementById('month-display');
    if(time) time.innerText = state.currentMonth.toFixed(1);
}

export function showGameOver(win, reason) {
    const screen = document.getElementById('game-over');
    if(screen) {
        screen.style.display = 'flex';
        document.getElementById('end-status').innerText = win ? "MISSION SUCCESS" : "MISSION FAILED";
        document.getElementById('end-reason').innerText = reason;
    }
}