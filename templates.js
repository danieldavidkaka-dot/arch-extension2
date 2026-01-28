console.log(">>> ESTOY CARGANDO LA VERSIÓN CORREGIDA V10 <<<");
// templates.js
console.log(">arch: Template Manager v8.5 (Sanitized Layouts)");

const DEFAULT_TEMPLATES = {
    // --- 1. CORE ESSENTIALS ---
    'DEV': `> **DEV MODE [JSON STRICT]**
> TARGET_MODEL: GPT-4o / Claude 3.5
> ROLE: Senior Software Architect.
> INPUT_CONTEXT:
"{{INPUT}}"
> CONSTRAINT: Output ONLY valid JSON. NO prose.
> SCHEMA_REQUIRED:
{
  "stack": "...",
  "structure": { "root": [], "src": [] }
}
`, // <--- Nota el salto de línea aquí

    'FIX': `> **DEBUG MODE [AUTO-FIX]**
> CONTEXT:
"{{INPUT}}"
> LOGS:
"""{{CLIPBOARD}}"""
> TASK: Analyze root cause and provide FIXED code block only.
`,

    'LOGIC': `> **LOGIC MODE [XML SAFETY]**
<security_cage>
  <premise>{{INPUT}}</premise>
  <protocol>1. Detect Fallacies. 2. Edge Cases. 3. Security Check.</protocol>
</security_cage>
`,

    // --- 2. DEEP THINKING ---
    'R1_THINK': `> **[DEEP THINKING MODE]**
> TARGET: DeepSeek-R1 / OpenAI o1
> TASK: "{{INPUT}}"
> CONSTRAINT: NO system prompts. NO role-playing.
> INSTRUCTION: Leverage native Chain-of-Thought. Think step-by-step. Return exhaustive reasoning followed by the final solution.
`,

    // --- 3. AGENTIC ARCHITECTURE ---
    'CHAIN_DENSITY': `> **[WORKFLOW: CHAIN OF DENSITY]**
> GOAL: Recursive Content Refinement (Quality > Speed).
> INPUT: "{{INPUT}}"
> PROTOCOL: Iterative Density.
> INSTRUCTION:
1. Generate Initial Version (V1).
2. Critique V1 (Find fluff, missing logic, weak points).
3. Refine into V2 (Address critique).
4. Repeat until V3 (High-Signal / Dense output).
> CONSTRAINT: Display the evolution (V1 -> Critique -> Final V3).
`,

    'CHAIN_STEPS': `> **[WORKFLOW: SEQUENTIAL OPS]**
> GOAL: Step-by-Step Execution with Human Checkpoint.
> TASK: "{{INPUT}}"
> CONTROL: STOP after each step.
> FORMAT:
[STEP X]: {Action Name}
{Content}
[WAITING]: Type "NEXT" to proceed.
> CONSTRAINT: Do NOT generate the full output. Execute ONE step and WAIT.
`,

    'SWARM': `> **[ARCHITECT: SWARM STRATEGY]**
> GOAL: Multi-Agent Data Flow Design.
> INTENT: "{{INPUT}}"
> CONSTRAINT: Output ONLY valid JSON.
> REQUIRED_SCHEMA:
{
  "swarm_topology": "Sequential | Hierarchical | Mesh",
  "data_flow_summary": "High-level description",
  "agents": [
    { "id": "Agent_ID", "role": "...", "input": "...", "output": "..." }
  ]
}
`,

    'LANG_GRAPH': `> **[CODER: LANGGRAPH]**
> GOAL: Python Multi-Agent Implementation.
> INPUT_PLAN: "{{INPUT}}"
> STACK: LangGraph + LangChain.
> OUTPUT: Full 'main.py' script.
> REQUIREMENTS:
- Define 'AgentState' (TypedDict).
- Define Nodes, Edges, and Compile Graph.
`,

    'LAM_SCRIPT': `> **[LAM MODE: AUTOMATION]**
> GOAL: Browser Automation Script.
> INTENT: "{{INPUT}}"
> STACK: Playwright (Python/Async).
> TASK: Translate intent into robust DOM interactions (Selectors > XPath).
`,

    'BLUEPRINT': `> **[ARCHITECT: BLUEPRINT]**
> GOAL: Single Agent Config.
> INTENT: "{{INPUT}}"
> SCHEMA: { "agent_core": {...}, "execution_loop": {...} }
`,

    'FLOW': `> **[VISUAL: FLOW DIAGRAM]**
> INTENT: "{{INPUT}}"
> FORMAT: Mermaid.js Syntax (Graph TD).
> GOAL: Visualize the logic flow.
`,

    // --- 4. VISUAL / UX ---
    // CORREGIDO EL BUG DE CONCATENACIÓN AQUÍ
    'UI/UX': `> **[UI/UX GEN]**
> INPUT: "{{INPUT}}"
> STACK: React + Tailwind + Lucide + Shadcn.
> OUT: Single .tsx file. Accessibility First.
`,

    'DATA': `> **DATA MODE**
> INTENT: "{{INPUT}}"
> OUT: JSON Mock Data { "headers": [], "rows": [] }
`,

    'VISION': `> **VISION OPS**
> CONTEXT: "{{INPUT}}"
> LOGIC: IF (Detection > 0.8) THEN (Action). Pseudocode.
`
};

const TemplateManager = {
    getAll: async () => {
        return new Promise((resolve) => {
            try {
                if (!chrome || !chrome.storage || !chrome.storage.sync) {
                    resolve(DEFAULT_TEMPLATES);
                    return;
                }
                chrome.storage.sync.get(['userTemplates'], (result) => {
                    if (chrome.runtime.lastError) {
                        resolve(DEFAULT_TEMPLATES);
                    } else {
                        // Mezclar defaults con guardados para asegurar que los nuevos formatos aparezcan
                        // incluso si el usuario ya tenía una configuración guardada.
                        const saved = result.userTemplates || {};
                        resolve({ ...DEFAULT_TEMPLATES, ...saved });
                    }
                });
            } catch (e) {
                resolve(DEFAULT_TEMPLATES);
            }
        });
    },

    save: async (name, content) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get(['userTemplates'], (result) => {
                    const current = result.userTemplates || {};
                    current[name] = content;
                    chrome.storage.sync.set({ userTemplates: current }, resolve);
                });
            } catch (e) { reject(e); }
        });
    },

    delete: async (name) => {
        return new Promise((resolve, reject) => {
             try {
                chrome.storage.sync.get(['userTemplates'], (result) => {
                    const current = result.userTemplates || {};
                    delete current[name];
                    chrome.storage.sync.set({ userTemplates: current }, resolve);
                });
             } catch (e) { reject(e); }
        });
    },

    reset: async () => {
        return new Promise((resolve) => {
            try { chrome.storage.sync.clear(resolve); } catch(e) { resolve(); }
        });
    },

    compile: (templateStr, inputUser) => {
        if (!inputUser) return templateStr;
        
        // 1. Sanitizar comillas para evitar romper el JSON/String
        const safeInput = inputUser.replace(/"/g, '\\"');
        
        // 2. Reemplazar {{INPUT}}
        let compiled = templateStr.replace(/{{INPUT}}/g, safeInput);
        
        // 3. Reemplazo del portapapeles (Simulado)
        compiled = compiled.replace(/{{CLIPBOARD}}/g, "[CLIPBOARD DATA]");

        // 4. LIMPIEZA FINAL (Trim) y asegurar que termine limpio
        return compiled.trim();
    }
};

window.TemplateManager = TemplateManager;