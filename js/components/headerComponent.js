function htmlHeaderComponent(){
    let header = `
        <div class="flex items-center justify-between px-4 pt-3">
            <span class="w-24"></span>
            <h1 class="font-mono text-white text-2xl text-center flex-1">DataLeake</h1>
            <div id="auth-area" class="w-24 flex justify-end"></div>
        </div>
        <hr class="mb-2 mt-1 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 w-full" />
        <div class="flex justify-center px-4 pb-3">
            <div class="relative w-full max-w-2xl">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" style="width:16px;height:16px;"></i>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar libro o autor..."
                    class="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-950 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-400 focus:ring-0 transition"
                />
            </div>
        </div>
        `;
    return header;
}

// Renders the right-hand auth area according to CURRENT_ROLE:
// guest -> "Iniciar sesión"; user/admin -> role badge + actions + "Salir".
function renderAuthArea() {
    const root = document.getElementById("auth-area");
    if (!root) return;

    if (CURRENT_ROLE === "guest") {
        root.innerHTML = `
            <button onclick="openAuthModal('login')"
                    class="px-3 py-1.5 rounded-xl text-white bg-blue-700 hover:bg-blue-800 transition duration-75 cursor-pointer font-mono text-xs whitespace-nowrap">
                Iniciar sesión
            </button>`;
        lucide.createIcons();
        return;
    }

    const isAdmin = CURRENT_ROLE === "admin";
    const badge = isAdmin
        ? `<span class="font-mono text-xs px-2 py-0.5 rounded-lg bg-purple-700 text-white">Admin</span>`
        : `<span class="font-mono text-xs px-2 py-0.5 rounded-lg bg-gray-700 text-white">Usuario</span>`;

    const actionBtn = isAdmin
        ? `<button onclick="openAdminUploadModal()" title="Subir libro"
                   class="text-gray-300 hover:text-white cursor-pointer">
               <i data-lucide="upload" style="width:16px;height:16px;"></i>
           </button>`
        : `<button onclick="openRequestModal()" title="Solicitar libro"
                   class="text-gray-300 hover:text-white cursor-pointer">
               <i data-lucide="message-square-plus" style="width:16px;height:16px;"></i>
           </button>`;

    root.innerHTML = `
        <div class="flex items-center gap-2">
            ${badge}
            ${actionBtn}
            <button onclick="signOutUser()" title="Cerrar sesión" class="text-gray-300 hover:text-white cursor-pointer">
                <i data-lucide="log-out" style="width:16px;height:16px;"></i>
            </button>
        </div>`;
    lucide.createIcons();
}
