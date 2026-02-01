// src/inject/content.js - v12.0 Logic Glue & Shadow Recorder
console.log(">arch: Content Script Loaded v12.0");

// =============================================================================
// 1. SHADOW RECORDER (El Grabador Invisible)
// =============================================================================
window.ShadowRecorder = {
    isRecording: false,
    logs: [],
    listeners: {},

    start: function() {
        if (this.isRecording) return;
        this.isRecording = true;
        this.logs = [];
        console.log(">arch: 🔴 Shadow Recorder STARTED");

        // Definir listeners
        this.listeners.click = (e) => {
            const el = e.target;
            const id = el.id ? `#${el.id}` : '';
            const cls = el.className ? `.${el.className.split(' ').join('.')}` : '';
            const text = el.innerText ? `"${el.innerText.substring(0, 20)}..."` : '';
            this.record(`[CLICK] ${el.tagName}${id}${cls} ${text}`);
        };

        this.listeners.input = (e) => {
            this.record(`[TYPE] ${e.target.tagName} => "${e.target.value}"`);
        };

        this.listeners.scroll = () => {
            // Debounce simple para no saturar el log
            if (!this.scrolling) {
                this.record(`[SCROLL] User scrolled the page`);
                this.scrolling = true;
                setTimeout(() => this.scrolling = false, 1000);
            }
        };

        // Activar listeners
        document.addEventListener('click', this.listeners.click, true);
        document.addEventListener('input', this.listeners.input, true);
        document.addEventListener('scroll', this.listeners.scroll, true);
    },

    stop: function() {
        if (!this.isRecording) return "";
        this.isRecording = false;
        console.log(">arch: ⏹️ Shadow Recorder STOPPED");

        // Remover listeners
        document.removeEventListener('click', this.listeners.click, true);
        document.removeEventListener('input', this.listeners.input, true);
        document.removeEventListener('scroll', this.listeners.scroll, true);

        return this.logs.join('\n');
    },

    record: function(action) {
        const time = new Date().toLocaleTimeString();
        this.logs.push(`[${time}] ${action}`);
    }
};

// =============================================================================
// 2. TECLADO & INYECCIÓN
// =============================================================================
let lastKeyTime = 0;

document.addEventListener('keydown', async (e) => {
    // ACTIVADOR: Shift + > (Mayor que)
    // Nota: En teclados latinos '>' suele ser Shift + <.
    // Verificamos si la tecla es '>' o si presionan Shift + alguna tecla que da '>'
    
    // Check simple para ">"
    if (e.key === '>') {
        // Prevenir doble disparo rápido
        const now = Date.now();
        if (now - lastKeyTime < 500) return;
        lastKeyTime = now;

        e.preventDefault(); // Evitar que escriba ">" en la web

        // 1. Obtener Templates del Nuevo Cerebro
        const templates = await window.TemplateManager.getAll();

        // 2. Iniciar UI
        window.ArchUI.create(templates, (selectedPrompt) => {
            // Callback cuando el usuario elige un prompt
            copyToClipboard(selectedPrompt);
        });
    }
});

// Función auxiliar de copiado
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log(">arch: Prompt copied to clipboard!");
        
        // Feedback visual sutil (Toast)
        const toast = document.createElement('div');
        toast.textContent = "COPIED TO CLIPBOARD!";
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            background: '#00ff9d', color: '#000', padding: '10px 20px',
            borderRadius: '4px', fontWeight: 'bold', zIndex: '999999',
            fontFamily: 'Courier New'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });
}