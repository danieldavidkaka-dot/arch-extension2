// content.js - El cerebro que conecta todo (VERSIÓN CORREGIDA V11)
console.log(">arch: Main Content Script Loaded");

let currentTextarea = null;

// --- 1. DETECCIÓN INTELIGENTE DEL TEXTAREA ---
function findTextarea() {
    const selectors = [
        'textarea[id="prompt-textarea"]',       // ChatGPT
        'div[contenteditable="true"]',          // Claude / Gemini
        'textarea[placeholder*="Message"]',     // Generic
        'textarea'                              // Fallback
    ];

    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
    }
    return null;
}

// --- 2. INYECCIÓN DE TEXTO (CORREGIDA: Borra antes de pegar) ---
function insertText(element, text) {
    if (!element) return;
    element.focus();

    // A. SELECCIONAR TODO EL TEXTO EXISTENTE (Para sobrescribir)
    // Esto soluciona el error de que se quede el texto viejo pegado al final
    try {
        if (element.tagName === 'TEXTAREA') {
            element.select(); // Funciona en textareas estándar (ChatGPT antiguo)
        } else if (element.isContentEditable) {
            // Funciona en divs editables (Claude, Gemini, ChatGPT nuevo)
            document.execCommand('selectAll', false, null);
        }
    } catch (e) {
        console.warn(">arch: Selection failed, appending instead.", e);
    }
    
    // B. INSERTAR EL NUEVO TEXTO (Reemplazando la selección)
    // Intento 1: Comando nativo (funciona en la mayoría)
    const success = document.execCommand('insertText', false, text);
    
    // Intento 2: Manipulación directa para React (ChatGPT/Claude modernos si falla el anterior)
    if (!success) {
        if (element.tagName === 'DIV') {
            element.textContent = text;
        } else {
            element.value = text;
        }
        // Disparar eventos para que React se entere del cambio
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// --- 3. INICIALIZACIÓN ---
function initArch() {
    // A. Inicializar UI Flotante
    if (window.ArchUI && window.TemplateManager) {
        window.TemplateManager.getAll().then(templates => {
            const modes = Object.keys(templates);
            
            // Recrear UI solo si no existe ya
            if (!document.querySelector('.arch-trigger')) {
                window.ArchUI.create(modes, (selectedMode) => {
                    const ta = findTextarea();
                    if (!ta) {
                        alert(">arch: No input field detected. Click the chat box first.");
                        return;
                    }
                    
                    const rawTemplate = templates[selectedMode];
                    let userInput = "";
                    
                    // Extraer texto existente para inyectarlo en el template
                    if (ta.tagName === 'TEXTAREA') userInput = ta.value;
                    if (ta.tagName === 'DIV') userInput = ta.textContent; // Cuidado: textContent puede traer basura si no se limpia, pero insertText lo arregla
                    
                    const finalPrompt = window.TemplateManager.compile(rawTemplate, userInput);
                    insertText(ta, finalPrompt);
                });
            }
        });
    }

    // B. INICIALIZAR SNATCHER (Botón de Descarga)
    if (window.ArchSnatcher) {
        // console.log("Inicializando Snatcher...");
        window.ArchSnatcher.init();
    }
}

// --- 4. BUCLE DE VIGILANCIA (Anti-desaparición) ---
const observer = new MutationObserver(() => {
    // Si la página se redibuja y borra nuestro botón, lo recreamos
    if (!document.querySelector('.arch-trigger')) {
         initArch();
    }
});

// Observar cambios en el body para reactivar si es necesario
observer.observe(document.body, { childList: true, subtree: true });

// Arranque inicial
setTimeout(initArch, 1000);