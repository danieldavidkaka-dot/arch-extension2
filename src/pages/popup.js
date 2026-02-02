// src/pages/popup.js - v16.7 (Fix: Duplicate Variables Removed)
console.log(">arch: Popup Logic Loaded");

// --- 1. CREDENCIALES SUPABASE ---
// COMENTADAS: Ya las carga cloud.js, así evitamos el error "Identifier has already been declared"
// const SUPABASE_URL = "https://fbnhqgcnhxpkecjhlmsu.supabase.co";
// const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibmhxZ2NuaHhwa2VjamhsbXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTU5NjQsImV4cCI6MjA4NTYzMTk2NH0.9JT-vyn9QB7PPX6TS0Wfn5P2a1MyhzTbGUXrq0K38BM";

// --- 2. REFERENCIAS DEL DOM ---
// Vistas
const viewLogin = document.getElementById('view-login');
const viewApp = document.getElementById('view-app');

// Formulario Login
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const statusMsg = document.getElementById('login-status');

// Panel App (Usuario)
const displayEmail = document.getElementById('display-email');
const btnLogout = document.getElementById('btn-logout');

// Botones de Acción (Legacy)
const btnConsole = document.getElementById('open-console');
const btnSettings = document.getElementById('open-settings');


// --- 3. INICIO: COMPROBAR SESIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Verificamos si hay un usuario guardado en el navegador
    chrome.storage.local.get(['arch_session'], (result) => {
        if (result.arch_session && result.arch_session.user) {
            // Si existe, mostramos directo el Panel Principal
            showApp(result.arch_session.user);
        } else {
            // Si no, mostramos el Login
            showLogin();
        }
    });
});


// --- 4. TU LÓGICA ORIGINAL (Anti-Zombie) ---
if (btnConsole) {
    btnConsole.addEventListener('click', () => {
        // Buscar la pestaña activa
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            const activeTab = tabs[0];

            // Intentar conectar con la pestaña
            chrome.tabs.sendMessage(activeTab.id, { action: "toggle_console" }, (response) => { 
                
                // VERIFICAR ERRORES DE CONEXIÓN (Tu lógica exacta)
                if (chrome.runtime.lastError) {
                    console.warn(">arch: Connection failed:", chrome.runtime.lastError.message);
                    
                    // AVISO EN ESPAÑOL (Tu código)
                    btnConsole.textContent = "⚠️ RECARGA LA PÁGINA (F5)";
                    btnConsole.style.background = "#f59e0b"; // Naranja
                    btnConsole.style.color = "#000";
                    btnConsole.style.borderColor = "#fbbf24";
                    
                } else {
                    // Si conecta bien, cerrar popup
                    window.close();
                }
            });
        });
    });
}

// Botón Configuración (Tu lógica exacta)
if (btnSettings) {
    btnSettings.addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('src/pages/options.html'));
        }
    });
}


// --- 5. LÓGICA DE AUTENTICACIÓN (NUEVO) ---

// Función de Login / Registro
btnLogin.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (!email || !password) return showStatus("Por favor completa los campos.");
    if (password.length < 6) return showStatus("La contraseña debe tener 6 caracteres o más.");

    showStatus("Conectando...", "success");
    btnLogin.disabled = true;
    btnLogin.style.opacity = "0.7";

    try {
        // A) Intentar LOGIN
        const loginData = await supabaseAuthRequest('token?grant_type=password', {
            email: email,
            password: password
        });

        if (!loginData.error) {
            saveSession(loginData); // Éxito Login
        } else {
            // B) Si falla, intentar REGISTRO (Auto-Register)
            console.log("Login falló, intentando registro...", loginData);
            
            const signupData = await supabaseAuthRequest('signup', {
                email: email,
                password: password
            });

            if (!signupData.error) {
                if (signupData.user && signupData.access_token) {
                    saveSession(signupData); // Éxito Registro + Login directo
                } else {
                    showStatus("Cuenta creada. ¡Intenta entrar ahora!", "success");
                    btnLogin.disabled = false;
                    btnLogin.style.opacity = "1";
                }
            } else {
                throw new Error("Error: Verifica tus datos o intenta otra contraseña.");
            }
        }

    } catch (err) {
        console.error(err);
        showStatus(err.message || "Error de conexión");
        btnLogin.disabled = false;
        btnLogin.style.opacity = "1";
    }
});

// Función Cerrar Sesión
btnLogout.addEventListener('click', () => {
    chrome.storage.local.remove('arch_session', () => {
        showLogin();
        // Limpiar campos
        emailInput.value = '';
        passInput.value = '';
        btnLogin.disabled = false;
        btnLogin.style.opacity = "1";
        showStatus("");
    });
});


// --- 6. FUNCIONES AUXILIARES (HELPERS) ---

function showLogin() {
    viewLogin.classList.remove('hidden');
    viewApp.classList.add('hidden');
}

function showApp(user) {
    viewLogin.classList.add('hidden');
    viewApp.classList.remove('hidden');
    displayEmail.textContent = user.email;
}

function showStatus(msg, type = 'error') {
    statusMsg.textContent = msg;
    statusMsg.className = type === 'success' ? 'status-msg success' : 'status-msg error';
}

function saveSession(data) {
    const session = {
        token: data.access_token,
        user: {
            id: data.user.id,
            email: data.user.email
        }
    };

    chrome.storage.local.set({ arch_session: session }, () => {
        showStatus("¡Bienvenido!", "success");
        setTimeout(() => showApp(session.user), 500);
    });
}

// Cliente HTTP simple para Supabase (Sin librerías externas)
async function supabaseAuthRequest(endpoint, body) {
    const url = `${SUPABASE_URL}/auth/v1/${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { error: true, ...data };
        }
        return data;
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor.");
    }
}