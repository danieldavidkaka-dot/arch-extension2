// popup.js
console.log(">arch: Popup Script Loaded");

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BOTÓN "ABRIR STUDIO" ---
    // Abre la página de configuración completa (options.html)
    const optionsBtn = document.getElementById('openOptions');
    
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            if (chrome.runtime.openOptionsPage) {
                // Método moderno
                chrome.runtime.openOptionsPage();
            } else {
                // Método fallback
                window.open(chrome.runtime.getURL('options.html'));
            }
        });
    }

    // --- 2. INTERACCIÓN CON LOS MODOS (GRID) ---
    // Al hacer clic en un cuadro, copia la info al portapapeles y da feedback visual
    const modes = document.querySelectorAll('.mode-item');
    
    modes.forEach(mode => {
        mode.addEventListener('click', async () => {
            const nameSpan = mode.querySelector('.mode-name');
            const descSpan = mode.querySelector('.mode-desc');
            
            const modeName = nameSpan.innerText;
            const description = descSpan.innerText;
            
            // Efecto visual de "Copiado" (Cambio de color)
            const originalBorder = mode.style.borderColor;
            const originalBg = mode.style.backgroundColor;
            
            mode.style.borderColor = '#00ff9d';
            mode.style.backgroundColor = '#112211';
            
            // Copiar al portapapeles
            try {
                const textToCopy = `>arch MODE: ${modeName} - ${description}`;
                await navigator.clipboard.writeText(textToCopy);
                
                // Feedback de Texto
                const originalText = nameSpan.innerText;
                nameSpan.innerText = "COPIED!";
                nameSpan.style.color = "#00ff9d";
                
                // Restaurar estado original después de 1 segundo
                setTimeout(() => {
                    mode.style.borderColor = originalBorder;
                    mode.style.backgroundColor = originalBg;
                    nameSpan.innerText = originalText;
                    nameSpan.style.color = ""; // Volver al color CSS original
                }, 1000);
                
            } catch (err) {
                console.error('>arch: Error copying to clipboard', err);
            }
        });
    });
});