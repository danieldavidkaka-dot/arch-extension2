// src/pages/options.js - v16.4 (Dynamic Renderer)
console.log(">arch: Options v16.4 Loaded");

document.addEventListener('DOMContentLoaded', () => {
    restoreUserOptions(); // Cargar templates del usuario
    renderManual();       // Dibujar el manual desde library.js
});

// Event Listeners
const btnSave = document.getElementById('save');
const btnReset = document.getElementById('reset');
if (btnSave) btnSave.addEventListener('click', saveOption);
if (btnReset) btnReset.addEventListener('click', resetOptions);

// --- 1. GESTIÓN DE USUARIO (Izquierda) ---
function saveOption() {
    const keyInput = document.getElementById('custom-key');
    const contentInput = document.getElementById('custom-content');
    
    const key = keyInput.value.trim();
    const content = contentInput.value;
    
    if (!key || !content) return showStatus('Error: Rellena ambos campos', '#ff4444');

    chrome.storage.local.get('arch_user_templates', (res) => {
        const templates = res.arch_user_templates || {};
        templates[key] = content;
        chrome.storage.local.set({ arch_user_templates: templates }, () => {
            showStatus(`Guardado [${key}]`, '#10b981');
            restoreUserOptions();
            keyInput.value = '';
            contentInput.value = '';
        });
    });
}

function restoreUserOptions() {
    chrome.storage.local.get('arch_user_templates', (res) => {
        const list = document.getElementById('template-list');
        list.innerHTML = '';
        const templates = res.arch_user_templates || {};

        if (Object.keys(templates).length === 0) {
            list.innerHTML = '<div style="color:#555; font-size:12px; font-style:italic">No hay templates personalizados.</div>';
            return;
        }

        Object.keys(templates).forEach(key => {
            const item = document.createElement('div');
            Object.assign(item.style, {
                background: '#222', padding: '10px', marginBottom: '5px', borderRadius: '4px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px'
            });
            
            const span = document.createElement('span');
            span.textContent = key;
            span.style.fontFamily = 'monospace';
            span.style.color = '#fff';

            const del = document.createElement('button');
            del.textContent = 'x';
            Object.assign(del.style, { width: '25px', padding: '2px', background: '#333', color: '#ff4444', marginLeft: '10px', border: 'none', cursor: 'pointer' });
            del.onclick = () => deleteOption(key);

            item.appendChild(span);
            item.appendChild(del);
            list.appendChild(item);
        });
    });
}

function deleteOption(key) {
    if (!confirm(`¿Borrar ${key}?`)) return;
    chrome.storage.local.get('arch_user_templates', (res) => {
        const t = res.arch_user_templates || {};
        delete t[key];
        chrome.storage.local.set({ arch_user_templates: t }, () => {
            restoreUserOptions();
            showStatus(`Borrado [${key}]`, '#eab308');
        });
    });
}

function resetOptions() {
    if (confirm("ADVERTENCIA: ¿Seguro que quieres borrar TODOS tus templates personalizados?")) {
        chrome.storage.local.remove('arch_user_templates', () => {
            restoreUserOptions();
            showStatus('Reset completado', '#ff4444');
        });
    }
}

function showStatus(msg, color) {
    const el = document.getElementById('status');
    el.textContent = msg;
    el.style.color = color;
    setTimeout(() => el.textContent = '', 3000);
}

// --- 2. RENDERIZADO DEL MANUAL (Derecha) ---
function renderManual() {
    const container = document.getElementById('manual-container');
    
    // Verificación de seguridad por si library.js no cargó
    if (!window.ARCH_LIBRARY) {
        container.innerHTML = "<div style='color:red; padding:20px; border:1px solid red'>Error crítico: library.js no se ha cargado. Revisa la consola.</div>";
        return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Agrupar por categorías (Heurística simple basada en prefijos)
    const categories = {
        'ENGINEERING CORE': ['DEV', 'DB_', 'FIX', 'UNIT_', 'LOGIC', 'R1_', 'DOC_'],
        'AGENTS & STRATEGY': ['AI_', 'SWARM', 'BLUEPRINT', 'TRUTH', 'REC_ADVISOR'],
        'VISUAL & SPATIAL': ['ARCH_', 'SKETCH', 'UI', 'VISION', 'DATA'],
        'AUTOMATION & WORKFLOWS': ['REC_SCREEN', 'CHAIN_', 'LAM_', 'FLOW']
    };

    const usedKeys = new Set();

    for (const [catName, prefixes] of Object.entries(categories)) {
        // Título de categoría
        const h3 = document.createElement('h3');
        h3.textContent = catName;
        container.appendChild(h3);

        const grid = document.createElement('div');
        grid.className = 'mode-grid';

        // Buscar prompts que coincidan con los prefijos
        let foundAny = false;
        Object.entries(window.ARCH_LIBRARY).forEach(([key, prompt]) => {
            if (usedKeys.has(key)) return; // Ya mostrado

            if (prefixes.some(p => key.startsWith(p))) {
                usedKeys.add(key);
                const card = createCard(key, prompt);
                grid.appendChild(card);
                foundAny = true;
            }
        });

        if (!foundAny) {
            const empty = document.createElement('div');
            empty.textContent = "No modes found in this category.";
            empty.style.color = "#444";
            empty.style.fontSize = "10px";
            grid.appendChild(empty);
        }

        container.appendChild(grid);
    }

    // Otros (Fallback para cualquier llave nueva que no esté categorizada)
    const remaining = Object.keys(window.ARCH_LIBRARY).filter(k => !usedKeys.has(k));
    if (remaining.length > 0) {
        const h3 = document.createElement('h3');
        h3.textContent = "OTROS / MISCELLANEOUS";
        container.appendChild(h3);
        const grid = document.createElement('div');
        grid.className = 'mode-grid';
        remaining.forEach(key => grid.appendChild(createCard(key, window.ARCH_LIBRARY[key])));
        container.appendChild(grid);
    }
}

function createCard(key, prompt) {
    const card = document.createElement('div');
    card.className = 'mode-card';
    
    // Extraer rol o descripción breve del prompt usando Regex
    // Busca "> ROLE: ..." o toma una descripción genérica
    const roleMatch = prompt.match(/> ROLE: (.*?)(\n|$)/);
    const desc = roleMatch ? roleMatch[1].trim() : "Prompt especializado del sistema >arch.";

    card.innerHTML = `
        <div class="mode-header">
            <span class="mode-name">${key}</span>
        </div>
        <div class="mode-desc">${desc.substring(0, 85)}${desc.length > 85 ? '...' : ''}</div>
    `;
    
    // Opcional: Al hacer click podría copiar el nombre al portapapeles
    card.onclick = () => {
        navigator.clipboard.writeText(key);
        showStatus(`Copiado: ${key}`, '#10b981');
    };
    card.title = "Click para copiar nombre";
    card.style.cursor = "pointer";

    return card;
}