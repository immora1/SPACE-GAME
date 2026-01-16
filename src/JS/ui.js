import { state } from './state.js';
import { CONFIG } from './config.js';

export function initUI() {
    console.log("UI Module Loaded");
    
    // --- 轨道选择 (Orbital Selection) ---
    const orbitBtns = document.querySelectorAll('.orbit-pill'); 
    orbitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const alt = parseInt(target.dataset.alt);
            if(isNaN(alt)) return;
            
            // 1. 更新目标高度
            state.targetAlt = alt;
            
            // 2. 更新按钮 UI
            orbitBtns.forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // --- 倾角控制 (Inclination) ---
    const incMinus = document.getElementById('inc-minus');
    const incPlus = document.getElementById('inc-plus');
    const incDisplay = document.getElementById('incVal');

    const updateInc = () => {
        state.targetInc = state.currentIncDeg * (Math.PI / 180);
        if(incDisplay) incDisplay.innerText = state.currentIncDeg + "°";
        
        // 【统计】记录一次变轨操作
        if(state.stats) state.stats.avoidanceCount++;
    };

    if(incMinus) incMinus.addEventListener('click', () => { state.currentIncDeg -= 5; updateInc(); });
    if(incPlus) incPlus.addEventListener('click', () => { state.currentIncDeg += 5; updateInc(); });

    // --- 速度控制 (Speed) ---
    const speedRange = document.getElementById('speedRange');
    const speedVal = document.getElementById('speedVal');
    if(speedRange) {
        speedRange.addEventListener('input', (e) => {
            state.timeScale = parseFloat(e.target.value);
            if(speedVal) speedVal.innerText = "x" + state.timeScale;
        });
    }
}

// === HUD 实时更新 (左上角 + 进度条) ===
export function updateHUD() {
    const fuelBar = document.getElementById('fuel-bar');
    const zoneDisplay = document.getElementById('zone-display');
    const body = document.body;

    // 燃油条更新
    if(fuelBar) {
        fuelBar.style.width = Math.max(0, state.fuel) + "%";
        
        // 根据高度改变 UI 主题色
        if (state.targetAlt <= 2000) {
            body.classList.add('fuel-mode-leo'); 
            body.classList.remove('fuel-mode-geo');
            if(zoneDisplay) zoneDisplay.className = "value-mono zone-leo";
        } else if (state.targetAlt >= 30000) {
            body.classList.remove('fuel-mode-leo'); 
            body.classList.add('fuel-mode-geo');
            if(zoneDisplay) zoneDisplay.className = "value-mono zone-geo";
        } else {
            body.classList.remove('fuel-mode-leo'); 
            body.classList.remove('fuel-mode-geo');
            if(zoneDisplay) zoneDisplay.className = "value-mono zone-meo";
        }
    }

    // 护甲与时间
    const integ = document.getElementById('integrity');
    if(integ) integ.innerText = Math.floor(state.armor) + "%";

    const time = document.getElementById('month-display');
    if(time) time.innerText = state.currentMonth.toFixed(1);
    
    // 区域文字提示
    if(zoneDisplay) {
        const risk = state.targetAlt > 30000 ? "CRITICAL" : (state.targetAlt < 2000 ? "HIGH FREQ" : "MODERATE");
        zoneDisplay.innerText = `${state.targetAlt}KM / ${risk}`;
    }
}

// ===============================================
// 🚀 核心：生成“任务结算船票”
// ===============================================
export function showGameOver(win, reason) {
    const screen = document.getElementById('game-over');
    if(!screen) return;
    
    // 隐藏旧的简单文字
    const oldStatus = document.getElementById('end-status');
    const oldReason = document.getElementById('end-reason');
    if(oldStatus) oldStatus.style.display = 'none';
    if(oldReason) oldReason.style.display = 'none';
    
    // 隐藏原来的重试按钮（我们会生成一个新的在卡片里）
    const oldBtn = document.getElementById('retry-btn');
    if(oldBtn) oldBtn.style.display = 'none';

    // 1. 获取统计数据
    const { collisionCount, avoidanceCount, orbitTime } = state.stats;
    
    // 2. 计算主要轨道 (停留时间最长)
    let maxTime = 0;
    let primaryOrbit = "N/A";
    for(const [alt, time] of Object.entries(orbitTime)) {
        if(time > maxTime) {
            maxTime = time;
            primaryOrbit = `${alt} KM`;
        }
    }
    
    // 3. 胜负配色与文案
    let headerTitle = win ? "MISSION ACCOMPLISHED" : "MISSION FAILED";
    let headerColor = win ? "#10b981" : "#ef4444"; // 绿 vs 红
    let statusText = win ? "SECURED" : "LOST";
    
    // 4. 失败分析 (科普部分)
    let analysisHTML = "";
    if (!win) {
        let historicalEvent = "";
        let comparison = "";
        
        if (collisionCount > 10) {
            historicalEvent = "Iridium-33 Collision (2009)";
            comparison = "你的卫星遭遇了灾难性的解体。这种碎片密度与 2009 年美俄卫星相撞事件相当，当时产生了超过 2000 块碎片。";
        } else if (state.fuel <= 0) {
            historicalEvent = "Propellant Depletion";
            comparison = "燃料耗尽。在太空中，没有 ΔV (速度增量) 就意味着失去了掌控命运的能力。";
        } else {
            historicalEvent = "Envisat Anomaly (2012)";
            comparison = "关键系统失效。就像 Envisat 一样，你现在是轨道上重达数吨的‘僵尸卫星’，对他人构成了巨大威胁。";
        }

        analysisHTML = `
            <div class="report-section analysis">
                <div class="sec-title">FAILURE ANALYSIS</div>
                <div class="analysis-box">
                    <div class="history-ref">SIMILAR TO: <span>${historicalEvent}</span></div>
                    <p>${comparison}</p>
                </div>
            </div>
        `;
    }

    // 5. 构建完整的 HTML 结构 (船票)
    const reportHTML = `
        <div class="mission-ticket">
            <div class="ticket-stub">
                <div class="stub-header">
                    <span class="agency">ORBITAL WATCH</span>
                    <span class="date">${new Date().toLocaleDateString()}</span>
                </div>
                <div class="barcode"></div>
                <div class="flight-no">FLIGHT #${Math.floor(Math.random()*9000)+1000}</div>
                <div class="stub-status" style="color: ${headerColor}">${statusText}</div>
            </div>

            <div class="ticket-body">
                <div class="ticket-header">
                    <h1 style="color: ${headerColor}">${headerTitle}</h1>
                    <div class="reason-tag">${reason}</div>
                </div>

                <div class="data-grid">
                    <div class="data-item">
                        <div class="data-label">IMPACTS</div>
                        <div class="data-value">${collisionCount}</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">MANEUVERS</div>
                        <div class="data-value">${avoidanceCount}</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">PRIMARY ORBIT</div>
                        <div class="data-value">${primaryOrbit}</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">DURATION</div>
                        <div class="data-value">${state.currentMonth.toFixed(1)} MO</div>
                    </div>
                </div>

                <div class="report-section">
                    <div class="sec-title">ORBITAL PROFILE</div>
                    <div class="viz-bar-container">
                        ${generateOrbitViz(orbitTime, maxTime)}
                    </div>
                </div>

                ${analysisHTML}

                <div class="ticket-footer">
                     <button id="final-retry-btn">REBOOT SYSTEM</button>
                </div>
            </div>
        </div>
    `;

    // 6. 注入 HTML 并显示
    screen.innerHTML = reportHTML;
    screen.style.display = 'flex';
    
    // 7. 绑定新按钮的点击事件 (回到首页)
    const finalBtn = document.getElementById('final-retry-btn');
    if (finalBtn) {
        finalBtn.addEventListener('click', () => {
            // 强制跳转回根目录 (即刷新回到 http://localhost:5173/)
            window.location.href = "/";
        });
    }
}

// 辅助函数：生成简易的条形图 HTML
function generateOrbitViz(orbitTime, maxTime) {
    if (maxTime === 0) return `<div class="no-data">NO DATA</div>`;
    
    return Object.entries(orbitTime)
        .map(([alt, time]) => {
            const width = (time / maxTime) * 100;
            // 只显示停留时间超过 5% 的轨道，避免图表太乱
            if(width < 5) return ''; 
            return `
                <div class="viz-row">
                    <span class="viz-label">${alt}KM</span>
                    <div class="viz-track">
                        <div class="viz-fill" style="width: ${width}%"></div>
                    </div>
                </div>
            `;
        }).join('');
}