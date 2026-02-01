// src/core/engine.js - The Brain v12.0
console.log(">arch: Engine Loaded");

window.TemplateManager = {
    // 1. Cargar datos (Librería Estática + User Storage)
    getAll: async () => {
        return new Promise((resolve) => {
            const defaults = window.ARCH_LIBRARY || {};
            try {
                chrome.storage.sync.get(['userTemplates'], (result) => {
                    const custom = result.userTemplates || {};
                    // Los custom sobrescriben a los defaults si tienen el mismo nombre
                    resolve({ ...defaults, ...custom });
                });
            } catch (e) {
                console.warn("Storage API not available, using defaults only.");
                resolve(defaults);
            }
        });
    },

    // 2. Guardar un nuevo template
    save: async (name, content) => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['userTemplates'], (result) => {
                const custom = result.userTemplates || {};
                custom[name] = content;
                
                chrome.storage.sync.set({ userTemplates: custom }, () => {
                    console.log(`>arch: Saved template [${name}]`);
                    resolve(true);
                });
            });
        });
    },

    // 3. Borrar un template
    delete: async (name) => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['userTemplates'], (result) => {
                const custom = result.userTemplates || {};
                
                if (window.ARCH_LIBRARY && window.ARCH_LIBRARY[name]) {
                    // Si es de la librería base, no se puede borrar realmente, 
                    // pero podemos simularlo o bloquearlo.
                    alert("Cannot delete Core Templates (Protected).");
                    resolve(false);
                    return;
                }

                delete custom[name];
                chrome.storage.sync.set({ userTemplates: custom }, () => {
                    console.log(`>arch: Deleted template [${name}]`);
                    resolve(true);
                });
            });
        });
    },

    // 4. Lógica de Variables Vivas (Regex)
    parseVariables: (templateStr) => {
        if (!templateStr) return [];
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
            // Reemplaza {{VAR:Key}} y {{VAR:Key:Opt1|Opt2}}
            const regex = new RegExp(`{{VAR:${key}(:.*?)?}}`, 'g');
            output = output.replace(regex, val);
        }
        return output;
    },

    compile: (templateStr, inputUser) => {
        if (!inputUser) return templateStr;
        // Escapar comillas para evitar romper JSONs si fuera el caso
        const safeInput = inputUser.replace(/"/g, '\\"');
        return templateStr.replace(/{{INPUT}}/g, safeInput);
    }
};