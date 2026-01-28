// src/snatcher.js
console.log(">arch: Snatcher Module Loaded v1.0 (Artifact Downloader)");

const ArchSnatcher = {
    observer: null,
    processedAttribute: 'data-arch-snatched', // Marca para no repetir botones

    // Mapa inteligente: Detecta el lenguaje y asigna la extensión correcta
    langMap: {
        'python': 'py', 'py': 'py',
        'javascript': 'js', 'js': 'js',
        'typescript': 'ts', 'ts': 'ts',
        'tsx': 'tsx', 'jsx': 'jsx',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'json': 'json',
        'bash': 'sh', 'sh': 'sh', 'shell': 'sh',
        'sql': 'sql',
        'markdown': 'md', 'md': 'md',
        'xml': 'xml',
        'yaml': 'yaml', 'yml': 'yaml',
        'c++': 'cpp', 'cpp': 'cpp',
        'c#': 'cs', 'csharp': 'cs',
        'java': 'java',
        'rust': 'rs',
        'go': 'go',
        'php': 'php',
        'ruby': 'rb',
        'swift': 'swift',
        'kotlin': 'kt'
    },

    init: () => {
        // 1. Escaneo inicial inmediato
        ArchSnatcher.scan();

        // 2. Configurar el Observador para detectar nuevos mensajes mientras la IA escribe
        ArchSnatcher.observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) shouldScan = true;
            });
            if (shouldScan) ArchSnatcher.scan();
        });

        // Vigilar cambios en el cuerpo de la página
        ArchSnatcher.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    scan: () => {
        // Busca bloques <pre> (donde ChatGPT/Claude/Gemini ponen el código)
        const codeBlocks = document.querySelectorAll('pre');

        codeBlocks.forEach(pre => {
            // Si ya tiene nuestro botón, ignorar
            if (pre.getAttribute(ArchSnatcher.processedAttribute) === 'true') return;

            // Marcar como procesado
            pre.setAttribute(ArchSnatcher.processedAttribute, 'true');
            
            // Inyectar el botón
            ArchSnatcher.injectButton(pre);
        });
    },

    injectButton: (preBlock) => {
        // Intentar detectar el lenguaje
        // ChatGPT usa clases tipo "language-python"
        const codeElement = preBlock.querySelector('code');
        let lang = 'txt'; // Fallback por defecto
        
        if (codeElement) {
            const classes = codeElement.className || '';
            const match = classes.match(/language-([a-z0-9]+)/);
            if (match && match[1]) {
                // Normalizar extensión usando nuestro mapa
                lang = ArchSnatcher.langMap[match[1]] || match[1];
            }
        }

        // Crear el botón DOM
        const btn = document.createElement('button');
        btn.className = 'arch-snatch-btn'; // Clase definida en styles.css
        btn.innerHTML = `<span>⤓</span> .${lang.toUpperCase()}`;
        btn.title = `Download artifact as .${lang}`;

        // Lógica del Clic
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // No activar eventos del chat
            e.preventDefault();
            
            // Extraer texto limpio
            const rawCode = codeElement ? codeElement.innerText : preBlock.innerText;
            
            // Descargar
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            ArchSnatcher.download(rawCode, `arch_artifact_${timestamp}.${lang}`);
            
            // Animación de Éxito
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span>✓</span> OK`;
            btn.classList.add('success'); // Clase para efecto verde
            
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.classList.remove('success');
            }, 2000);
        });

        // Asegurar que el padre tenga posición relativa para poder ubicar el botón absoluto
        if (getComputedStyle(preBlock).position === 'static') {
            preBlock.style.position = 'relative';
        }

        preBlock.appendChild(btn);
    },

    download: (content, filename) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click(); // Forzar descarga
        window.URL.revokeObjectURL(url); // Limpiar memoria
        document.body.removeChild(a);
    }
};

// Exponer al scope global para que content.js lo inicie
window.ArchSnatcher = ArchSnatcher;