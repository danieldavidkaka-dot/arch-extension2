// src/core/cloud.js - v17.3 (Fix: Removed 'is_public' & 'description')
console.log(">arch: Cloud Module Loaded (Minimal Schema)");

const SUPABASE_URL = "https://fbnhqgcnhxpkecjhlmsu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibmhxZ2NuaHhwa2VjamhsbXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTU5NjQsImV4cCI6MjA4NTYzMTk2NH0.9JT-vyn9QB7PPX6TS0Wfn5P2a1MyhzTbGUXrq0K38BM";

window.ArchCloud = {
    
    // --- A. OBTENER SESIÓN ACTUAL ---
    getSession: function() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['arch_session'], (result) => {
                if (result.arch_session && result.arch_session.user) {
                    resolve(result.arch_session);
                } else {
                    resolve(null);
                }
            });
        });
    },

    // --- B. GUARDAR TEMPLATE (Esquema Minimalista) ---
    saveTemplate: async function(templateData) {
        try {
            console.log("☁️ Iniciando guardado seguro...");
            
            const session = await this.getSession();
            
            if (!session) {
                return { error: true, message: "⚠️ No has iniciado sesión." };
            }

            // DATOS EXACTOS (Solo lo que tu tabla acepta)
            const payload = {
                user_id: session.user.id,
                command_key: templateData.trigger,
                content: templateData.content,
                category: "GENERAL",
                // description: ELIMINADO (No existe en DB)
                // is_public: ELIMINADO (Causaba el error anterior)
                created_at: new Date().toISOString()
            };

            // URL CON "ON_CONFLICT" (Para permitir editar)
            const url = `${SUPABASE_URL}/rest/v1/user_templates?on_conflict=user_id,command_key`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${session.token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json(); 
                    console.error("Cloud Error Details:", errorData);
                    if(errorData.message) errorMessage = errorData.message;
                } catch(e) { }

                throw new Error(errorMessage);
            }

            console.log("✅ Guardado exitoso para:", session.user.email);
            return { success: true };

        } catch (error) {
            console.error(">arch cloud connection failed:", error);
            return { error: true, message: error.message };
        }
    }
};