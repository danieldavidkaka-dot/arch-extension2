// src/pages/popup.js - v12.0 Master Guide
console.log(">arch: Popup Logic Loaded");

const GUIDE_DATA = [
    // --- SECCIÓN 0: HERRAMIENTAS DE ESTUDIO ---
    {
        title: "⚡ Studio Syntax (Click to Copy)",
        colorVar: "--syntax-color",
        items: [
            { 
                name: "{{VAR:Name}}", 
                desc: "Campo de texto libre (ej: Objetivo).", 
                type: "syntax", 
                code: "{{VAR:Name}}" 
            },
            { 
                name: "{{VAR:List:A|B}}", 
                desc: "Menú desplegable de opciones.", 
                type: "syntax", 
                code: "{{VAR:Name:Option1|Option2}}" 
            }
        ]
    },

    // --- SECCIÓN 1: AGENTES ---
    {
        title: "🤖 Autonomous Agents",
        items: [
            { 
                name: "AI_ORCHESTRATOR", 
                desc: "Project Manager: Divide tareas complejas para otros IAs.", 
                type: "agent" 
            },
            { 
                name: "UNIVERSAL_TRUTH", 
                desc: "Fact Checker: Verificador estricto anti-alucinaciones.", 
                type: "agent" 
            }
        ]
    },

    // --- SECCIÓN 2: INGENIERÍA ---
    {
        title: "🛠️ Engineering Core",
        items: [
            { 
                name: "DEV", 
                desc: "Arquitecto JSON estricto. Sin texto conversacional.", 
                type: "eng" 
            },
            { 
                name: "DB_ARCHITECT", 
                desc: "Genera esquemas SQL (Supabase) desde requisitos.", 
                type: "eng" 
            },
            { 
                name: "FIX", 
                desc: "Auto-Debugger: Analiza logs de error y devuelve el fix.", 
                type: "eng" 
            },
            { 
                name: "LOGIC", 
                desc: "Auditor de Seguridad: Busca vulnerabilidades y fallos lógicos.", 
                type: "eng" 
            },
            { 
                name: "R1_THINK", 
                desc: "Deep Thought: Razonamiento profundo (Chain of Thought).", 
                type: "eng" 
            }
        ]
    },

    // --- SECCIÓN 3: VISUAL ---
    {
        title: "🎨 Visual & Data Ops",
        items: [
            { 
                name: "SKETCH_TO_UI", 
                desc: "✨ CANVAS: Dibuja un boceto y genera HTML/Tailwind.", 
                type: "vis" 
            },
            { 
                name: "UI_REPLICA", 
                desc: "Clonador: Sube una captura y obtén el código exacto.", 
                type: "vis" 
            },
            { 
                name: "UI/UX", 
                desc: "Generador de componentes (React/Shadcn/Tailwind).", 
                type: "vis" 
            },
            { 
                name: "VISION", 
                desc: "Análisis de diagramas o imágenes complejas.", 
                type: "vis" 
            },
            { 
                name: "DATA", 
                desc: "Generador de Mock Data (JSON/CSV) para pruebas.", 
                type: "vis" 
            }
        ]
    },

    // --- SECCIÓN 4: FLUJOS DE TRABAJO ---
    {
        title: "⛓️ Advanced Workflows",
        items: [
            { 
                name: "SHADOW_OBSERVER", 
                desc: "✨ RECORDER: Graba tu pantalla para automatizar tareas.", 
                type: "flow" 
            },
            { 
                name: "CHAIN_DENSITY", 
                desc: "Mejora Recursiva: V1 -> Crítica -> V2 -> Final.", 
                type: "flow" 
            },
            { 
                name: "CHAIN_STEPS", 
                desc: "Ejecución paso a paso (espera confirmación 'Next').", 
                type: "flow" 
            },
            { 
                name: "LAM_SCRIPT", 
                desc: "Generador de bots de navegación (Playwright/Selenium).", 
                type: "flow" 
            },
            { 
                name: "SWARM", 
                desc: "Diseño de topología para sistemas Multi-Agente.", 
                type: "flow" 
            },
            { 
                name: "BLUEPRINT", 
                desc: "Arquitectura detallada para un solo Agente Autónomo.", 
                type: "flow" 
            },
            { 
                name: "FLOW", 
                desc: "Generador de diagramas lógicos (Mermaid.js).", 
                type: "flow" 
            }
        ]
    },

    // --- SECCIÓN 5: EJEMPLOS ---
    {
        title: "🚀 Examples (Variables Vivas)",
        items: [
            { 
                name: "SUPER_FEATURE", 
                desc: "Demo: Selector de Stack Tecnológico y Nivel.", 
                type: "flow" 
            },
            { 
                name: "MARKETING_PRO", 
                desc: "Demo: Estrategia de contenidos con variables.", 
                type: "flow" 
            }
        ]
    }
];

// =============================================================================
// LÓGICA DE RENDERIZADO (NO CAMBIAR)
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('guide-container');
    if (!container) return; // Evitar errores si el HTML no está listo
    
    GUIDE_DATA.forEach(section => {
        // Título
        const titleEl = document.createElement('div');
        titleEl.className = 'section-title';
        titleEl.innerText = section.title;
        if (section.colorVar) titleEl.style.color = `var(${section.colorVar})`;
        container.appendChild(titleEl);

        // Grid
        const gridEl = document.createElement('div');
        gridEl.className = 'modes-grid';

        // Items
        section.items.forEach(item => {
            const modeEl = document.createElement('div');
            modeEl.className = `mode-item border-${item.type}`;
            if (item.type === 'syntax') modeEl.classList.add('syntax-trigger');
            
            const textToCopy = item.code || `>arch MODE: ${item.name} - ${item.desc}`;
            modeEl.setAttribute('data-copy', textToCopy);
            modeEl.setAttribute('data-is-code', item.type === 'syntax');

            modeEl.innerHTML = `
                <span class="mode-name">${item.name}</span>
                <span class="mode-desc">${item.desc}</span>
            `;

            modeEl.onclick = () => handleCopy(modeEl);
            gridEl.appendChild(modeEl);
        });

        container.appendChild(gridEl);
    });

    async function handleCopy(element) {
        const text = element.getAttribute('data-copy');
        const isCode = element.getAttribute('data-is-code') === 'true';

        try {
            await navigator.clipboard.writeText(text);
            const nameSpan = element.querySelector('.mode-name');
            const originalText = nameSpan.innerText;
            const originalBorder = element.style.borderColor;
            const originalBg = element.style.backgroundColor;

            element.style.borderColor = isCode ? '#e879f9' : '#00ff9d';
            element.style.backgroundColor = isCode ? '#2a1a2e' : '#112211';
            nameSpan.innerText = "COPIED!";
            nameSpan.style.color = isCode ? '#e879f9' : '#00ff9d';
            
            setTimeout(() => {
                element.style.borderColor = originalBorder;
                element.style.backgroundColor = originalBg;
                nameSpan.innerText = originalText;
                nameSpan.style.color = ""; 
            }, 1000);
        } catch (err) { console.error(err); }
    }

    const optionsBtn = document.getElementById('openOptions');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
            else window.open(chrome.runtime.getURL('src/pages/options.html'));
        });
    }
});