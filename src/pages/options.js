// src/pages/options.js - v15.2 Settings Manager - FULL FILE
console.log(">arch: Options Script Loaded");

// Esperar a que cargue el DOM para asignar eventos
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);

// 1. FUNCIÓN GUARDAR (Save)
function saveOptions() {
    const customKey = document.getElementById('custom-key').value.trim();
    const customContent = document.getElementById('custom-content').value;
    const status = document.getElementById('status');

    // Validación básica
    if (!customKey || !customContent) {
        showStatus('Error: Key and Content are required.', '#ff4444');
        return;
    }

    // Guardar en chrome.storage.local (Compatible con engine.js)
    chrome.storage.local.get('arch_user_templates', (result) => {
        let templates = result.arch_user_templates || {};
        
        // Agregar o Sobrescribir
        templates[customKey] = customContent;

        chrome.storage.local.set({ arch_user_templates: templates }, () => {
            showStatus(`Saved [${customKey}] successfully!`, '#00ff9d');
            restoreOptions(); // Refrescar la lista visual
            
            // Limpiar los campos de texto
            document.getElementById('custom-key').value = '';
            document.getElementById('custom-content').value = '';
        });
    });
}

// 2. FUNCIÓN LEER Y MOSTRAR (Restore)
function restoreOptions() {
    chrome.storage.local.get('arch_user_templates', (result) => {
        const templates = result.arch_user_templates || {};
        const list = document.getElementById('template-list');
        
        // Limpiar lista actual
        list.innerHTML = '';

        // Si está vacío
        if (Object.keys(templates).length === 0) {
            list.innerHTML = '<div style="color:#666; font-style:italic; padding:10px;">No custom templates found. Add one above!</div>';
            return;
        }

        // Generar elementos de la lista
        Object.keys(templates).sort().forEach(key => {
            const item = document.createElement('div');
            Object.assign(item.style, {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#1a1a1a', padding: '12px', marginBottom: '8px',
                border: '1px solid #333', borderRadius: '6px'
            });

            // Nombre del Template
            const name = document.createElement('span');
            name.textContent = key;
            name.style.color = '#00ff9d';
            name.style.fontFamily = 'monospace';
            name.style.fontWeight = 'bold';

            // Botón Borrar
            const delBtn = document.createElement('button');
            delBtn.textContent = 'DELETE';
            Object.assign(delBtn.style, {
                background: '#2a0000', color: '#ff5555', border: '1px solid #550000',
                cursor: 'pointer', fontSize: '11px', padding: '5px 10px', borderRadius: '4px',
                transition: '0.2s'
            });

            delBtn.onmouseover = () => delBtn.style.background = '#4a0000';
            delBtn.onmouseout = () => delBtn.style.background = '#2a0000';

            delBtn.onclick = () => {
                deleteTemplate(key);
            };

            item.appendChild(name);
            item.appendChild(delBtn);
            list.appendChild(item);
        });
    });
}

// 3. FUNCIÓN BORRAR (Delete)
function deleteTemplate(key) {
    // Confirmación simple
    if(!confirm(`Are you sure you want to delete [${key}]?`)) return;

    chrome.storage.local.get('arch_user_templates', (result) => {
        let templates = result.arch_user_templates || {};
        delete templates[key]; // Eliminar del objeto
        
        chrome.storage.local.set({ arch_user_templates: templates }, () => {
            restoreOptions(); // Refrescar lista
            showStatus(`Deleted [${key}]`, '#ffaa00');
        });
    });
}

// 4. RESET TOTAL (Danger Zone)
function resetOptions() {
    if(confirm("WARNING: This will delete ALL your custom templates.\n\nAre you sure?")) {
        chrome.storage.local.remove('arch_user_templates', () => {
            restoreOptions();
            showStatus('All custom templates deleted.', '#ff4444');
        });
    }
}

// Helper para mensajes de estado
function showStatus(text, color) {
    const status = document.getElementById('status');
    status.textContent = text;
    status.style.color = color;
    status.style.opacity = '1';
    
    // Desvanecer después de 3 segundos
    setTimeout(() => { 
        status.style.opacity = '0';
        setTimeout(() => { status.textContent = ''; }, 500);
    }, 3000);
}