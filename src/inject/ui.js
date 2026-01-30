// src/ui.js
console.log(">arch: UI Module v7.2 (The Twin Chains)");

const ArchUI = {
    btn: null,
    menu: null,
    isDragging: false, // Bandera: ¿Estamos arrastrando?
    hasMoved: false,   // Bandera: ¿Se movió el mouse lo suficiente para contar como arrastre?

    create: (modes, onSelect) => {
        // 1. Limpieza inicial (por si el script se recarga)
        if (ArchUI.menu) {
            ArchUI.menu.innerHTML = '';
        } else {
            // --- CREACIÓN DE ELEMENTOS DOM ---
            ArchUI.btn = document.createElement('div');
            ArchUI.btn.textContent = '>arch';
            ArchUI.btn.className = 'arch-trigger'; // Estilo "Ghost" definido en CSS
            
            ArchUI.menu = document.createElement('div');
            ArchUI.menu.className = 'arch-menu';   // Estilo "Glass Grid" definido en CSS
            
            document.body.appendChild(ArchUI.btn);
            document.body.appendChild(ArchUI.menu);

            // --- LÓGICA DE ARRASTRE (DRAG & DROP) ---
            let startX, startY, initialLeft, initialTop;

            const onMouseDown = (e) => {
                ArchUI.isDragging = true;
                ArchUI.hasMoved = false; // Reseteamos al empezar
                
                // Guardar posición inicial del mouse y del botón
                startX = e.clientX;
                startY = e.clientY;
                const rect = ArchUI.btn.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                // Listeners globales para seguir el mouse fluidamente
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                if (!ArchUI.isDragging) return;

                // Calcular desplazamiento
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // Si se mueve más de 2px, es un arrastre real, no un clic tembloroso
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                    ArchUI.hasMoved = true;
                    ArchUI.hideMenu(); // Ocultar menú si empezamos a moverlo
                }

                // Mover el botón
                ArchUI.btn.style.left = `${initialLeft + dx}px`;
                ArchUI.btn.style.top = `${initialTop + dy}px`;
            };

            const onMouseUp = () => {
                ArchUI.isDragging = false;
                // Limpiar memoria
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            // Activar Drag
            ArchUI.btn.addEventListener('mousedown', onMouseDown);

            // --- LÓGICA DE CLIC (TOGGLE) ---
            ArchUI.btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // TRUCO UX: Si el usuario arrastró el botón, NO abrimos el menú.
                // Solo lo abrimos si fue un clic quieto.
                if (ArchUI.hasMoved) return;

                const currentDisplay = window.getComputedStyle(ArchUI.menu).display;
                currentDisplay === 'none' ? ArchUI.showMenu() : ArchUI.hideMenu();
            });
        }

        // --- 2. GENERACIÓN DEL GRID DE MODOS (Actualizado v7.2) ---
        modes.forEach(mode => {
            const item = document.createElement('div');
            item.className = 'arch-item';
            item.textContent = mode;
            
            // === LÓGICA DE COLORES INTELIGENTE ===
            let type = 'CUSTOM';
            
            // CORE (Verde): Fundamentos y Razonamiento Puro
            if (['DEV', 'LOGIC', 'DATA', 'R1_THINK'].includes(mode)) type = 'CORE';
            
            // FIX (Rojo): Debugging y Emergencias
            if (mode === 'FIX') type = 'FIX';
            
            // UX (Violeta): Frontend, Diseño y Visión
            if (['UI/UX', 'VISION'].includes(mode)) type = 'UX';
            
            // ARCHITECT (Naranja): Agentes, Grafos, Flujos y Automatización
            // AQUI ESTÁN LOS NUEVOS 'CHAIN'
            if (['LANG_GRAPH', 'LAM_SCRIPT', 'BLUEPRINT', 'SWARM', 'FLOW', 'CHAIN_DENSITY', 'CHAIN_STEPS'].includes(mode)) type = 'ARCH';
            
            item.setAttribute('data-type', type); // El CSS leerá esto y pondrá el borde de color

            // Acción al hacer clic en un modo
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                onSelect(mode);    // Inyectar el prompt
                ArchUI.hideMenu(); // Cerrar menú
            });
            
            ArchUI.menu.appendChild(item);
        });
    },

    // --- 3. MOSTRAR MENÚ (Posicionamiento Inteligente) ---
    showMenu: () => {
        if (!ArchUI.btn || !ArchUI.menu) return;
        
        const btnRect = ArchUI.btn.getBoundingClientRect();
        
        // Mostrar menú
        ArchUI.menu.style.display = 'grid';
        
        // Posición vertical: Justo debajo del botón
        ArchUI.menu.style.top = (btnRect.bottom + 8) + 'px';
        
        // Posición horizontal:
        // Si el botón está muy a la derecha, el menú se abre hacia la izquierda para no salirse de la pantalla
        const menuWidth = 260; // Ancho definido en CSS
        if (btnRect.right + menuWidth > window.innerWidth) {
             ArchUI.menu.style.left = (btnRect.right - menuWidth) + 'px';
        } else {
             ArchUI.menu.style.left = btnRect.left + 'px';
        }
    },

    // --- 4. OCULTAR MENÚ ---
    hideMenu: () => {
        if (ArchUI.menu) ArchUI.menu.style.display = 'none';
    }
};
window.ArchUI = ArchUI;