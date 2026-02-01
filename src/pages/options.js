// src/pages/options.js - Studio Logic v12.0
console.log(">arch: Studio Logic Loaded");

document.addEventListener('DOMContentLoaded', async () => {
    
    // Referencias al DOM (Validamos que existan para evitar errores null)
    const listContainer = document.getElementById('templateList');
    const nameInput = document.getElementById('templateName');
    const contentInput = document.getElementById('templateContent');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const newBtn = document.getElementById('newBtn');

    if (!listContainer || !saveBtn) {
        console.error("Critical DOM elements missing in options.html");
        return;
    }

    // Estado local
    let currentMode = 'NEW'; // 'NEW' o 'EDIT'
    
    // --- 1. RENDERIZAR LISTA ---
    async function renderList() {
        listContainer.innerHTML = '';
        const templates = await window.TemplateManager.getAll();
        
        // Separar Core vs Custom para visualización (opcional)
        Object.keys(templates).forEach(key => {
            const item = document.createElement('div');
            item.className = 'template-item';
            item.textContent = key;
            
            // Si está en la librería estática, lo marcamos diferente visualmente
            const isCore = window.ARCH_LIBRARY && window.ARCH_LIBRARY[key];
            if (isCore) item.style.color = '#a1a1aa'; // Gris para los core

            item.onclick = () => loadTemplate(key, templates[key], isCore);
            listContainer.appendChild(item);
        });
    }

    // --- 2. CARGAR TEMPLATE EN EDITOR ---
    function loadTemplate(name, content, isCore) {
        currentMode = 'EDIT';
        nameInput.value = name;
        contentInput.value = content;
        
        // Resaltar item activo
        document.querySelectorAll('.template-item').forEach(el => el.classList.remove('active'));
        
        // Bloquear edición de nombre si es Core (opcional)
        if (isCore) {
            deleteBtn.style.display = 'none';
            // nameInput.disabled = true; 
        } else {
            deleteBtn.style.display = 'block';
            nameInput.disabled = false;
        }
    }

    // --- 3. GUARDAR ---
    saveBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const content = contentInput.value;
        
        if (!name) { alert("Please enter a template name"); return; }
        
        // Verificar si sobrescribe un Core
        if (window.ARCH_LIBRARY && window.ARCH_LIBRARY[name]) {
            if(!confirm(`Warning: [${name}] is a Core Template. Saving will override it locally. Continue?`)) {
                return;
            }
        }

        await window.TemplateManager.save(name, content);
        alert("Saved!");
        renderList();
    });

    // --- 4. BORRAR ---
    deleteBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if(confirm(`Delete template [${name}]?`)) {
            await window.TemplateManager.delete(name);
            resetEditor();
            renderList();
        }
    });

    // --- 5. NUEVO TEMPLATE ---
    newBtn.addEventListener('click', () => {
        resetEditor();
    });

    function resetEditor() {
        currentMode = 'NEW';
        nameInput.value = '';
        contentInput.value = '';
        nameInput.disabled = false;
        deleteBtn.style.display = 'none';
        nameInput.focus();
    }

    // Inicializar
    renderList();
});