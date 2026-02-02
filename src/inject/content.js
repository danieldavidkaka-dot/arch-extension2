// src/inject/content.js - v16.4 (Floating Button + Robust Connection)
console.log(">arch: Content v16.4 Loaded");

// =============================================================================
// 1. COMUNICACIÓN (Para que funcione el botón del menú "Inject Console")
// =============================================================================
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "toggle_console") {
        console.log(">arch: Signal received from popup");
        toggleConsole();
        sendResponse({ status: "ok" }); // Confirmar recepción
    }
    return true; // Mantener canal abierto
});

// =============================================================================
// 2. ATAJO DE TECLADO (Tecla '>')
// =============================================================================
document.addEventListener('keydown', (e) => {
    // Solo si pulsan '>' y NO están escribiendo en un input
    if (e.key === '>' && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && 
        !document.activeElement.isContentEditable) {
        toggleConsole();
    }
});

// =============================================================================
// 3. LÓGICA PRINCIPAL (Abrir/Cerrar la Consola Negra)
// =============================================================================
function toggleConsole() {
    // Verificación de seguridad
    if (!window.ArchUI) {
        console.error(">arch: UI module missing. Reload page.");
        return;
    }
    
    // Si ya está abierto, cerrarlo
    if (window.ArchUI.overlay && document.contains(window.ArchUI.overlay)) {
        window.ArchUI.close();
    } else {
        // Cargar templates (Soporte híbrido para v14/v16)
        const loadTemplates = window.TemplateManager ? window.TemplateManager.getAll() : Promise.resolve(window.ARCH_LIBRARY || {});
        
        loadTemplates.then(templates => {
            window.ArchUI.create(templates, (finalText) => {
                // Inyección segura del texto en el chat
                setTimeout(() => {
                    if (window.ArchSnatcher) {
                        window.ArchSnatcher.inject(finalText);
                    } else {
                        console.warn(">arch: Snatcher missing, using clipboard");
                        navigator.clipboard.writeText(finalText);
                    }
                }, 100);
            });
        }).catch(err => console.error(">arch: Error loading templates", err));
    }
}

// =============================================================================
// 4. EL BOTÓN FLOTANTE (Recuperado y Blindado)
// =============================================================================
function createFloatingButton() {
    // Si ya existe, no crearlo de nuevo
    if (document.getElementById('arch-floating-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'arch-floating-btn';
    btn.textContent = '>_';
    
    // Estilos v15 (Modernos y bonitos)
    Object.assign(btn.style, {
        position: 'fixed', bottom: '30px', right: '30px',
        width: '50px', height: '50px',
        background: '#09090b', color: '#10b981',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: '2147483647', // Siempre arriba
        fontFamily: 'monospace', fontWeight: 'bold', fontSize: '18px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        border: '1px solid #27272a',
        transition: 'all 0.2s ease',
        userSelect: 'none'
    });

    // Efectos Hover
    btn.onmouseover = () => { 
        btn.style.transform = 'scale(1.1)'; 
        btn.style.borderColor = '#10b981';
        btn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
    };
    btn.onmouseout = () => { 
        btn.style.transform = 'scale(1)'; 
        btn.style.borderColor = '#27272a';
        btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)';
    };

    // Acción Click
    btn.onclick = (e) => {
        e.stopPropagation(); // Evitar que el click pase a la web
        toggleConsole();
    };

    document.body.appendChild(btn);
    console.log(">arch: Floating button active");
}

// =============================================================================
// 5. INICIALIZADOR AUTOMÁTICO (Auto-Repair)
// =============================================================================
(function init() {
    // Intentar crear el botón inmediatamente
    createFloatingButton();

    // Observador eficiente en lugar de polling (setInterval)
    // Solo se activa si hay cambios en el DOM, ahorrando recursos.
    // OPTIMIZACIÓN: Debounce agregado para evitar saturación en SPAs dinámicas.
    let timeout;
    const observer = new MutationObserver(() => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!document.getElementById('arch-floating-btn')) {
                createFloatingButton();
            }
        }, 500); // Verificar solo una vez cada 500ms tras cambios
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();