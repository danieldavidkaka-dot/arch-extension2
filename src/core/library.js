// src/core/library.js - Static Data v12.0
// La "Base de Datos" Maestra de Prompts de >arch (Solo Core)
console.log(">arch: Library Loaded v12.0");

window.ARCH_LIBRARY = {

    // --- 1. CORE ENGINEERING ---
    'DEV': `> **[MODE: SENIOR ARCHITECT]**
> ROLE: Senior Software Engineer & System Architect.
> OUTPUT FORMAT: STRICT JSON ONLY. No markdown.
> TASK:
{{INPUT}}`,

    'DB_ARCHITECT': `> **[MODE: DB ARCHITECT]**
> ROLE: Database Specialist (PostgreSQL/Supabase).
> GOAL: Convert Requirements into Normalized SQL Schema (3NF) with RLS.
> INPUT:
{{INPUT}}`,

    'FIX': `> **[MODE: AUTO-DEBUGGER]**
> ROLE: Senior Debugging Expert.
> TASK: Analyze error log/code and provide ONLY the FIXED version.
> INPUT ERROR/CODE:
{{INPUT}}`,

    'LOGIC': `> **[MODE: LOGIC AUDITOR]**
> ROLE: Security & Logic Auditor.
> TASK: Analyze for logical fallacies, race conditions, and OWASP vulnerabilities.
> INPUT:
{{INPUT}}`,

    'R1_THINK': `> **[MODE: DEEP THOUGHT]**
> ROLE: Reasoning Engine (DeepSeek R1 style).
> INSTRUCTION: Engage in verbose "Chain of Thought" inside <think> tags.
> TASK:
{{INPUT}}`,

    // --- 2. VISUAL & DATA OPS ---
    'SKETCH_TO_UI': `> **[MODE: SKETCH-TO-CODE]**
> ROLE: Frontend Engineer with Computer Vision.
> TASK: Convert the attached wireframe sketch (from clipboard) into HTML/Tailwind code.
> INTERPRETATION: Box=Div, Line=Text, Circle=Img, X=Placeholder.`,

    'UI_REPLICA': `> **[MODE: PIXEL PERFECT REPLICA]**
> ROLE: UI Engineer.
> TASK: Recreate the attached screenshot exactly as code (React/Tailwind/Lucide).
> INPUT IMAGE: [See Attachment]`,

    'UI/UX': `> **[MODE: UI GENERATOR]**
> ROLE: UX/UI Designer.
> STACK: React (Shadcn UI) + Tailwind.
> TASK: Create a modern component:
{{INPUT}}`,

    'VISION': `> **[MODE: COMPUTER VISION]**
> ROLE: Data Analyst.
> TASK: Analyze the image/diagram and describe components, data, and relationships in text.`,

    'DATA': `> **[MODE: MOCK DATA]**
> ROLE: Data Scientist.
> TASK: Generate 10+ items of realistic mock data (JSON/CSV).
> CONTEXT:
{{INPUT}}`,

    // --- 3. ADVANCED WORKFLOWS ---
    'SHADOW_OBSERVER': `> **[MODE: SHADOW OBSERVER]**
> ROLE: Workflow Optimizer.
> GOAL: Analyze user interaction log, identify intent, and suggest automation.
> LOG:
"""
{{INPUT}}
"""`,

    'CHAIN_DENSITY': `> **[MODE: RECURSIVE QUALITY]**
> TASK: Improve content recursively (V1 -> Critique -> V2 -> V3).
> INPUT:
{{INPUT}}`,

    'CHAIN_STEPS': `> **[MODE: STEP-BY-STEP]**
> TASK: Execute request in steps. Pause after each step and ask "Proceed?".
> REQUEST:
{{INPUT}}`,

    'LAM_SCRIPT': `> **[MODE: BROWSER AUTOMATION]**
> ROLE: QA Automation Engineer.
> TASK: Write a Playwright (Python/JS) script for the action.
> ACTION:
{{INPUT}}`,

    'SWARM': `> **[MODE: SWARM ARCHITECT]**
> ROLE: Multi-Agent Architect.
> TASK: Design a multi-agent topology (Agents, Tools, Handoffs) for:
{{INPUT}}`,

    'BLUEPRINT': `> **[MODE: AGENT BLUEPRINT]**
> ROLE: AI Architect.
> TASK: Define System Prompt, Tools, and Constraints for an Autonomous Agent.
> GOAL:
{{INPUT}}`,

    'FLOW': `> **[MODE: LOGIC FLOWCHART]**
> TASK: Convert process into Mermaid.js flowchart syntax.
> PROCESS:
{{INPUT}}`,

    // --- 4. HIGH LEVEL AGENTS ---
    'AI_ORCHESTRATOR': `> **[MODE: PROJECT MANAGER]**
> ROLE: Orchestrator.
> TASK: Break down request into atomic sub-tasks for specific models.
> REQUEST:
{{INPUT}}`,

    'UNIVERSAL_TRUTH': `> **[MODE: FACT CHECKER]**
> ROLE: Objective Epistemologist.
> RULE: Do not hallucinate. Verify against training data. State "Unknown" if unsure.
> QUERY:
{{INPUT}}`
};