// src/inject/ui.js - v16.3 (Professional Wide UI)
console.log(">arch: UI v16.3 (Wide Edition) Loaded");

window.ArchUI = {
    overlay: null,
    currentTemplate: null,
    variables: {},
    onSubmit: null,

    // 1. CREAR PANEL (Diseño Ancho)
    create: function(templates, submitCallback) {
        this.onSubmit = submitCallback;
        if (this.overlay) this.close();

        // Backdrop (Fondo borroso)
        this.backdrop = document.createElement('div');
        Object.assign(this.backdrop.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            zIndex: '2147483646', opacity: '0', transition: 'opacity 0.2s'
        });

        // Panel Principal (WIDE MODE)
        this.overlay = document.createElement('div');
        this.overlay.id = 'arch-overlay';
        Object.assign(this.overlay.style, {
            position: 'fixed', 
            top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%) scale(0.95)',
            width: '92%',             // Ocupa casi toda la pantalla
            maxWidth: '1000px',        // Límite para monitores grandes
            minHeight: '600px',       // Altura generosa
            maxHeight: '90vh',
            background: '#09090b', 
            color: '#e4e4e7',
            border: '1px solid #27272a', 
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            zIndex: '2147483647',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', opacity: '0', transition: 'all 0.2s ease-out'
        });

        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.overlay);

        requestAnimationFrame(() => {
            this.backdrop.style.opacity = '1';
            this.overlay.style.opacity = '1';
            this.overlay.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        this.backdrop.onclick = () => this.close();
        this.renderMainMenu(templates);
    },

    // 2. MENÚ PRINCIPAL (Grid Espacioso)
    renderMainMenu: function(templates) {
        this.overlay.innerHTML = '';
        this.variables = {};
        this.currentTemplate = null;

        // Header
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '25px 35px', borderBottom: '1px solid #27272a', background: '#000',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        });
        header.innerHTML = `
            <div style="font-size:18px; font-weight:700; color:#10b981;">>_ Select Mode</div>
            <div style="font-size:12px; color:#71717a; cursor:pointer;" onclick="window.ArchUI.close()">[ESC] Close</div>
        `;

        // Grid
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '15px', padding: '35px', overflowY: 'auto', flex: '1'
        });

        // Categorías Inteligentes
        const categories = {
            'ENGINEERING': ['DEV', 'FIX', 'DB_', 'LOGIC', 'R1_'],
            'AGENTS & STRATEGY': ['AI_', 'SWARM', 'BLUEPRINT', 'TRUTH', 'REC_'],
            'VISUAL & DATA': ['ARCH_', 'UI', 'SKETCH', 'VISION', 'DATA'],
            'AUTOMATION': ['REC_', 'CHAIN_', 'LAM_', 'FLOW']
        };

        for (const [catName, prefixes] of Object.entries(categories)) {
            const catHeader = document.createElement('div');
            catHeader.textContent = catName;
            Object.assign(catHeader.style, { gridColumn: '1/-1', fontSize:'11px', color:'#52525b', fontWeight:'700', letterSpacing:'1px', marginTop:'15px', marginBottom:'5px' });
            grid.appendChild(catHeader);

            Object.entries(templates).forEach(([key, content]) => {
                if (prefixes.some(p => key.startsWith(p))) {
                    const btn = document.createElement('div');
                    btn.textContent = key;
                    Object.assign(btn.style, {
                        background: '#18181b', border: '1px solid #27272a',
                        padding: '20px', borderRadius: '10px', cursor: 'pointer',
                        textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#e4e4e7',
                        transition: 'all 0.15s'
                    });
                    btn.onmouseover = () => { btn.style.background = '#27272a'; btn.style.borderColor = '#10b981'; };
                    btn.onmouseout = () => { btn.style.background = '#18181b'; btn.style.borderColor = '#27272a'; };
                    btn.onclick = () => this.loadTemplate(key, content);
                    grid.appendChild(btn);
                }
            });
        }
        
        this.overlay.appendChild(header);
        this.overlay.appendChild(grid);
    },

    // 3. CARGAR VARIABLES
    loadTemplate: function(key, content) {
        this.currentTemplate = content;
        this.variables = {};
        const varRegex = /{{VAR:([^:]+):?([^}]*)}}/g;
        let match;
        let hasVars = false;

        while ((match = varRegex.exec(content)) !== null) {
            hasVars = true;
            const [full, name, optionsStr] = match;
            this.variables[name] = {
                fullString: full,
                options: optionsStr ? optionsStr.split(',') : null,
                value: ''
            };
        }

        if (hasVars) this.renderForm(key);
        else this.submit();
    },

    // 4. FORMULARIO (Inputs Grandes)
    renderForm: function(key) {
        this.overlay.innerHTML = '';

        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '25px 35px', borderBottom: '1px solid #27272a', background:'#000',
            display:'flex', alignItems:'center', gap:'10px'
        });
        header.innerHTML = `
            <div style="cursor:pointer; color:#71717a;" onclick="window.ArchUI.renderMainMenu(window.TemplateManager.cache || {})">← Back</div>
            <div style="font-size:18px; font-weight:700; color:#10b981;">CONFIG: ${key}</div>
        `;

        const formContainer = document.createElement('div');
        Object.assign(formContainer.style, { padding: '40px', overflowY: 'auto', flex: '1', display: 'flex', flexDirection: 'column', gap: '25px' });

        for (const [name, data] of Object.entries(this.variables)) {
            const wrapper = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = name;
            Object.assign(label.style, { display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#a1a1aa' });

            let input;
            if (data.options) {
                input = document.createElement('select');
                data.options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt; o.textContent = opt; input.appendChild(o);
                });
                this.variables[name].value = data.options[0];
                input.onchange = (e) => this.variables[name].value = e.target.value;
            } else {
                if (name === 'INPUT' || name === 'CODE' || name.includes('Context')) {
                    input = document.createElement('textarea');
                    input.style.height = '180px'; // Textarea ALTO
                    input.style.resize = 'vertical';
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                }
                input.oninput = (e) => this.variables[name].value = e.target.value;
            }

            Object.assign(input.style, {
                width: '100%', padding: '15px', background: '#18181b', border: '1px solid #27272a',
                borderRadius: '8px', color: '#e4e4e7', fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px', outline: 'none'
            });
            input.onfocus = () => input.style.borderColor = '#10b981';
            input.onblur = () => input.style.borderColor = '#27272a';

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            formContainer.appendChild(wrapper);

            if (name === 'INPUT') setTimeout(() => input.focus(), 50);
        }

        const btn = document.createElement('button');
        btn.textContent = 'INITIALIZE >';
        Object.assign(btn.style, {
            padding: '18px', background: '#10b981', color: '#000', border: 'none',
            borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px'
        });
        btn.onclick = () => this.submit();

        formContainer.appendChild(btn);
        this.overlay.appendChild(header);
        this.overlay.appendChild(formContainer);
    },

    submit: function() {
        let text = this.currentTemplate;
        for (const data of Object.values(this.variables)) {
            text = text.replace(data.fullString, data.value);
        }
        if (this.onSubmit) this.onSubmit(text);
        this.close();
    },

    close: function() {
        if (this.overlay) {
            this.overlay.remove();
            this.backdrop.remove();
            this.overlay = null;
        }
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.ArchUI.overlay) window.ArchUI.close();
});