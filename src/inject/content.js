// src/inject/content.js - VERSION "OBSESIVA" V12
console.log(">arch: System Initializing...");

// 1. Selector Universal "A prueba de fallos"
function getActiveTextarea() {
    // A. Si el usuario ya tiene el foco, usémoslo (Lo más preciso)
    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return active;
    }

    // B. Búsqueda por selectores conocidos (Prioridad Alta)
    const selectors = [
        '#prompt-textarea',                  // ChatGPT
        'div[contenteditable="true"]',       // Claude / Gemini / ChatGPT New
        'textarea[data-testid="chat-input"]',// DeepSeek / Bolt
        'textarea[aria-label*="Prompts"]',   // Generic AI
        'textarea'                           // Fallback
    ];

    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
    }
    
    return null;
}

// 2. Inyector de Texto Robusto
function safeInsert(element, text) {
    if (!element) return false;
    element.focus();

    // Estrategia 1: execCommand (Estándar)
    document.execCommand('selectAll', false, null);
    const success = document.execCommand('insertText', false, text);

    // Estrategia 2: React Setter (Si falla la 1)
    if (!success) {
        const proto = element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLElement.prototype;
        const setNative = Object.getOwnPropertyDescriptor(proto, 'value')?.set || Object.getOwnPropertyDescriptor(proto, 'textContent')?.set;
        
        if (setNative) {
            setNative.call(element, text);
            element.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            // Estrategia 3: Bruta
            element.value = text;
            element.textContent = text;
        }
    }
    return true;
}

// 3. Inicializador (ESTO ES LO QUE CAMBIÓ)
function launchArch() {
    // Verificamos que las dependencias cargaron
    if (!window.TemplateManager || !window.ArchUI) {
        console.warn(">arch: Waiting for dependencies...");
        setTimeout(launchArch, 500); // Reintentar si falta ui.js
        return;
    }

    // EVITAR DUPLICADOS: Si ya existe, no hacemos nada
    if (document.querySelector('.arch-trigger')) return;

    console.log(">arch: Dependencies OK. Launching UI...");

    // Cargamos templates y DIBUJAMOS EL BOTÓN SIN PREGUNTAR
    window.TemplateManager.getAll().then(templates => {
        const modes = Object.keys(templates);

        // Creamos la UI flotante inmediatamente
        window.ArchUI.create(modes, (selectedMode) => {
            // ESTO ocurre al hacer CLIC, no al cargar
            const target = getActiveTextarea();
            
            if (!target) {
                alert(">arch Error: No chat box found. Click explicitly on the text area and try again.");
                return;
            }

            const rawTemplate = templates[selectedMode];
            // Intentar sacar contexto existente
            let currentVal = target.value || target.textContent || "";
            
            const compiled = window.TemplateManager.compile(rawTemplate, currentVal);
            safeInsert(target, compiled);
        });

        console.log(">arch: UI Injected Successfully 🟢");
    });
}

// 4. EL VIGILANTE ETERNO (MutationObserver)
// Este código vigila si la URL cambia (navegación SPA) o si el botón se borra
const watcher = new MutationObserver(() => {
    if (!document.querySelector('.arch-trigger')) {
        launchArch();
    }
});

// Iniciamos vigilancia sobre todo el documento
watcher.observe(document.body, { childList: true, subtree: true });

// Primer intento de lanzamiento
setTimeout(launchArch, 1000);