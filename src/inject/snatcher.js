console.log(">arch: Snatcher v16.3 (Hunter Logic) Loaded");

window.ArchSnatcher = {
    inject: function(text) {
        // 1. CAZAR EL OBJETIVO
        let target = document.activeElement;
        
        // Si el foco se perdió (está en el body o en nuestro panel), buscar la caja de chat
        if (!target || target === document.body || (target.id && target.id.includes('arch'))) {
            const selectors = [
                '#prompt-textarea',       // ChatGPT
                'div[contenteditable="true"]', // Claude / General
                'textarea[placeholder*="Ask"]', // Perplexity
                'textarea', 
                'input[type="text"]'
            ];
            
            for (let s of selectors) {
                const el = document.querySelector(s);
                if (el) { target = el; target.focus(); break; }
            }
        }

        if (!target) {
            console.warn("No target found. Copying to clipboard.");
            navigator.clipboard.writeText(text);
            return;
        }

        // 2. INYECCIÓN HÍBRIDA (Compatible con React)
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        
        if (target.tagName === 'TEXTAREA' && nativeSetter) {
            // Método React
            nativeSetter.call(target, target.value + text);
        } else if (document.execCommand) {
            // Método Clásico
            document.execCommand('insertText', false, text);
        } else {
            // Método Bruto
            target.value += text;
        }

        // 3. DISPARAR EVENTOS (Para activar el botón de enviar)
        ['input', 'change', 'keydown', 'keyup'].forEach(e => {
            target.dispatchEvent(new Event(e, { bubbles: true }));
        });
    }
};