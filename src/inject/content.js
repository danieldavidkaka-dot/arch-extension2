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
            // Capturar texto corto para contexto
            const text = el.innerText ? `"${el.innerText.substring(0, 20).replace(/\n/g, ' ')}..."` : '';
            this.record(`[CLICK] ${el.tagName}${id}${cls} ${text}`);
        };

        this.listeners.input = (e) => {
            // No grabamos contraseñas por seguridad
            if (e.target.type === 'password') return;
            this.record(`[TYPE] ${e.target.tagName} => "${e.target.value}"`);
        };

        this.listeners.scroll = () => {
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

// Función central para copiar al portapapeles
function handleSelection(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log(">arch: Prompt copied!");
        
        // Feedback visual (Toast)
        const toast = document.createElement('div');
        toast.textContent = "COPIED TO CLIPBOARD!";
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            background: '#00ff9d', color: '#000', padding: '10px 20px',
            borderRadius: '4px', fontWeight: 'bold', zIndex: '2147483647',
            fontFamily: 'Courier New', boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });
}

// Listener de Teclado (Shift + >)
document.addEventListener('keydown', async (e) => {
    if (e.key === '>') {
        const now = Date.now();
        if (now - lastKeyTime < 500) return; // Debounce
        lastKeyTime = now;

        // Si el UI ya existe, solo lo mostramos, si no, lo recreamos (seguridad)
        if (window.ArchUI && window.ArchUI.overlay) {
             window.ArchUI.overlay.style.display = 'flex';
        } else {
             // Fallback por si acaso
             const templates = await window.TemplateManager.getAll();
             window.ArchUI.create(templates, handleSelection);
             window.ArchUI.overlay.style.display = 'flex';
        }
    }
});

// =============================================================================
// 3. AUTO-INICIO (¡IMPORTANTE!)
// =============================================================================
(async function init() {
    try {
        // Esperamos un momento para asegurar que el DOM esté listo
        setTimeout(async () => {
            // 1. Iniciar UI Flotante
            if (window.TemplateManager && window.ArchUI) {
                const templates = await window.TemplateManager.getAll();
                window.ArchUI.create(templates, handleSelection);
                console.log(">arch: Floating UI Initialized");
            }

            // 2. Iniciar Snatcher (El botón de descarga) <-- ¡ESTO FALTABA!
            if (window.ArchSnatcher) {
                window.ArchSnatcher.init();
                console.log(">arch: Snatcher Module Active");
            }
            
        }, 500);
    } catch (e) {
        console.error(">arch: Initialization failed", e);
    }
})();