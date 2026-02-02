// src/pages/popup.js - v15.5 Logic
console.log(">arch: Popup Opened");

// 1. Botón para abrir la consola en el chat
document.getElementById('open-console').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        
        // Manda la señal al content.js
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_console" });
        
        // Cierra la ventanita
        window.close();
    });
});

// 2. Botón para ir a configuración/guía
document.getElementById('open-settings').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('src/pages/options.html'));
    }
});