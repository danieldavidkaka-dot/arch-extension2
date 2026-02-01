// src/core/engine.js
// SOLO LÓGICA. Gestiona la librería y el almacenamiento.
console.log(">arch: Engine Loaded");

window.TemplateManager = {
    // Referencia a la librería estática (data)
    defaults: window.ARCH_LIBRARY || {},

    getAll: async () => {
        return new Promise((resolve) => {
            try {
                chrome.storage.sync.get(['userTemplates'], (result) => {
                    const custom = result.userTemplates || {};
                    // Fusionamos la librería estática con lo guardado por el usuario
                    resolve({ ...window.TemplateManager.defaults, ...custom });
                });
            } catch (e) { resolve(window.TemplateManager.defaults); }
        });
    },

    // ... (Mantén aquí las funciones save, delete, reset) ...

    // --- LOGIC: VARIABLES VIVAS ---
    parseVariables: (templateStr) => {
        const regex = /{{VAR:(.*?)}}/g;
        const matches = [...templateStr.matchAll(regex)];
        return matches.map(m => {
            const parts = m[1].split(':'); 
            return {
                raw: m[0],                 
                key: parts[0],             
                options: parts[1] ? parts[1].split('|') : null 
            };
        });
    },

    compileVariables: (templateStr, valuesMap) => {
        let output = templateStr;
        for (const [key, val] of Object.entries(valuesMap)) {
            const regex = new RegExp(`{{VAR:${key}(:.*?)?}}`, 'g');
            output = output.replace(regex, val);
        }
        return output;
    },

    compile: (templateStr, inputUser) => {
        if (!inputUser) return templateStr;
        const safeInput = inputUser.replace(/"/g, '\\"');
        return templateStr.replace(/{{INPUT}}/g, safeInput);
    }
};