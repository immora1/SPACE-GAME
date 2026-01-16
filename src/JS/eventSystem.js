import { state } from './state.js';
import { EVENT_DATABASE } from './eventData.js';

let nextEventTimer = null;
let dismissTimer = null;
let currentOrbit = null;

// 时间配置 (保持接力模式)
const GAP_TIME_MIN = 5000; 
const GAP_TIME_MAX = 8000; 
const DISPLAY_TIME = 30000;       
const FIRST_EVENT_DELAY = 5000;   

export function initEventSystem() {
    const closeBtn = document.getElementById('popup-close');
    if (closeBtn) closeBtn.onclick = () => hideEvent(true);
    
    console.log("[EventSystem] 系统启动...");
    currentOrbit = state.targetAlt;
    
    setTimeout(() => {
        triggerEvent();      
    }, FIRST_EVENT_DELAY);
    
    setInterval(checkOrbitChange, 1000);
}

function checkOrbitChange() {
    if (state.targetAlt !== currentOrbit) {
        currentOrbit = state.targetAlt;
        clearTimeout(nextEventTimer);
        clearTimeout(dismissTimer);
        
        hideEvent(false); 
        
        // 切换轨道时，顺便清空底部的事件显示，或者保留上一个也行
        // document.getElementById('event-log-container').innerHTML = '<div class="log-placeholder">NO DATA</div>';

        scheduleNextEvent();
    }
}

function scheduleNextEvent() {
    const delay = Math.random() * (GAP_TIME_MAX - GAP_TIME_MIN) + GAP_TIME_MIN;
    nextEventTimer = setTimeout(() => {
        triggerEvent();
    }, delay);
}

function triggerEvent() {
    if (!state.active) return;
    const events = EVENT_DATABASE[state.targetAlt];
    if (!events || events.length === 0) return;
    
    const event = events[Math.floor(Math.random() * events.length)];
    
    showEvent(event);     
    addEventToLog(event); 
}

// === 【修改】单条替换逻辑 ===
function addEventToLog(data) {
    const container = document.getElementById('event-log-container');
    if (!container) return;

    // 1. 直接清空容器（移除旧的）
    container.innerHTML = '';

    // 2. 创建新芯片
    const chip = document.createElement('div');
    chip.className = 'event-chip';
    if (data.type === 'HISTORY') chip.classList.add('history');
    
    // 显示英文标题 (如果没有英文标题，才截取中文)
    chip.innerText = data.enTitle || data.title.substring(0, 8);

    // 绑定悬停
    chip.addEventListener('mouseenter', (e) => showTooltip(e, data));
    chip.addEventListener('mouseleave', hideTooltip);

    // 3. 放入容器
    container.appendChild(chip);
}

// Tooltip 逻辑保持不变
function showTooltip(e, data) {
    const tooltip = document.getElementById('history-tooltip');
    if(!tooltip) return;

    const titleEl = tooltip.querySelector('.tooltip-title');
    const descEl = tooltip.querySelector('.tooltip-desc');
    const dateEl = tooltip.querySelector('.tooltip-date');

    titleEl.innerText = `${data.enTitle} / ${data.title}`;
    descEl.innerText = data.desc;
    dateEl.innerText = data.date;

    if(data.type === 'HISTORY') tooltip.classList.add('history-mode');
    else tooltip.classList.remove('history-mode');

    const chipRect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = chipRect.left + (chipRect.width / 2) - (tooltipRect.width / 2);
    if (left < 10) left = 10;
    let top = chipRect.top - tooltipRect.height - 10; 

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    tooltip.classList.add('visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('history-tooltip');
    if(tooltip) tooltip.classList.remove('visible');
}

function showEvent(data) {
    const popup = document.getElementById('event-popup');
    const nameEl = document.getElementById('popup-name');
    const descEl = document.getElementById('popup-desc');
    const dateEl = document.getElementById('popup-date');
    const imgEl = document.getElementById('popup-img');
    const labelEl = document.querySelector('.popup-label');
    const timerFill = document.getElementById('popup-timer-fill');

    if (!popup) return;

    if (data.type === 'HISTORY') {
        popup.classList.add('history');
        if(labelEl) labelEl.innerText = "ARCHIVE: HISTORY";
    } else {
        popup.classList.remove('history');
        if(labelEl) labelEl.innerText = "PRIORITY: HIGH";
    }
    nameEl.innerText = data.title;
    descEl.innerText = data.desc;
    dateEl.innerText = data.date;
    imgEl.src = data.img;

    popup.style.display = 'flex';

    if(timerFill) {
        timerFill.style.transition = 'none';
        timerFill.style.width = '100%';
        void timerFill.offsetWidth;
        timerFill.style.transition = `width ${DISPLAY_TIME}ms linear`;
        timerFill.style.width = '0%';
    }

    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => hideEvent(true), DISPLAY_TIME);
}

function hideEvent(shouldScheduleNext = true) {
    const popup = document.getElementById('event-popup');
    if (popup) popup.style.display = 'none';
    clearTimeout(dismissTimer);
    if (shouldScheduleNext) scheduleNextEvent();
}