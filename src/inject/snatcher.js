// src/inject/snatcher.js - v16.3 Gold Master (Hunter)
console.log(">arch: Snatcher v16.3 Loaded");

window.ArchSnatcher = {
    inject: function(text) {
        console.log(">arch: Hunting for chat box...");
        
        // 1. Intentar encontrar el elemento activo o buscarlo
        let target = document.activeElement;
        
        // Si el foco está perdido (body o nuestro panel), buscar selectores conocidos
        if (!target || target === document.body || target.id === 'arch-overlay') {
            const selectors = [
                '#prompt-textarea',             // ChatGPT
                'div[contenteditable="true"]',  // Claude / General
                'textarea[placeholder*="Ask"]', // Perplexity
                'textarea', 
                'input[type="text"]'
            ];
            
            for (let s of selectors) {
                const el = document.querySelector(s);
                if (el) { 
                    target = el; 
                    target.focus(); 
                    console.log(">arch: Target found:", s);
                    break; 
                }
            }
        }

        if (!target) {
            alert("No chat box found. Prompt copied to clipboard!");
            navigator.clipboard.writeText(text);
            return;
        }

        // 2. Inyección robusta (Compatible con React)
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        
        if (target.tagName === 'TEXTAREA' && nativeSetter) {
            nativeSetter.call(target, target.value + text);
        } else if (document.execCommand) {
            document.execCommand('insertText', false, text);
        } else {
            target.value += text;
        }

        // 3. Disparar eventos para que el botón "Enviar" se active
        ['input', 'change', 'keydown', 'keyup'].forEach(e => {
            target.dispatchEvent(new Event(e, { bubbles: true }));
        });
    }
};