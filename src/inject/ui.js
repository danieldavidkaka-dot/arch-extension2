// src/inject/ui.js - UI Module v8.0 (Synced Styles)
console.log(">arch: UI Module Loaded");

window.ArchUI = {
    create: function(modes, onSelect) {
        // 1. Limpieza preventiva (borrar si ya existe para no duplicar)
        const existingOverlay = document.querySelector('.arch-modal-overlay');
        const existingTrigger = document.querySelector('.arch-trigger');
        if (existingOverlay) existingOverlay.remove();
        if (existingTrigger) existingTrigger.remove();

        // 2. Crear el BOTÓN FLOTANTE (Trigger)
        const trigger = document.createElement('div');
        trigger.className = 'arch-trigger';
        trigger.textContent = '>_';
        trigger.title = 'Open >arch Studio';
        document.body.appendChild(trigger);

        // 3. Crear la VENTANA MODAL (Oculta al inicio)
        const overlay = document.createElement('div');
        overlay.className = 'arch-modal-overlay';
        overlay.style.display = 'none'; // CRUCIAL: Empieza invisible
        
        // Cerrar al hacer clic fuera
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        };

        const modal = document.createElement('div');
        modal.className = 'arch-modal';

        // 3.1 Cabecera del Modal
        const header = document.createElement('div');
        header.className = 'arch-modal-header';
        
        const title = document.createElement('span');
        title.className = 'arch-title';
        title.textContent = '>arch_console // v8.0';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'arch-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => overlay.style.display = 'none';

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 3.2 Rejilla de Botones (Grid)
        const grid = document.createElement('div');
        grid.className = 'arch-grid';

        modes.forEach(modeKey => {
            const btn = document.createElement('div');
            btn.className = 'arch-btn';
            btn.textContent = modeKey;
            
            btn.onclick = () => {
                onSelect(modeKey);
                overlay.style.display = 'none'; // Cerrar al seleccionar
            };
            
            grid.appendChild(btn);
        });

        // Ensamblaje final
        modal.appendChild(header);
        modal.appendChild(grid);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 4. EVENTO: Abrir modal al hacer clic en el botón flotante
        trigger.onclick = () => {
            overlay.style.display = 'flex'; // Mostrar centrado
        };
    }
};