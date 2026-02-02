// src/background.js - v16.4 (Smart Installer)
console.log(">arch: Background Service Worker v16.4 Active");

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Primera instalación: Abrir manual para que el usuario sepa qué hacer
        chrome.tabs.create({ url: 'src/pages/options.html' });
        console.log(">arch: Installation successful. Welcome!");
    } else if (details.reason === 'update') {
        console.log(`>arch: Updated to version ${chrome.runtime.getManifest().version}`);
    }
});