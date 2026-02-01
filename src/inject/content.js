// src/inject/content.js - v11.0 Shadow Mode
console.log(">arch: System Initializing...");

// --- 1. MOTOR DE GRABACIÓN (SHADOW RECORDER) ---
window.ShadowRecorder = {
    isRecording: false,
    logs: [],
    
    start: function() {
        this.isRecording = true;
        this.logs = [`[SESSION START] URL: ${window.location.href}`];
        console.log(">arch: Shadow Recording Started 🔴");
        
        // Listeners
        document.addEventListener('click', this.logClick, true);
        document.addEventListener('input', this.logInput, true);
        // Throttle scroll para no llenar el log
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScroll > 1000) { // Solo 1 vez por segundo
                this.logs.push(`[SCROLL] To ${window.scrollY}px`);
                lastScroll = now;
            }
        });
    },

    stop: function() {
        this.isRecording = false;
        document.removeEventListener('click', this.logClick, true);
        document.removeEventListener('input', this.logInput, true);
        this.logs.push(`[SESSION END] Duration: ${this.logs.length} events.`);
        console.log(">arch: Shadow Recording Stopped ⏹️");
        return this.logs.join('\n');
    },

    // Helpers
    getElementRef: function(el) {
        let id = el.id ? `#${el.id}` : '';
        let cls = el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0]}` : '';
        let text = el.innerText ? ` ("${el.innerText.substring(0, 20)}...")` : '';
        return `${el.tagName}${id}${cls}${text}`;
    },

    logClick: function(e) {
        if (!window.ShadowRecorder.isRecording) return;
        const ref = window.ShadowRecorder.getElementRef(e.target);
        window.ShadowRecorder.logs.push(`[CLICK] on ${ref}`);
    },

    logInput: function(e) {
        if (!window.ShadowRecorder.isRecording) return;
        const ref = window.ShadowRecorder.getElementRef(e.target);
        window.ShadowRecorder.logs.push(`[TYPE] in ${ref}`);
    }
};

// --- 2. SELECTOR Y INYECTOR (TU CÓDIGO CLÁSICO) ---
function getActiveTextarea() {
    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.isContentEditable)) return active;
    const selectors = ['#prompt-textarea', 'div[contenteditable="true"]', 'textarea[data-testid="chat-input"]', 'textarea'];
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
    }
    return null;
}

function safeInsert(element, text) {
    if (!element) return false;
    element.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, text);
    // Fallback para React inputs
    const proto = element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLElement.prototype;
    const setNative = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setNative) {
        setNative.call(element, text);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
}

// --- 3. INICIALIZADOR ---
function launchArch() {
    if (!window.TemplateManager || !window.ArchUI) {
        setTimeout(launchArch, 500);
        return;
    }
    if (document.querySelector('.arch-trigger')) return;

    window.TemplateManager.getAll().then(templates => {
        window.ArchUI.create(templates, (finalText) => {
            const target = getActiveTextarea();
            if (!target) { alert("Click on chat first."); return; }
            
            // Compilación Final
            const currentVal = target.value || "";
            const fullyCompiled = window.TemplateManager.compile(finalText, currentVal);
            safeInsert(target, fullyCompiled);
        });
        console.log(">arch: Shadow Engine Ready 🟢");
    });
}

const watcher = new MutationObserver(() => {
    if (!document.querySelector('.arch-trigger')) launchArch();
});
watcher.observe(document.body, { childList: true, subtree: true });
setTimeout(launchArch, 1000);