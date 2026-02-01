// src/inject/ui.js - UI Module v9.0 (Live Variables Form)
console.log(">arch: UI Module Loaded v9.0");

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
        this.headerTitle.textContent = '>arch_console // v9.0';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'arch-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.close();

        header.appendChild(this.headerTitle);
        header.appendChild(closeBtn);

        // 3. Contenedor Dinámico (Grid o Form)
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

    // Pinta la rejilla de botones original
    renderGrid: function(templates, onSelect) {
        this.container.innerHTML = '';
        this.container.className = 'arch-grid';
        this.headerTitle.textContent = '>arch_console // Select Mode';

        Object.entries(templates).forEach(([key, templateContent]) => {
            const btn = document.createElement('div');
            btn.className = 'arch-btn';
            btn.textContent = key;
            
            btn.onclick = () => {
                const vars = window.TemplateManager.parseVariables(templateContent);
                
                if (vars.length > 0) {
                    this.renderForm(key, templateContent, vars, onSelect);
                } else {
                    onSelect(templateContent); 
                    this.close();
                }
            };
            this.container.appendChild(btn);
        });
    },

    // Pinta el formulario de variables
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
        backBtn.onclick = () => {
            window.TemplateManager.getAll().then(tpls => this.renderGrid(tpls, onSelect));
        };

        const runBtn = document.createElement('button');
        runBtn.className = 'arch-btn-run';
        runBtn.textContent = 'RUN >>';
        runBtn.onclick = () => {
            const values = {};
            for (const [key, el] of Object.entries(inputsMap)) {
                values[key] = el.value;
            }

            const filledTemplate = window.TemplateManager.compileVariables(templateContent, values);
            onSelect(filledTemplate);
            this.close();
        };
        
        this.container.onkeydown = (e) => {
            if(e.key === 'Enter') runBtn.click();
        };

        actions.appendChild(backBtn);
        actions.appendChild(runBtn);
        this.container.appendChild(actions);
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