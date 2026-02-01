// src/inject/ui.js - UI Module v10.0 (Canvas Engine)
console.log(">arch: UI Module Loaded v10.0");

window.ArchUI = {
    overlay: null,
    modal: null,
    container: null, 
    headerTitle: null,
    
    create: function(templates, onSelectCallback) {
        this.cleanup();

        // 1. Estructura Base
        this.overlay = document.createElement('div');
        this.overlay.className = 'arch-modal-overlay';
        this.overlay.style.display = 'none';

        this.modal = document.createElement('div');
        this.modal.className = 'arch-modal';

        // 2. Header
        const header = document.createElement('div');
        header.className = 'arch-modal-header';
        
        this.headerTitle = document.createElement('span');
        this.headerTitle.className = 'arch-title';
        this.headerTitle.textContent = '>arch_console // v10.0';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'arch-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.close();

        header.appendChild(this.headerTitle);
        header.appendChild(closeBtn);

        // 3. Contenedor Dinámico
        this.container = document.createElement('div');
        this.renderGrid(templates, onSelectCallback);

        this.modal.appendChild(header);
        this.modal.appendChild(this.container);
        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        // 4. Trigger Button
        const trigger = document.createElement('div');
        trigger.className = 'arch-trigger';
        trigger.textContent = '>_';
        trigger.onclick = () => {
            this.overlay.style.display = 'flex';
            this.renderGrid(templates, onSelectCallback);
        };
        document.body.appendChild(trigger);
    },

    // --- MODO 1: GRID ---
    renderGrid: function(templates, onSelect) {
        this.container.innerHTML = '';
        this.container.className = 'arch-grid';
        this.headerTitle.textContent = '>arch_console // Select Mode';

        Object.entries(templates).forEach(([key, templateContent]) => {
            const btn = document.createElement('div');
            btn.className = 'arch-btn';
            btn.textContent = key;
            
            btn.onclick = () => {
                // A) MODO CANVAS (Detección especial)
                if (key === 'SKETCH_TO_UI') {
                    this.renderCanvas(key, templateContent, onSelect);
                    return;
                }

                // B) MODO VARIABLES VIVAS
                const vars = window.TemplateManager.parseVariables(templateContent);
                if (vars.length > 0) {
                    this.renderForm(key, templateContent, vars, onSelect);
                } else {
                    // C) MODO DIRECTO
                    onSelect(templateContent); 
                    this.close();
                }
            };
            this.container.appendChild(btn);
        });
    },

    // --- MODO 2: FORMULARIO (Ya lo tenías) ---
    renderForm: function(modeKey, templateContent, variables, onSelect) {
        this.container.innerHTML = '';
        this.container.className = 'arch-form-container';
        this.headerTitle.textContent = `>_ CONFIG: ${modeKey}`;

        const inputsMap = {}; 

        variables.forEach(v => {
            const group = document.createElement('div');
            group.className = 'arch-form-group';
            const label = document.createElement('label');
            label.className = 'arch-label';
            label.textContent = v.key;

            let inputEl;
            if (v.options) {
                inputEl = document.createElement('select');
                inputEl.className = 'arch-select';
                v.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    inputEl.appendChild(option);
                });
            } else {
                inputEl = document.createElement('input');
                inputEl.type = 'text';
                inputEl.className = 'arch-input';
                inputEl.placeholder = `Enter ${v.key}...`;
                if (Object.keys(inputsMap).length === 0) setTimeout(() => inputEl.focus(), 100);
            }
            inputsMap[v.key] = inputEl;
            group.appendChild(label);
            group.appendChild(inputEl);
            this.container.appendChild(group);
        });

        const actions = document.createElement('div');
        actions.className = 'arch-form-actions';
        
        const backBtn = document.createElement('button');
        backBtn.className = 'arch-btn-back';
        backBtn.textContent = '<< BACK';
        backBtn.onclick = () => window.TemplateManager.getAll().then(tpls => this.renderGrid(tpls, onSelect));

        const runBtn = document.createElement('button');
        runBtn.className = 'arch-btn-run';
        runBtn.textContent = 'RUN >>';
        runBtn.onclick = () => {
            const values = {};
            for (const [key, el] of Object.entries(inputsMap)) values[key] = el.value;
            const filledTemplate = window.TemplateManager.compileVariables(templateContent, values);
            onSelect(filledTemplate);
            this.close();
        };

        this.container.onkeydown = (e) => { if(e.key === 'Enter') runBtn.click(); };
        actions.appendChild(backBtn);
        actions.appendChild(runBtn);
        this.container.appendChild(actions);
    },

    // --- MODO 3: CANVAS (NUEVO) ---
    renderCanvas: function(modeKey, templateContent, onSelect) {
        this.container.innerHTML = '';
        this.container.className = 'arch-canvas-wrapper';
        this.headerTitle.textContent = `>_ SKETCH BOARD`;

        // 1. Crear el elemento Canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'arch-canvas-board';
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        // Configuración inicial de dibujo
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo negro
        ctx.strokeStyle = '#00ff9d'; // Color Neón
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Lógica de Dibujo
        let drawing = false;
        
        const startDraw = (e) => {
            drawing = true;
            ctx.beginPath();
            const rect = canvas.getBoundingClientRect();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        };
        
        const draw = (e) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        };
        
        const endDraw = () => {
            drawing = false;
            ctx.closePath();
        };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseout', endDraw);

        // 2. Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'arch-canvas-toolbar';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'arch-tool-btn';
        clearBtn.textContent = 'CLEAR';
        clearBtn.onclick = () => {
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const genBtn = document.createElement('button');
        genBtn.className = 'arch-tool-btn arch-btn-gen';
        genBtn.textContent = 'COPY & GENERATE';
        
        // 3. LA MAGIA: Canvas -> Portapapeles -> Chat
        genBtn.onclick = () => {
            canvas.toBlob(blob => {
                try {
                    // Escribir imagen en Portapapeles
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]).then(() => {
                        // Inyectar el Prompt de Texto
                        onSelect(templateContent + "\n\n(PASTE THE IMAGE HERE WITH CTRL+V)");
                        alert("Sketch copied! Now PASTE (Ctrl+V) inside the chat.");
                        this.close();
                    }).catch(err => {
                        console.error("Clipboard error:", err);
                        alert("Error copying image via API. Try checking browser permissions.");
                    });
                } catch (e) {
                    alert("Your browser does not support automatic image copying from extensions.");
                }
            });
        };
        
        const backBtn = document.createElement('button');
        backBtn.className = 'arch-tool-btn';
        backBtn.textContent = 'BACK';
        backBtn.onclick = () => window.TemplateManager.getAll().then(tpls => this.renderGrid(tpls, onSelect));

        toolbar.appendChild(backBtn);
        toolbar.appendChild(clearBtn);
        toolbar.appendChild(genBtn);

        this.container.appendChild(canvas);
        this.container.appendChild(toolbar);
    },

    close: function() {
        if (this.overlay) this.overlay.style.display = 'none';
    },

    cleanup: function() {
        const existOv = document.querySelector('.arch-modal-overlay');
        const existTr = document.querySelector('.arch-trigger');
        if (existOv) existOv.remove();
        if (existTr) existTr.remove();
    }
};