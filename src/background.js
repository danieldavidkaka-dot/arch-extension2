// src/background.js - v15.2 Service Worker
console.log(">arch: Background Service v15.2 Active");

// 1. Escuchar instalación o actualización
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log(">arch: Installed successfully.");
        // Opcional: Abrir página de bienvenida u opciones
    } else if (details.reason === 'update') {
        console.log(">arch: Updated to latest version.");
    }
});

// 2. Escuchar Comandos de Teclado (Ctrl+Shift+Y)
chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-arch-console") {
        // Buscar la pestaña activa
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            
            const tabId = tabs[0].id;
            
            // Enviar mensaje al content.js
            // Usamos catch para evitar errores si la web no permite inyección (ej: chrome://)
            chrome.tabs.sendMessage(tabId, { action: "toggle_console" })
                .catch(() => console.log(">arch: Cannot inject in this tab (System Page?)"));
        });
    }
});