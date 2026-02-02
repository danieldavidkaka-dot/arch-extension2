// src/inject/snatcher.js - v15.0 (React State Bypass)
console.log(">arch: Snatcher v15.0 Loaded");

window.ArchSnatcher = {
    inject: function(text) {
        // 1. Encontrar el objetivo (Lógica Agresiva)
        let target = document.activeElement;

        // Si el foco está perdido o es nuestro overlay, buscar activamente
        if (!target || target === document.body || target.id === 'arch-overlay') {
            const selectors = [
                '#prompt-textarea',       // ChatGPT
                'div[contenteditable="true"]', // General Rich Text
                'textarea[placeholder*="Ask"]', // DeepSeek / Perplexity
                'textarea[data-id]',      // Claude
                'textarea',
                'input[type="text"]'
            ];
            
            for (let s of selectors) {
                const el = document.querySelector(s);
                if (el) { target = el; break; }
            }
        }

        if (!target) {
            console.warn(">arch: No chat detected. Copied to clipboard.");
            navigator.clipboard.writeText(text);
            return;
        }

        // 2. Preparar el terreno
        target.focus();
        
        // 3. INYECCIÓN NUCLEAR (React State Bypass)
        // Esto soluciona que el botón de enviar se quede gris
        try {
            // Método A: ContentEditable (divs)
            if (target.isContentEditable) {
                document.execCommand('insertText', false, text);
            } 
            // Método B: Textareas (React/Vue/Angular)
            else {
                // Truco para forzar que React detecte el cambio
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype, 
                    "value"
                ).set;
                
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(target, target.value + text);
                } else {
                    target.value += text;
                }
            }
        } catch (e) {
            // Fallback si falla el hack
            console.log(">arch: Standard injection fallback");
            target.value += text;
        }

        // 4. DISPARAR EVENTOS (Despertar a la IA)
        const events = ['input', 'change', 'keydown', 'keyup'];
        events.forEach(evtType => {
            const event = new Event(evtType, { bubbles: true, cancelable: true });
            target.dispatchEvent(event);
        });

        // Mover el cursor al final (UX)
        if (target.setSelectionRange) {
            const len = target.value.length;
            target.setSelectionRange(len, len);
        }

        console.log(">arch: Injected & Events Fired");
    }
};