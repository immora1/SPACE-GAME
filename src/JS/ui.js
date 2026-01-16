import { state } from './state.js';
import { CONFIG } from './config.js'; // 确保引入了 CONFIG

export function initUI() {
    console.log("UI Module Loaded");
    
    // --- 轨道选择 ---
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

    // --- 倾角控制 ---
    const incMinus = document.getElementById('inc-minus');
    const incPlus = document.getElementById('inc-plus');
    const incDisplay = document.getElementById('incVal');

    const updateInc = () => {
        state.targetInc = state.currentIncDeg * (Math.PI / 180);
        if(incDisplay) incDisplay.innerText = state.currentIncDeg + "°";
        if(state.stats) state.stats.avoidanceCount++;
    };

    if(incMinus) incMinus.addEventListener('click', () => { state.currentIncDeg -= 5; updateInc(); });
    if(incPlus) incPlus.addEventListener('click', () => { state.currentIncDeg += 5; updateInc(); });

    // --- 速度控制 ---
    const speedRange = document.getElementById('speedRange');
    const speedVal = document.getElementById('speedVal');
    if(speedRange) {
        speedRange.addEventListener('input', (e) => {
            state.timeScale = parseFloat(e.target.value);
            if(speedVal) speedVal.innerText = "x" + state.timeScale;
        });
    }
}

// === HUD 实时更新 ===
export function updateHUD() {
    const fuelBar = document.getElementById('fuel-bar');
    const zoneDisplay = document.getElementById('zone-display');
    const body = document.body;

    if(fuelBar) {
        fuelBar.style.width = Math.max(0, state.fuel) + "%";
        
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

    const integ = document.getElementById('integrity');
    if(integ) integ.innerText = Math.floor(state.armor) + "%";

    const time = document.getElementById('month-display');
    if(time) time.innerText = state.currentMonth.toFixed(1);
    
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
    
    const oldStatus = document.getElementById('end-status');
    const oldReason = document.getElementById('end-reason');
    const oldBtn = document.getElementById('retry-btn');
    if(oldStatus) oldStatus.style.display = 'none';
    if(oldReason) oldReason.style.display = 'none';
    if(oldBtn) oldBtn.style.display = 'none';

    // 1. 获取统计数据
    const { collisionCount, avoidanceCount, orbitTime } = state.stats;
    
    // 2. 计算主要轨道
    let maxTime = 0;
    let primaryOrbit = "N/A";
    for(const [alt, time] of Object.entries(orbitTime)) {
        if(time > maxTime) {
            maxTime = time;
            primaryOrbit = `${alt} KM`;
        }
    }
    
    // 3. 文案
    let headerTitle = win ? "MISSION ACCOMPLISHED" : "MISSION FAILED";
    let headerColor = win ? "#10b981" : "#ef4444"; 
    let statusText = win ? "SECURED" : "LOST";
    let btnText = win ? "RETURN TO BASE" : "ABORT MISSION"; // 按钮文字也改得更有代入感
    
    // 4. 失败分析
    let analysisHTML = "";
    if (!win) {
        let historicalEvent = "";
        let comparison = "";
        
        if (collisionCount > 10) {
            historicalEvent = "Iridium-33 Collision (2009)";
            comparison = "你的卫星遭遇了灾难性的解体。这种碎片密度与 2009 年美俄卫星相撞事件相当。";
        } else if (state.fuel <= 0) {
            historicalEvent = "Propellant Depletion";
            comparison = "燃料耗尽。在太空中，没有 ΔV 就意味着失去了掌控命运的能力。";
        } else {
            historicalEvent = "Envisat Anomaly (2012)";
            comparison = "关键系统失效。你现在是轨道上重达数吨的‘僵尸卫星’。";
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

    // 5. 构建 HTML
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
                     <button id="final-retry-btn">${btnText}</button>
                </div>
            </div>
        </div>
    `;

    screen.innerHTML = reportHTML;
    screen.style.display = 'flex';
    
    // 7. 【关键】使用配置好的绝对地址跳转
    const finalBtn = document.getElementById('final-retry-btn');
    setTimeout(() => {
        if (finalBtn) {
            finalBtn.onclick = function() {
                // 读取 config.js 中的 HOME_URL (http://localhost:5173/)
                // 这样就能跨端口跳转了
                window.location.href = CONFIG.HOME_URL;
            };
        }
    }, 100);
}

function generateOrbitViz(orbitTime, maxTime) {
    if (maxTime === 0) return `<div class="no-data">NO DATA</div>`;
    
    return Object.entries(orbitTime)
        .map(([alt, time]) => {
            const width = (time / maxTime) * 100;
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