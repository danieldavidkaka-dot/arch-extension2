// options.js
console.log(">arch: Studio Logic Loaded");

const els = {
    list: document.getElementById('templateList'),
    name: document.getElementById('editName'),
    content: document.getElementById('editContent'),
    btnSave: document.getElementById('btnSave'),
    btnNew: document.getElementById('btnNew'),
    btnDelete: document.getElementById('btnDelete'),
    btnReset: document.getElementById('btnReset'),
    status: document.getElementById('statusMsg')
};

let currentTemplates = {};

// Cargar templates al inicio
async function init() {
    // Usamos el TemplateManager que ya definimos en src/templates.js
    // Nota: Como options.html carga src/templates.js antes, window.TemplateManager existe.
    currentTemplates = await window.TemplateManager.getAll();
    renderList();
}

function renderList() {
    els.list.innerHTML = '';
    Object.keys(currentTemplates).forEach(key => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = key;
        div.onclick = () => loadTemplate(key);
        
        if (els.name.value === key) div.classList.add('active');
        els.list.appendChild(div);
    });
}

function loadTemplate(key) {
    els.name.value = key;
    els.content.value = currentTemplates[key];
    
    // Feedback visual en la lista
    document.querySelectorAll('.item').forEach(i => i.classList.remove('active'));
    // Re-render simple para marcar activo
    renderList();
}

// --- ACCIONES ---

els.btnSave.addEventListener('click', async () => {
    const name = els.name.value.trim().toUpperCase().replace(/\s+/g, '_');
    const content = els.content.value;
    
    if (!name || !content) return showStatus('Error: Name/Content empty', true);
    
    await window.TemplateManager.save(name, content);
    currentTemplates[name] = content; // Actualizar memoria local
    
    showStatus('Saved successfully!');
    renderList();
});

els.btnNew.addEventListener('click', () => {
    els.name.value = "NEW_MODE";
    els.content.value = "> **[NEW MODE]**\n> TARGET: ...\n> TASK: {{INPUT}}";
    els.name.focus();
});

els.btnDelete.addEventListener('click', async () => {
    const name = els.name.value;
    if (confirm(`Delete mode ${name}?`)) {
        await window.TemplateManager.delete(name);
        delete currentTemplates[name];
        
        els.name.value = '';
        els.content.value = '';
        renderList();
        showStatus('Deleted.');
    }
});

els.btnReset.addEventListener('click', async () => {
    if (confirm("Factory Reset: This will delete ALL custom modes. Sure?")) {
        await window.TemplateManager.reset();
        location.reload(); // Recargar página para traer defaults
    }
});

function showStatus(msg, isError = false) {
    els.status.textContent = msg;
    els.status.style.color = isError ? '#ef4444' : '#00ff9d';
    setTimeout(() => {
        els.status.textContent = 'Ready';
        els.status.style.color = '#666';
    }, 3000);
}

// Arrancar
document.addEventListener('DOMContentLoaded', init);