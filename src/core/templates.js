// src/core/templates.js
console.log(">arch: Template Manager v17 (Live Variables Engine)");

const DEFAULT_TEMPLATES = {

    // =================================================================
    // 🛠️ GRUPO 1: CORE ESSENTIALS (4)
    // =================================================================

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
}`,

    'DB_ARCHITECT': `> **[MODE: DB ARCHITECT - SUPABASE]**
> GOAL: Reverse-engineer a production-ready Database Schema from Frontend Code.
> ROLE: Senior Database Architect (PostgreSQL/Supabase Expert).
> INPUT_CONTEXT: "User will provide Frontend Code (Interfaces, Zod Schemas, Forms)."
> TARGET: Supabase (PostgreSQL 15+).
> DATABASE_ENGINE: {{VAR:Engine:PostgreSQL|MySQL|MongoDB}}
> TASK:
1. **Entity Extraction**: Analyze TypeScript interfaces/Zod schemas to define tables.
2. **Normalization**: strict 3NF. Use UUIDv4 for all Primary Keys.
3. **Auth Integration**:
   - Link data strictly to \`auth.users\` via \`user_id\` (UUID).
   - **CRITICAL**: Generate a Trigger to auto-create a row in \`public.profiles\` when a new user signs up in \`auth.users\`.
4. **Security (RLS)**: Enable RLS on ALL tables. Write generic policies (e.g., "Users can only view/edit their own data").
> OUTPUT: Single 'init.sql' file including:
   - Extensions (uuid-ossp).
   - Table Definitions (TIMESTAMPTZ for dates).
   - RLS Policies.
   - Triggers/Functions.`,

    'FIX': `> **DEBUG MODE [AUTO-FIX]**
> CONTEXT:
"{{INPUT}}"
> LOGS:
"""{{CLIPBOARD}}"""
> TASK: Analyze root cause and provide FIXED code block only.`,

    'LOGIC': `> **LOGIC MODE [XML SAFETY]**
<security_cage>
  <premise>{{INPUT}}</premise>
  <protocol>1. Detect Fallacies. 2. Edge Cases. 3. Security Check.</protocol>
</security_cage>`,

    'R1_THINK': `> **[DEEP THINKING MODE]**
> TARGET: DeepSeek-R1 / OpenAI o1
> TASK: "{{INPUT}}"
> CONSTRAINT: NO system prompts. NO role-playing.
> INSTRUCTION: Leverage native Chain-of-Thought. Think step-by-step. Return exhaustive reasoning followed by solution.`,


    // =================================================================
    // 🧠 GRUPO 2: ADVANCED WORKFLOWS (7)
    // =================================================================

    'CHAIN_DENSITY': `> **[WORKFLOW: CHAIN OF DENSITY]**
> GOAL: Recursive Content Refinement (Quality > Speed).
> INPUT: "{{INPUT}}"
> PROTOCOL: Iterative Density.
> INSTRUCTION:
1. Generate Initial Version (V1).
2. Critique V1 (Find fluff, missing logic, weak points).
3. Refine into V2 (Address critique).
4. Repeat until V3 (High-Signal / Dense output).
> CONSTRAINT: Display the evolution (V1 -> Critique -> Final V3).`,

    'CHAIN_STEPS': `> **[WORKFLOW: SEQUENTIAL OPS]**
> GOAL: Step-by-Step Execution with Human Checkpoint.
> TASK: "{{INPUT}}"
> CONTROL: STOP after each step.
> FORMAT:
[STEP X]: {Action Name}
{Content}
[WAITING]: Type "NEXT" to proceed.
> CONSTRAINT: Do NOT generate the full output. Execute ONE step and WAIT.`,

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
}`,

    'LANG_GRAPH': `> **[CODER: LANGGRAPH]**
> GOAL: Python Multi-Agent Implementation.
> INPUT_PLAN: "{{INPUT}}"
> STACK: LangGraph + LangChain.
> OUTPUT: Full 'main.py' script.
> REQUIREMENTS:
- Define 'AgentState' (TypedDict).
- Define Nodes, Edges, and Compile Graph.`,

    'LAM_SCRIPT': `> **[LAM MODE: AUTOMATION]**
> GOAL: Browser Automation Script.
> INTENT: "{{INPUT}}"
> STACK: Playwright (Python/Async).
> TASK: Translate intent into robust DOM interactions (Selectors > XPath).`,

    'BLUEPRINT': `> **[ARCHITECT: BLUEPRINT]**
> GOAL: Single Agent Config.
> INTENT: "{{INPUT}}"
> SCHEMA: { "agent_core": {...}, "execution_loop": {...} }`,

    'FLOW': `> **[VISUAL: FLOW DIAGRAM]**
> INTENT: "{{INPUT}}"
> FORMAT: Mermaid.js Syntax (Graph TD).
> GOAL: Visualize the logic flow.`,


    // =================================================================
    // 🎨 GRUPO 3: VISUAL & DATA OPS (3)
    // =================================================================

// ... otros templates ...

    'SKETCH_TO_UI': `> **[MODE: SKETCH-TO-CODE]**
> ROLE: Senior Frontend Engineer with Computer Vision.
> TASK: Analyze the attached wireframe sketch and convert it into code.
> INPUT_IMAGE: [See Clipboard Attachment]
> INTERPRETATION GUIDE:
- Box/Rectangle = Container / Div / Section.
- Lines = Text / Paragraphs.
- Circle = Image / Avatar / Logo.
- X inside Box = Image Placeholder.
- Horizontal Lines in Header = Navigation Menu.
> STACK: HTML + Tailwind CSS.
> OUTPUT: Return the single HTML file containing the layout. Use 'border-dashed' or 'bg-gray-200' for placeholders.`,
   
    'UI/UX': `> **[UI/UX GEN]**
> INPUT: "{{INPUT}}"
> STACK: React + Tailwind + Lucide + Shadcn.
> OUT: Single .tsx file. Accessibility First.`,

    'UI_REPLICA': `> **[MODE: UI REPLICA - PIXEL PERFECT]**
> GOAL: Convert the attached screenshot into executable code.
> ROLE: Senior Frontend Engineer (Pixel-Perfect Specialist).
> INPUT_CONTEXT: "User will attach a UI reference image (Stitch/Figma/Screenshot)."
> STACK: React (Next.js) + Tailwind CSS + Lucide Icons.
> VISION TASK:
1. **Grid & Layout**: Reverse-engineer the Flexbox/Grid structure. Identify alignment (justify/items).
2. **Visual Specs**: Estimate precise Tailwind classes for:
   - Colors (bg-slate-900, text-emerald-400).
   - Typography (font-weight, letter-spacing, line-height).
   - Effects (shadow-md, rounded-xl, border-opacity).
3. **Component Mapping**: Use semantic HTML (<section>, <button>) or Shadcn UI if pattern matches.
> CONSTRAINT: No placeholders. Write the FULL .tsx code. If text is blurry, use generic but realistic labels.
> OUTPUT: Single file React Component.`,

    'DATA': `> **DATA MODE**
> INTENT: "{{INPUT}}"
> OUT: JSON Mock Data { "headers": [], "rows": [] }`,

    'VISION': `> **VISION OPS**
> CONTEXT: "{{INPUT}}"
> LOGIC: IF (Detection > 0.8) THEN (Action). Pseudocode.`,


    // =================================================================
    // 🚀 GRUPO 4: AGENTES NUEVOS (2)
    // =================================================================

    'UNIVERSAL_TRUTH': `> **[MODE: FACTUAL ANALYZER]**
> GOAL: Provide a direct, truthful, and concise answer. NO fluff, NO guessing.
> QUERY: "{{INPUT}}"
> PROTOCOL (STRICT):
1. **Analyze**: Understand the core question.
2. **Knowledge Check**: Do you have 100% certainty? If not, state "I don't know".
3. **Anti-Hallucination**: Do not invent citations.
> OUTPUT FORMAT:
## 🎯 Respuesta Directa
[Core answer]
## 🧠 Explicación
[Details]
## ⚠️ Nivel de Confianza
[Alta / Baja]`,

    'AI_ORCHESTRATOR': `> **[MODE: MULTI-MODEL ARCHITECT]**
> GOAL: Break down a complex project and assign tasks to the BEST AI models.
> PROJECT: "{{INPUT}}"
> AVAILABLE_ARSENAL:
- **Claude 3.5**: Coding.
- **GPT-4o**: Strategy/Copy.
- **Midjourney**: Visuals.
- **Kling**: Video.
> OUTPUT: Execution Plan with prompts for each specific model.`
};

const TemplateManager = {
    getAll: async () => {
        return new Promise((resolve) => {
            try {
                chrome.storage.sync.get(['userTemplates'], (result) => {
                    const custom = result.userTemplates || {};
                    resolve({ ...DEFAULT_TEMPLATES, ...custom });
                });
            } catch (e) { resolve(DEFAULT_TEMPLATES); }
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

    // --- NUEVA LÓGICA DE VARIABLES VIVAS (v9.0) ---

    // 1. Detectar qué variables pide el prompt
    parseVariables: (templateStr) => {
        const regex = /{{VAR:(.*?)}}/g;
        const matches = [...templateStr.matchAll(regex)];
        
        return matches.map(m => {
            const parts = m[1].split(':'); 
            return {
                raw: m[0],                 
                key: parts[0],             
                options: parts[1] ? parts[1].split('|') : null 
            };
        });
    },

    // 2. Reemplazar las variables con lo que el usuario escribió
    compileVariables: (templateStr, valuesMap) => {
        let output = templateStr;
        for (const [key, val] of Object.entries(valuesMap)) {
            const regex = new RegExp(`{{VAR:${key}(:.*?)?}}`, 'g');
            output = output.replace(regex, val);
        }
        return output;
    },

    // 3. Compilación final
    compile: (templateStr, inputUser) => {
        if (!inputUser) return templateStr;
        const safeInput = inputUser.replace(/"/g, '\\"');
        let compiled = templateStr.replace(/{{INPUT}}/g, safeInput);
        compiled = compiled.replace(/{{CLIPBOARD}}/g, "[CLIPBOARD DATA]");
        return compiled.trim();
    }
};

window.TemplateManager = TemplateManager;