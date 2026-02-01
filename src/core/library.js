// src/core/library.js - Static Data v12.0
// La "Base de Datos" de Prompts de >arch
console.log(">arch: Library Loaded v12.0");

window.ARCH_LIBRARY = {

    // =========================================================================
    // 1. CORE ENGINEERING (Ingeniería Pura)
    // =========================================================================
    'DEV': `> **[MODE: SENIOR ARCHITECT]**
> ROLE: Senior Software Engineer & System Architect.
> OUTPUT FORMAT: STRICT JSON ONLY. No markdown, no conversational filler.
> SCHEMA:
{
  "explanation": "Brief technical logic summary",
  "files": [
    { "path": "path/to/file.ext", "content": "CODE_HERE" }
  ],
  "commands": ["npm install ..."]
}
> TASK:
{{INPUT}}`,

    'DB_ARCHITECT': `> **[MODE: DB ARCHITECT]**
> ROLE: Database Specialist (PostgreSQL/Supabase).
> GOAL: Convert the Input Requirements into a Normalized SQL Schema (3NF).
> RULES:
1. Use Row Level Security (RLS) policies.
2. Define foreign keys and indexes.
3. Output valid SQL for Supabase Editor.
> INPUT:
{{INPUT}}`,

    'FIX': `> **[MODE: AUTO-DEBUGGER]**
> ROLE: Senior Debugging Expert.
> TASK: Analyze the error log or broken code below and provide the FIXED version.
> OUTPUT: Return ONLY the corrected code block.
> INPUT ERROR/CODE:
{{INPUT}}`,

    'LOGIC': `> **[MODE: LOGIC AUDITOR]**
> ROLE: Security & Logic Auditor.
> TASK: Analyze the input for logical fallacies, edge cases, race conditions, or security vulnerabilities (OWASP Top 10).
> OUTPUT: Bullet points of vulnerabilities found and suggested fixes.
> INPUT:
{{INPUT}}`,

    'R1_THINK': `> **[MODE: DEEP THOUGHT]**
> ROLE: Reasoning Engine (imitating DeepSeek R1).
> INSTRUCTION: Before answering, engage in a verbose "Chain of Thought" process inside <think> tags to explore the problem depth.
> TASK:
{{INPUT}}`,

    // =========================================================================
    // 2. VISUAL & DATA OPS (Frontend y Visión)
    // =========================================================================
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

    'UI_REPLICA': `> **[MODE: PIXEL PERFECT REPLICA]**
> ROLE: UI Engineer.
> TASK: Recreate the attached UI screenshot exactly as code.
> STACK: React + Tailwind CSS + Lucide Icons.
> ATTENTION: Pay close attention to spacing (margin/padding), font weights, and border radius.
> INPUT IMAGE: [See Attachment]`,

    'UI/UX': `> **[MODE: UI GENERATOR]**
> ROLE: UX/UI Designer & Developer.
> STACK: React (Shadcn UI compatible) + Tailwind CSS.
> TASK: Create a modern, accessible component based on this request:
{{INPUT}}`,

    'DATA': `> **[MODE: MOCK DATA GENERATOR]**
> ROLE: Data Scientist.
> TASK: Generate realistic mock data for testing.
> FORMAT: JSON Array (or CSV if requested).
> QUANTITY: 10 items minimum.
> CONTEXT:
{{INPUT}}`,

    // =========================================================================
    // 3. ADVANCED WORKFLOWS (Flujos Complejos)
    // =========================================================================
    'SHADOW_OBSERVER': `> **[MODE: SHADOW OBSERVER]**
> ROLE: UX/UI Analyst & Workflow Optimizer.
> GOAL: Analyze the user's interaction log to understand their intent or replicate the flow.
> INPUT_LOG:
"""
{{INPUT}}
"""
> TASK:
1. Reconstruct the user's journey from the log.
2. Identify the goal (e.g., "User is trying to find the API Key").
3. Suggest an automation script (Playwright) or a UI improvement based on the friction points.`,

    'CHAIN_DENSITY': `> **[MODE: RECURSIVE QUALITY]**
> TASK: Improve the following content recursively 3 times.
> PROCESS:
1. Generate V1 (Base).
2. Critique V1 (Identify weaknesses).
3. Generate V2 (Address critiques).
4. Generate V3 (Final Polish).
> INPUT:
{{INPUT}}`,

    'LAM_SCRIPT': `> **[MODE: BROWSER AUTOMATION]**
> ROLE: QA Automation Engineer.
> TASK: Write a robust Playwright (Python/JS) script to automate the described action.
> REQUIREMENTS: Handle timeouts, use robust selectors (test-id), and include error handling.
> ACTION:
{{INPUT}}`,

    'SWARM': `> **[MODE: SWARM ARCHITECT]**
> ROLE: Multi-Agent System Architect.
> TASK: Design a multi-agent topology to solve the problem.
> OUTPUT: JSON defining Agents, Tools, and Handoff logic.
> PROBLEM:
{{INPUT}}`,

    'BLUEPRINT': `> **[MODE: AGENT BLUEPRINT]**
> ROLE: AI Systems Architect.
> TASK: Define the System Prompt, Tools, and Constraints for a specialized Autonomous Agent.
> AGENT GOAL:
{{INPUT}}`,

    // =========================================================================
    // 4. AUTONOMOUS AGENTS (Roles de Alto Nivel)
    // =========================================================================
    'AI_ORCHESTRATOR': `> **[MODE: PROJECT MANAGER]**
> ROLE: AI Orchestrator.
> TASK: Break down the user's request into atomic tasks assignable to specific sub-models (e.g., "Task 1 for Coding AI", "Task 2 for Vision AI").
> REQUEST:
{{INPUT}}`,

    'UNIVERSAL_TRUTH': `> **[MODE: FACT CHECKER]**
> ROLE: Objective Epistemologist.
> RULE: Do not hallucinate. If you don't know, state "Data Unavailable". Verify all claims against your training data cutoff.
> QUERY:
{{INPUT}}`,

    // =========================================================================
    // 5. EXAMPLES (Ejemplos de Variables Vivas)
    // =========================================================================
    'SUPER_FEATURE': `> **[MODE: GENIUS ARCHITECT]**
> TARGET_STACK: {{VAR:Stack:React+Next.js|Python+FastAPI|Node+Express|Flutter|Rust}}
> QUALITY_LEVEL: {{VAR:Nivel:MVP (Rápido)|Production (Robusto)|Enterprise (Escalable)}}
> TESTING_STRATEGY: {{VAR:Tests:Ninguno|Unitarios (Jest/Pytest)|E2E (Playwright)}}

> MAIN_OBJECTIVE: {{VAR:Objetivo}}
> CONTEXT: "{{INPUT}}"

> INSTRUCTIONS:
1. Act as a World-Class Expert in {{VAR:Stack}}.
2. Generate the code for the objective: "{{VAR:Objetivo}}".
3. Strict Constraint: Code must be optimized for {{VAR:Nivel}} quality.
4. Include {{VAR:Tests}} as requested.`,

    'MARKETING_PRO': `> **[MODE: MARKETING GURU]**
Actúa como un experto en Marketing Digital especializado en {{VAR:Plataforma:Instagram|LinkedIn|TikTok}}.
Mi producto es: {{VAR:Producto}}
Mi público objetivo son: {{VAR:Publico:Adolescentes|Profesionales|Empresas B2B}}

Tarea: Crea una estrategia de contenido de 3 posts para vender mi producto.
Contexto adicional: {{INPUT}}`

};