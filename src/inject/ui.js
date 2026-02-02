// src/inject/ui.js - v15.0 (Visual Forms & Focus Recovery)
console.log(">arch: UI v15.0 Loaded (Visual Forms)");

window.ArchUI = {
    overlay: null,
    panel: null,

    create: function(templates, onSelectCallback) {
        if (document.getElementById('arch-overlay')) return;

        const userSelection = window.getSelection().toString();

        // 1. Overlay (Fondo)
        const overlay = document.createElement('div');
        overlay.id = 'arch-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: '2147483647',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(5px)'
        });

        // 2. Panel Principal
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            background: '#09090b', width: '550px', maxHeight: '85vh',
            border: '1px solid #27272a', borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
        });
        this.panel = panel;

        // Header
        const header = document.createElement('div');
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#10b981; font-weight:700; letter-spacing:-0.5px;">>arch_console</span>
                <span style="font-size:10px; color:#52525b; border:1px solid #27272a; padding:2px 6px; borderRadius:4px;">v15.0</span>
            </div>
        `;
        Object.assign(header.style, {
            padding: '16px 20px', borderBottom: '1px solid #27272a', background: '#09090b'
        });

        // Contenedor de Lista (Vista 1)
        const listContainer = document.createElement('div');
        Object.assign(listContainer.style, { overflowY: 'auto', padding: '8px', flex: '1' });

        // Contenedor de Formulario (Vista 2 - Oculta inicialmente)
        const formContainer = document.createElement('div');
        Object.assign(formContainer.style, { 
            padding: '20px', flex: '1', display: 'none', flexDirection: 'column', gap: '15px' 
        });

        // --- LÓGICA DE NAVEGACIÓN ---
        
        // Generar lista de botones
        Object.keys(templates).sort().forEach(key => {
            const btn = document.createElement('div');
            btn.innerHTML = `<span style="color:#e4e4e7;">${key}</span>`;
            Object.assign(btn.style, {
                padding: '12px 16px', cursor: 'pointer', borderRadius: '6px',
                fontSize: '13px', transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            });

            btn.onmouseover = () => { btn.style.background = '#18181b'; };
            btn.onmouseout = () => { btn.style.background = 'transparent'; };

            btn.onclick = () => {
                let rawContent = templates[key];
                // Inyectar selección inicial si existe
                rawContent = rawContent.replace('{{INPUT}}', userSelection);

                // Detectar variables
                if (window.TemplateManager && typeof window.TemplateManager.parseVariables === 'function') {
                    const vars = window.TemplateManager.parseVariables(rawContent);
                    
                    if (vars.length > 0) {
                        // MODO FORMULARIO (Los "Cuadros" que recordabas)
                        showForm(key, vars, rawContent);
                    } else {
                        // MODO DIRECTO
                        finish(rawContent);
                    }
                } else {
                    finish(rawContent);
                }
            };
            listContainer.appendChild(btn);
        });

        // Función para mostrar el Formulario Visual
        const showForm = (templateName, vars, contentTemplate) => {
            listContainer.style.display = 'none';
            formContainer.style.display = 'flex';
            formContainer.innerHTML = ''; // Limpiar previo

            // Título del form
            const title = document.createElement('div');
            title.innerHTML = `<span style="color:#71717a">Setup:</span> <span style="color:#fff">${templateName}</span>`;
            title.style.marginBottom = '10px';
            title.style.fontSize = '14px';
            formContainer.appendChild(title);

            const inputValues = {};

            // Generar "Cuadros" (Inputs)
            vars.forEach(v => {
                const field = document.createElement('div');
                field.style.display = 'flex';
                field.style.flexDirection = 'column';
                field.style.gap = '6px';

                const label = document.createElement('label');
                label.textContent = v.key;
                label.style.color = '#a1a1aa';
                label.style.fontSize = '12px';
                label.style.fontWeight = '500';

                let input;
                if (v.options) {
                    // Select Box
                    input = document.createElement('select');
                    v.options.forEach(opt => {
                        const o = document.createElement('option');
                        o.value = opt;
                        o.textContent = opt;
                        input.appendChild(o);
                    });
                } else {
                    // Text Input (El "Cuadro")
                    input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = `Enter ${v.key}...`;
                }

                Object.assign(input.style, {
                    background: '#18181b', border: '1px solid #27272a', borderRadius: '6px',
                    padding: '10px', color: '#fff', fontSize: '13px', outline: 'none',
                    fontFamily: 'monospace'
                });

                input.onfocus = () => input.style.borderColor = '#10b981';
                input.onblur = () => input.style.borderColor = '#27272a';
                
                // Guardar referencia
                input.oninput = (e) => inputValues[v.key] = e.target.value;
                // Valor inicial
                inputValues[v.key] = v.options ? v.options[0] : "";

                field.appendChild(label);
                field.appendChild(input);
                formContainer.appendChild(field);
                
                // Auto-focus en el primer campo
                if (v === vars[0]) setTimeout(() => input.focus(), 50);
            });

            // Botón de Acción (Generar)
            const submitBtn = document.createElement('button');
            submitBtn.textContent = 'INJECT PROMPT';
            Object.assign(submitBtn.style, {
                background: '#10b981', color: '#000', border: 'none', borderRadius: '6px',
                padding: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px',
                fontSize: '13px', transition: '0.2s'
            });
            
            submitBtn.onmouseover = () => submitBtn.style.opacity = '0.9';
            submitBtn.onmouseout = () => submitBtn.style.opacity = '1';

            submitBtn.onclick = () => {
                const final = window.TemplateManager.compileVariables(contentTemplate, inputValues);
                finish(final);
            };

            // Manejo de Enter
            formContainer.onkeydown = (e) => {
                if (e.key === 'Enter') submitBtn.click();
            };

            formContainer.appendChild(submitBtn);
        };

        // Función Final: Cerrar e Inyectar
        const finish = (text) => {
            this.close();
            // Retraso técnico para recuperar foco
            setTimeout(() => onSelectCallback(text), 100);
        };

        // Clic fuera cierra
        overlay.onclick = (e) => { if(e.target === overlay) this.close(); };

        panel.appendChild(header);
        panel.appendChild(listContainer);
        panel.appendChild(formContainer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        this.overlay = overlay;
    },

    close: function() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            this.panel = null;
        }
    }
};