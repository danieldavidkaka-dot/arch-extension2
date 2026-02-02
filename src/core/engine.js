// src/core/engine.js - v16.4 (Documented & Type-Safe)
console.log(">arch: Engine v16.4 Loaded");

window.TemplateManager = {
    /**
     * Recupera todos los templates (Librería Base + Usuario).
     * @returns {Promise<Object>} Objeto con todos los prompts (Clave: Contenido).
     */
    getAll: async function() {
        const defaults = window.ARCH_LIBRARY || {};
        // Verificar si la API de Chrome está disponible (contexto de extensión)
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            // Uso de API moderna basada en Promesas (Manifest V3)
            const result = await chrome.storage.local.get('arch_user_templates');
            const custom = result.arch_user_templates || {};
            return { ...defaults, ...custom };
        } else {
            // Fallback para entornos de desarrollo sin API de Chrome
            return defaults;
        }
    },

    /**
     * Guarda un template personalizado del usuario.
     * @param {string} key - El nombre del comando (ej: "MI_PROMPT").
     * @param {string} content - El contenido del prompt.
     * @returns {Promise<void>}
     */
    save: async function(key, content) {
        if (!chrome.storage) return;
        const result = await chrome.storage.local.get('arch_user_templates');
        const custom = result.arch_user_templates || {};
        custom[key] = content;
        await chrome.storage.local.set({ arch_user_templates: custom });
        console.log(`>arch: Saved [${key}]`);
    },

    /**
     * Elimina un template personalizado.
     * @param {string} key - El nombre del comando a borrar.
     * @returns {Promise<void>}
     */
    delete: async function(key) {
        if (!chrome.storage) return;
        const result = await chrome.storage.local.get('arch_user_templates');
        let custom = result.arch_user_templates || {};
        delete custom[key];
        await chrome.storage.local.set({ arch_user_templates: custom });
        console.log(`>arch: Deleted [${key}]`);
    },

    /**
     * Analiza un texto buscando variables {{VAR:...}}.
     * @param {string} str - El texto crudo.
     * @returns {Array<Object>} Lista de variables encontradas.
     */
    parseVariables: function(str) {
        if (!str || typeof str !== 'string') return [];
        try {
            const regex = /{{VAR:(.*?)}}/g;
            const matches = [...str.matchAll(regex)];
            return matches.map(m => {
                const inner = m[1]; // Contenido: "Nombre:Op1,Op2"
                const parts = inner.split(':');
                return {
                    raw: m[0],
                    key: parts[0] ? parts[0].trim() : "Variable",
                    options: parts[1] ? parts[1].split(',').map(o => o.trim()) : null
                };
            });
        } catch (e) {
            console.error(">arch error: Variable parsing failed", e);
            return [];
        }
    },

    /**
     * Reemplaza variables en el texto con valores reales.
     * Útil para procesamiento backend o validación previa.
     */
    compileVariables: function(str, valuesMap) {
        if (!str) return "";
        let output = str;
        try {
            // Función auxiliar para escapar caracteres especiales de Regex
            const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            for (const [key, val] of Object.entries(valuesMap)) {
                // Crea una regex dinámica para reemplazar {{VAR:key...}}
                // FIX DE SEGURIDAD: Escapar la key para evitar errores de sintaxis o inyección
                const regex = new RegExp(`{{VAR:${escapeRegExp(key)}(:.*?)?}}`, 'g');
                output = output.replace(regex, val || "");
            }
            return output;
        } catch (e) {
            console.error(">arch error: Compilation failed", e);
            return str;
        }
    }
};