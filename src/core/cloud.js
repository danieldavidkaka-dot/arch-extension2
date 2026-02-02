// src/core/cloud.js
// Cliente HTTP para Supabase - Conexión establecida
console.log(">arch: Cloud Module Loaded");

// TUS CREDENCIALES REALES
const SUPABASE_URL = "https://fbnhqgcnhxpkecjhlmsu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibmhxZ2NuaHhwa2VjamhsbXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTU5NjQsImV4cCI6MjA4NTYzMTk2NH0.9JT-vyn9QB7PPX6TS0Wfn5P2a1MyhzTbGUXrq0K38BM";

window.ArchCloud = {
    // Headers de autenticación
    _headers: (token = null) => {
        return {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${token || SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation" // Importante: para que nos devuelva el dato insertado
        };
    },

    /**
     * Guarda o Actualiza un template en la nube
     */
    upsertTemplate: async function(template, userId) {
        // Endpoint REST de Supabase
        const url = `${SUPABASE_URL}/rest/v1/user_templates`;
        
        const body = {
            user_id: userId,
            command_key: template.command_key,
            content: template.content,
            category: "GENERAL",
            updated_at: new Date().toISOString()
        };

        try {
            // POST con on_conflict actúa como UPSERT en Supabase
            const res = await fetch(url + "?on_conflict=user_id,command_key", {
                method: "POST",
                headers: this._headers(),
                body: JSON.stringify(body)
            });
            
            if (!res.ok) {
                const err = await res.json();
                console.error(">arch cloud error details:", err);
                throw err;
            }

            console.log(">arch cloud: Saved successfully", body.command_key);
            return await res.json();
        } catch (e) {
            console.error(">arch cloud connection failed:", e);
            throw e; // Lanzar error para que la UI sepa que falló
        }
    }
};