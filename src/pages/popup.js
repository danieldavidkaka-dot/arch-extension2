// src/pages/popup.js - v16.4 (Anti-Zombie Logic + Spanish Texts)
console.log(">arch: Popup Opened");

// 1. Botón "ABRIR CONSOLA"
document.getElementById('open-console').addEventListener('click', () => {
    // Buscar la pestaña activa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        const activeTab = tabs[0];

        // Intentar conectar con la pestaña
        chrome.tabs.sendMessage(activeTab.id, { action: "toggle_console" }, (response) => {
            
            // VERIFICAR ERRORES DE CONEXIÓN
            if (chrome.runtime.lastError) {
                console.warn(">arch: Connection failed:", chrome.runtime.lastError.message);
                
                // CAMBIO DE TEXTO: Aviso claro en español
                const btn = document.getElementById('open-console');
                btn.textContent = "⚠️ RECARGA LA PÁGINA (F5)";
                btn.style.background = "#f59e0b"; // Naranja de advertencia
                btn.style.color = "#000";
                btn.style.borderColor = "#fbbf24";
                
            } else {
                // Si no hubo error, cerrar la ventana del popup
                window.close();
            }
        });
    });
});

// 2. Botón "CONFIGURACIÓN"
document.getElementById('open-settings').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('src/pages/options.html'));
    }
});