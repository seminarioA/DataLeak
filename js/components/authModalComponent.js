// Login / signup modal — single component, toggles between the two modes.

function htmlAuthModalComponent() {
    return `
    <div id="auth-modal-backdrop" style="display:none;" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onclick="if(event.target===this) closeAuthModal()">
        <div class="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 id="auth-modal-title" class="font-mono text-white text-lg font-bold">Iniciar sesión</h2>
                <button onclick="closeAuthModal()" class="text-gray-500 hover:text-white cursor-pointer">
                    <i data-lucide="x" style="width:18px;height:18px;"></i>
                </button>
            </div>

            <p id="auth-modal-error" style="display:none;" class="font-mono text-xs text-red-400 mb-3"></p>
            <p id="auth-modal-info" style="display:none;" class="font-mono text-xs text-green-400 mb-3"></p>

            <form id="auth-modal-form" class="flex flex-col gap-3">
                <div id="auth-fullname-field" style="display:none;">
                    <label class="font-mono text-xs text-gray-400">Nombre completo</label>
                    <input id="auth-fullname" type="text" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Email</label>
                    <input id="auth-email" type="email" required class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Contraseña</label>
                    <input id="auth-password" type="password" required minlength="6" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>

                <button id="auth-submit-btn" type="submit" class="mt-1 px-3 py-2 rounded-xl text-white bg-blue-700 hover:bg-blue-800 transition duration-75 cursor-pointer font-mono text-sm">
                    Entrar
                </button>
            </form>

            <p class="font-mono text-xs text-gray-500 mt-4 text-center">
                <span id="auth-toggle-prompt">¿No tienes cuenta?</span>
                <a href="#" onclick="toggleAuthMode(); return false;" class="text-blue-400 hover:text-blue-300">
                    <span id="auth-toggle-action">Regístrate</span>
                </a>
            </p>
        </div>
    </div>`;
}

var _authMode = "login"; // "login" | "signup"

function openAuthModal(mode) {
    _authMode = mode || "login";
    applyAuthModalMode();
    const backdrop = document.getElementById("auth-modal-backdrop");
    backdrop.style.display = "flex";
    setAuthModalMessage(null);
    lucide.createIcons();
}

function closeAuthModal() {
    const backdrop = document.getElementById("auth-modal-backdrop");
    backdrop.style.display = "none";
    document.getElementById("auth-modal-form").reset();
    setAuthModalMessage(null);
}

function toggleAuthMode() {
    _authMode = _authMode === "login" ? "signup" : "login";
    applyAuthModalMode();
    setAuthModalMessage(null);
}

function applyAuthModalMode() {
    const isSignup = _authMode === "signup";
    document.getElementById("auth-modal-title").textContent = isSignup ? "Crear cuenta" : "Iniciar sesión";
    document.getElementById("auth-fullname-field").style.display = isSignup ? "" : "none";
    document.getElementById("auth-submit-btn").textContent = isSignup ? "Crear cuenta" : "Entrar";
    document.getElementById("auth-toggle-prompt").textContent = isSignup ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?";
    document.getElementById("auth-toggle-action").textContent = isSignup ? "Inicia sesión" : "Regístrate";
}

function setAuthModalMessage(text, isError) {
    const err  = document.getElementById("auth-modal-error");
    const info = document.getElementById("auth-modal-info");
    err.style.display  = "none";
    info.style.display = "none";
    if (!text) return;
    const target = isError ? err : info;
    target.textContent = text;
    target.style.display = "";
}

function initAuthModal() {
    const form = document.getElementById("auth-modal-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email    = document.getElementById("auth-email").value.trim();
        const password = document.getElementById("auth-password").value;
        const fullName = document.getElementById("auth-fullname").value.trim();

        setAuthModalMessage(null);
        const btn = document.getElementById("auth-submit-btn");
        btn.disabled = true;

        try {
            if (_authMode === "signup") {
                const { error } = await signUp(email, password, fullName);
                if (error) throw error;
                setAuthModalMessage("Cuenta creada. Revisa tu correo si se requiere confirmación, o ya puedes iniciar sesión.", false);
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
                closeAuthModal();
            }
        } catch (err) {
            setAuthModalMessage(err.message || "Ocurrió un error. Intenta de nuevo.", true);
        } finally {
            btn.disabled = false;
        }
    });
}
