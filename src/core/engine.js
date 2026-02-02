// src/core/engine.js - v14.1 (Bulletproof Logic) - FULL FILE
console.log(">arch: Engine v14.1 Loaded");

window.TemplateManager = {
    // --- 1. GESTIÓN DE DATOS ---
    getAll: async function() {
        return new Promise((resolve) => {
            const defaults = window.ARCH_LIBRARY || {};
            // Intentamos leer del almacenamiento local
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get('arch_user_templates', (result) => {
                    const custom = result.arch_user_templates || {};
                    // Fusionamos (Custom sobrescribe Default)
                    resolve({ ...defaults, ...custom });
                });
            } else {
                // Fallback seguro si la API de Chrome no está lista
                resolve(defaults);
            }
        });
    },

    save: async function(key, content) {
        if (!chrome.storage) return;
        const result = await chrome.storage.local.get('arch_user_templates');
        const custom = result.arch_user_templates || {};
        custom[key] = content;
        await chrome.storage.local.set({ arch_user_templates: custom });
        console.log(`>arch: Saved [${key}]`);
    },

    delete: async function(key) {
        if (!chrome.storage) return;
        const result = await chrome.storage.local.get('arch_user_templates');
        const custom = result.arch_user_templates || {};
        delete custom[key];
        await chrome.storage.local.set({ arch_user_templates: custom });
        console.log(`>arch: Deleted [${key}]`);
    },

    // --- 2. HERRAMIENTAS DE VARIABLES (BLINDADAS) ---
    // Esta función incluye protección try-catch para que nunca rompa la interfaz
    parseVariables: function(str) {
        if (!str || typeof str !== 'string') return []; 
        try {
            const regex = /{{VAR:(.*?)}}/g;
            const matches = [...str.matchAll(regex)];
            return matches.map(m => {
                const inner = m[1];
                const parts = inner.split(':');
                return {
                    raw: m[0],
                    key: parts[0] || "Variable",
                    options: parts[1] ? parts[1].split(',') : null
                };
            });
        } catch (e) {
            console.error(">arch error: Failed to parse variables", e);
            return []; // Retorna vacío en vez de error para seguir funcionando
        }
    },

    compileVariables: function(str, values) {
        if (!str) return "";
        let output = str;
        try {
            for (const [key, val] of Object.entries(values)) {
                // Regex escapado para asegurar coincidencia exacta
                const regex = new RegExp(`{{VAR:${key}(:.*?)?}}`, 'g');
                output = output.replace(regex, val || "");
            }
        } catch (e) {
            console.error(">arch error: Failed to compile variables", e);
        }
        return output;
    }
};