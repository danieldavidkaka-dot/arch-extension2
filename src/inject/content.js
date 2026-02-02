// src/inject/content.js - v15.2 Platinum (Smart Trigger & Floating Button)
console.log(">arch: Controller v15.2 Loaded");

// 1. ESCUCHAR ATAJOS DE TECLADO
// Mensajes del Background (Ctrl+Shift+Y)
chrome.runtime.onMessage.addListener((req) => {
    if (req.action === "toggle_console") toggleConsole();
});

// Tecla flotante ">" (Legacy) - CORREGIDO PARA CHATGPT/CLAUDE
document.addEventListener('keydown', (e) => {
    // Si la tecla es '>'...
    if (e.key === '>') {
        const tag = e.target.tagName;
        const isEditable = e.target.isContentEditable;
        
        // ...y NO estamos escribiendo en un campo de texto (Input, Textarea o Div Editable)
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !isEditable) {
            toggleConsole();
        }
    }
});

// 2. FUNCIÓN PRINCIPAL: ABRIR/CERRAR CONSOLA
function toggleConsole() {
    if (!window.ArchUI) {
        console.error(">arch: UI module missing");
        return;
    }
    
    // Si ya está abierto, cerrarlo
    if (window.ArchUI.overlay && document.contains(window.ArchUI.overlay)) {
        window.ArchUI.close();
    } else {
        // Cargar templates y abrir UI
        window.TemplateManager.getAll()
            .then(allTemplates => {
                window.ArchUI.create(allTemplates, (finalText) => {
                    // Inyección segura
                    if (window.ArchSnatcher) {
                        window.ArchSnatcher.inject(finalText);
                    } else {
                        console.warn(">arch: Snatcher missing, using clipboard");
                        navigator.clipboard.writeText(finalText);
                    }
                });
            })
            .catch(err => console.error(">arch: Failed to load templates", err));
    }
}

// 3. BOTÓN FLOTANTE (Mantenemos el diseño v14.2 que funcionaba bien)
function createFloatingButton() {
    if (document.getElementById('arch-floating-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'arch-floating-btn';
    btn.textContent = '>_';
    
    Object.assign(btn.style, {
        position: 'fixed', bottom: '30px', right: '30px',
        width: '45px', height: '45px',
        background: '#09090b', color: '#10b981', // Colores ajustados al tema v15
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: '2147483647', // Max Z-Index
        fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        border: '1px solid #27272a',
        transition: 'all 0.2s ease',
        userSelect: 'none'
    });

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

    btn.onclick = (e) => {
        e.stopPropagation();
        toggleConsole();
    };

    document.body.appendChild(btn);
    console.log(">arch: Floating button active");
}

// 4. AUTO-INIT
(async function init() {
    // Check recursivo suave para asegurar carga
    const checkModules = () => {
        if (window.TemplateManager && window.ArchUI) {
            createFloatingButton();
        } else {
            setTimeout(checkModules, 500);
        }
    };
    checkModules();
})();