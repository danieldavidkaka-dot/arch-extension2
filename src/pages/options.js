// src/pages/options.js - Studio Logic v12.1 (Enhanced UX)
console.log(">arch: Studio Logic Loaded");

document.addEventListener('DOMContentLoaded', async () => {
    
    // Referencias al DOM
    const listContainer = document.getElementById('templateList');
    const nameInput = document.getElementById('templateName');
    const contentInput = document.getElementById('templateContent');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const newBtn = document.getElementById('newBtn');

    if (!listContainer || !saveBtn) {
        console.error("Critical DOM elements missing");
        return;
    }

    let currentMode = 'NEW'; 
    
    // --- 1. RENDERIZAR LISTA (Con Distinción Visual) ---
    async function renderList() {
        listContainer.innerHTML = '';
        const templates = await window.TemplateManager.getAll();
        
        // Ordenar: Primero los Custom (User), luego los Core (System)
        const keys = Object.keys(templates).sort();

        keys.forEach(key => {
            const item = document.createElement('div');
            item.className = 'template-item';
            
            // Chequear si es del sistema
            const isCore = window.ARCH_LIBRARY && window.ARCH_LIBRARY[key];
            
            if (isCore) {
                // ESTILO SYSTEM: Gris y discreto
                item.textContent = key;
                item.style.color = '#555'; 
            } else {
                // ESTILO USER: Blanco brillante y un puntito indicador
                item.innerHTML = `<span style="color:#00ff9d">•</span> ${key}`;
                item.style.color = '#fff';
                item.style.fontWeight = 'bold';
            }

            item.onclick = () => loadTemplate(key, templates[key], isCore);
            listContainer.appendChild(item);
        });
    }

    // --- 2. CARGAR TEMPLATE ---
    function loadTemplate(name, content, isCore) {
        currentMode = 'EDIT';
        nameInput.value = name;
        contentInput.value = content;
        
        // Resaltar activo
        document.querySelectorAll('.template-item').forEach(el => {
            el.style.background = 'transparent'; // Reset rápido
            if(el.textContent.includes(name)) el.style.background = '#1a1a1a';
        });
        
        // Configurar botones según si es Core o Custom
        if (isCore) {
            deleteBtn.style.display = 'none';
            // Opcional: Bloquear edición de nombre para proteger cores
            // nameInput.disabled = true; 
        } else {
            deleteBtn.style.display = 'block';
            nameInput.disabled = false;
        }
    }

    // --- 3. GUARDAR ---
    saveBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim().toUpperCase(); // Forzamos mayúsculas por convención
        const content = contentInput.value;
        
        if (!name) { alert("Please enter a template name"); return; }
        
        // Protección de Core
        if (window.ARCH_LIBRARY && window.ARCH_LIBRARY[name]) {
            if(!confirm(`⚠️ [${name}] is a Core Template.\nDo you want to create a local override?`)) {
                return;
            }
        }

        await window.TemplateManager.save(name, content);
        
        // Feedback Visual
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "SAVED!";
        saveBtn.style.background = "#fff";
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = ""; // Volver al color CSS (neon)
        }, 1000);

        renderList();
    });

    // --- 4. BORRAR ---
    deleteBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if(confirm(`Are you sure you want to delete [${name}]?`)) {
            await window.TemplateManager.delete(name);
            resetEditor();
            renderList();
        }
    });

    // --- 5. NUEVO TEMPLATE (Aquí está la magia del Formato) ---
    newBtn.addEventListener('click', () => {
        resetEditor();
    });

    function resetEditor() {
        currentMode = 'NEW';
        nameInput.value = '';
        nameInput.focus();
        nameInput.disabled = false;
        deleteBtn.style.display = 'none';

        // ¡AQUÍ ESTÁ EL FORMATO QUE FALTABA!
        // Pre-llenamos el área de texto con la estructura estándar
        contentInput.value = `> **[MODE: MY_NEW_MODE]**
> ROLE: Expert Agent.
> TASK: Describe the task here...
> INPUT:
{{INPUT}}`;
    }

    // Inicializar
    renderList();
    // Al abrir, preparamos el editor para uno nuevo automáticamente
    resetEditor(); 
});