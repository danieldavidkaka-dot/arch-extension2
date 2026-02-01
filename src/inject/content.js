// src/inject/content.js - VERSION "VIVAS" V13
console.log(">arch: System Initializing...");

function getActiveTextarea() {
    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return active;
    }
    const selectors = [
        '#prompt-textarea',
        'div[contenteditable="true"]',
        'textarea[data-testid="chat-input"]',
        'textarea[aria-label*="Prompts"]',
        'textarea'
    ];
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
    }
    return null;
}

function safeInsert(element, text) {
    if (!element) return false;
    element.focus();
    document.execCommand('selectAll', false, null);
    const success = document.execCommand('insertText', false, text);

    if (!success) {
        const proto = element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLElement.prototype;
        const setNative = Object.getOwnPropertyDescriptor(proto, 'value')?.set || Object.getOwnPropertyDescriptor(proto, 'textContent')?.set;
        if (setNative) {
            setNative.call(element, text);
            element.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            element.value = text;
            element.textContent = text;
        }
    }
    return true;
}

function launchArch() {
    if (!window.TemplateManager || !window.ArchUI) {
        setTimeout(launchArch, 500);
        return;
    }

    if (document.querySelector('.arch-trigger')) return;

    window.TemplateManager.getAll().then(templates => {
        window.ArchUI.create(templates, (finalText) => {
            const target = getActiveTextarea();
            if (!target) {
                alert(">arch Error: Click on the chat box first.");
                return;
            }

            let currentVal = target.value || target.textContent || "";
            const fullyCompiled = window.TemplateManager.compile(finalText, currentVal);
            safeInsert(target, fullyCompiled);
        });
        
        console.log(">arch: UI V9.0 (Live Vars) Ready 🟢");
    });
}

const watcher = new MutationObserver(() => {
    if (!document.querySelector('.arch-trigger')) launchArch();
});
watcher.observe(document.body, { childList: true, subtree: true });
setTimeout(launchArch, 1000);