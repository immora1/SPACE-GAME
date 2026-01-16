import { state } from './state.js';
import { EVENT_DATABASE } from './eventData.js';

let nextEventTimer = null;
let dismissTimer = null;
let currentOrbit = null;
// 用来暂存“当前正在进行”的事件
let currentActiveEventData = null; 

// 时间配置
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
        
        // 切换轨道时，当前正在显示的事件作废
        currentActiveEventData = null; 
        hideEvent(false); 
        
        // 切换轨道时，清空底部的历史记录显示（因为环境变了）
        const container = document.getElementById('event-log-container');
        if(container) container.innerHTML = '<div class="log-placeholder">NO DATA</div>';

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
    
    // === 【新增】推送到全局统计 (用于最后的结算卡片) ===
    if (state.stats && state.stats.eventHistory) {
        state.stats.eventHistory.push(event);
    }

    // 暂存当前事件，用于底部 UI 显示
    currentActiveEventData = event;

    // 只显示大弹窗（代表“正在发生”）
    showEvent(event);     
}

function addEventToLog(data) {
    const container = document.getElementById('event-log-container');
    if (!container) return;

    container.innerHTML = ''; // 清空，保持单条记录

    const chip = document.createElement('div');
    chip.className = 'event-chip';
    if (data.type === 'HISTORY') chip.classList.add('history');
    
    chip.innerText = data.enTitle || data.title.substring(0, 8);

    // 使用 currentTarget 确保获取的是 div 元素
    chip.addEventListener('mouseenter', (e) => showTooltip(e.currentTarget, data));
    chip.addEventListener('mouseleave', hideTooltip);

    container.appendChild(chip);
}

// Tooltip 逻辑
function showTooltip(targetElement, data) {
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

    // 获取位置
    const chipRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // 1. 水平居中
    let left = chipRect.left + (chipRect.width / 2) - (tooltipRect.width / 2);
    
    // 2. 垂直位于上方 (预留 15px 间距)
    let top = chipRect.top - tooltipRect.height - 15;

    // 3. 边界检查
    if (left < 10) left = 10; 
    if (left + tooltipRect.width > window.innerWidth - 10) { 
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = chipRect.bottom + 15; 

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

    // 当弹窗关闭（事件结束）时，才把它写入底部历史显示
    if (currentActiveEventData) {
        addEventToLog(currentActiveEventData);
        currentActiveEventData = null; 
    }

    if (shouldScheduleNext) {
        scheduleNextEvent();
    }
}