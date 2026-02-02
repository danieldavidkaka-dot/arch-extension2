// src/inject/content.js - v16.3
console.log(">arch: Content v16.3 Loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "toggle_console") {
        openConsole();
        sendResponse({status: "ok"});
    }
    return true;
});

document.addEventListener('keydown', (e) => {
    if (e.key === '>' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
        openConsole();
    }
});

function openConsole() {
    if (!window.ArchUI) return console.error("UI missing");
    
    // Cargar librería directamente o desde TemplateManager si existe
    const templates = window.ARCH_LIBRARY || (window.TemplateManager ? window.TemplateManager.getAll() : {});
    
    // Si es promesa (TemplateManager), esperar
    Promise.resolve(templates).then(tpls => {
        window.ArchUI.create(tpls, (text) => {
            setTimeout(() => {
                if (window.ArchSnatcher) window.ArchSnatcher.inject(text);
                else navigator.clipboard.writeText(text);
            }, 100);
        });
    });
}

// Botón Flotante
if (!document.getElementById('arch-float')) {
    const btn = document.createElement('div');
    btn.id = 'arch-float';
    btn.textContent = '>_';
    Object.assign(btn.style, {
        position:'fixed', bottom:'30px', right:'30px', width:'50px', height:'50px',
        background:'#09090b', color:'#10b981', borderRadius:'50%', display:'flex',
        alignItems:'center', justifyContent:'center', border:'1px solid #333',
        cursor:'pointer', zIndex:'2147483647', boxShadow:'0 4px 10px rgba(0,0,0,0.5)'
    });
    btn.onclick = (e) => { e.stopPropagation(); openConsole(); };
    document.body.appendChild(btn);
}