// src/pages/popup.js - v12.0 Scalable Guide & Data
console.log(">arch: Popup Logic Loaded");

// =============================================================================
// 1. CONFIGURACIÓN DE DATOS (LA LISTA MAESTRA)
// =============================================================================
const GUIDE_DATA = [
    {
        title: "⚡ Studio Syntax (Click to Copy)",
        colorVar: "--syntax-color",
        items: [
            { 
                name: "{{VAR:Name}}", 
                desc: "Crea un campo de texto libre (ej: Objetivo, Nombre).", 
                type: "syntax", 
                code: "{{VAR:Name}}" 
            },
            { 
                name: "{{VAR:List:A|B}}", 
                desc: "Crea un menú desplegable con opciones fijas.", 
                type: "syntax", 
                code: "{{VAR:Name:Option1|Option2}}" 
            }
        ]
    },
    {
        title: "🤖 Autonomous Agents",
        items: [
            { 
                name: "AI_ORCHESTRATOR", 
                desc: "Project Manager que divide tareas complejas para otros IAs.", 
                type: "agent" 
            },
            { 
                name: "UNIVERSAL_TRUTH", 
                desc: "Verificador de hechos estricto. Evita alucinaciones.", 
                type: "agent" 
            }
        ]
    },
    {
        title: "🛠️ Engineering Core",
        items: [
            { 
                name: "DEV", 
                desc: "Solo código JSON estricto. Sin charlas ni markdown.", 
                type: "eng" 
            },
            { 
                name: "DB_ARCHITECT", 
                desc: "Genera esquemas SQL (Supabase) a partir de requisitos.", 
                type: "eng" 
            },
            { 
                name: "FIX", 
                desc: "Debug automático: Pega un error, recibe la solución.", 
                type: "eng" 
            },
            { 
                name: "LOGIC", 
                desc: "Auditor de seguridad y lógica (busca fallos/bugs).", 
                type: "eng" 
            },
            { 
                name: "R1_THINK", 
                desc: "Activa el razonamiento profundo (Chain of Thought).", 
                type: "eng" 
            }
        ]
    },
    {
        title: "🎨 Visual & Data Ops",
        items: [
            { 
                name: "SKETCH_TO_UI", 
                desc: "✨ Dibuja un boceto y conviértelo a HTML/Tailwind.", 
                type: "vis" 
            },
            { 
                name: "UI_REPLICA", 
                desc: "Sube una captura de pantalla para clonar su código.", 
                type: "vis" 
            },
            { 
                name: "UI/UX", 
                desc: "Generador de componentes modernos (Shadcn/React).", 
                type: "vis" 
            },
            { 
                name: "DATA", 
                desc: "Genera datos falsos (Mock Data) en JSON/CSV para pruebas.", 
                type: "vis" 
            }
        ]
    },
    {
        title: "⛓️ Advanced Workflows",
        items: [
            { 
                name: "SHADOW_OBSERVER", 
                desc: "✨ Graba tus acciones en web para crear automatizaciones.", 
                type: "flow" 
            },
            { 
                name: "CHAIN_DENSITY", 
                desc: "Mejora recursiva (Escribe -> Critica -> Mejora -> Final).", 
                type: "flow" 
            },
            { 
                name: "LAM_SCRIPT", 
                desc: "Crea scripts de Playwright/Selenium para bots.", 
                type: "flow" 
            },
            { 
                name: "SWARM", 
                desc: "Diseña arquitecturas de múltiples agentes (Topology).", 
                type: "flow" 
            },
            { 
                name: "BLUEPRINT", 
                desc: "Define la arquitectura completa de un Agente Autónomo.", 
                type: "flow" 
            }
        ]
    },
    {
        title: "🚀 Examples (Variables Vivas)",
        items: [
            { 
                name: "SUPER_FEATURE", 
                desc: "Generador de Apps con selector de Stack y Nivel.", 
                type: "flow" 
            },
            { 
                name: "MARKETING_PRO", 
                desc: "Estratega de contenidos con selector de Red Social.", 
                type: "flow" 
            }
        ]
    }
];

// =============================================================================
// 2. RENDERIZADO DINÁMICO (NO TOCAR)
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('guide-container');
    
    if (!container) {
        console.error("Error: Element #guide-container not found in popup.html");
        return;
    }
    
    // Generar HTML basado en GUIDE_DATA
    GUIDE_DATA.forEach(section => {
        // A. Crear Título de Sección
        const titleEl = document.createElement('div');
        titleEl.className = 'section-title';
        titleEl.innerText = section.title;
        if (section.colorVar) titleEl.style.color = `var(${section.colorVar})`;
        container.appendChild(titleEl);

        // B. Crear Grid
        const gridEl = document.createElement('div');
        gridEl.className = 'modes-grid';

        // C. Crear Items
        section.items.forEach(item => {
            const modeEl = document.createElement('div');
            modeEl.className = `mode-item border-${item.type}`;
            if (item.type === 'syntax') modeEl.classList.add('syntax-trigger');
            
            // Texto a copiar (Código especial o Nombre del modo)
            const textToCopy = item.code || `>arch MODE: ${item.name} - ${item.desc}`;
            
            modeEl.setAttribute('data-copy', textToCopy);
            modeEl.setAttribute('data-is-code', item.type === 'syntax');

            modeEl.innerHTML = `
                <span class="mode-name">${item.name}</span>
                <span class="mode-desc">${item.desc}</span>
            `;

            // Evento de Click (Copiar)
            modeEl.onclick = () => handleCopy(modeEl);
            
            gridEl.appendChild(modeEl);
        });

        container.appendChild(gridEl);
    });

    // --- LÓGICA DE COPIADO ---
    async function handleCopy(element) {
        const text = element.getAttribute('data-copy');
        const isCode = element.getAttribute('data-is-code') === 'true';

        try {
            await navigator.clipboard.writeText(text);
            
            // Feedback Visual (Animación)
            const nameSpan = element.querySelector('.mode-name');
            const originalText = nameSpan.innerText;
            const originalBorder = element.style.borderColor;
            const originalBg = element.style.backgroundColor;

            // Cambiar colores temporalmente
            element.style.borderColor = isCode ? '#e879f9' : '#00ff9d'; // Rosa o Verde
            element.style.backgroundColor = isCode ? '#2a1a2e' : '#112211';
            
            nameSpan.innerText = "COPIED!";
            nameSpan.style.color = isCode ? '#e879f9' : '#00ff9d';
            
            setTimeout(() => {
                element.style.borderColor = originalBorder;
                element.style.backgroundColor = originalBg;
                nameSpan.innerText = originalText;
                nameSpan.style.color = ""; 
            }, 1000);

        } catch (err) {
            console.error('Copy failed', err);
        }
    }

    // --- BOTÓN DE OPCIONES (STUDIO) ---
    const optionsBtn = document.getElementById('openOptions');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('src/pages/options.html'));
            }
        });
    }
});