// Modal for logged-in users to request a book be added to the catalog.

function htmlBookRequestModalComponent() {
    return `
    <div id="request-modal-backdrop" style="display:none;" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onclick="if(event.target===this) closeRequestModal()">
        <div class="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="font-mono text-white text-lg font-bold">Solicitar libro</h2>
                <button onclick="closeRequestModal()" class="text-gray-500 hover:text-white cursor-pointer">
                    <i data-lucide="x" style="width:18px;height:18px;"></i>
                </button>
            </div>

            <p id="request-modal-error" style="display:none;" class="font-mono text-xs text-red-400 mb-3"></p>
            <p id="request-modal-info" style="display:none;" class="font-mono text-xs text-green-400 mb-3"></p>

            <form id="request-modal-form" class="flex flex-col gap-3">
                <div>
                    <label class="font-mono text-xs text-gray-400">ISBN</label>
                    <input id="request-isbn" type="text" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Nombre completo del libro</label>
                    <input id="request-title" type="text" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Autor (opcional)</label>
                    <input id="request-author" type="text" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Notas adicionales (opcional)</label>
                    <textarea id="request-notes" rows="3" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm resize-none"></textarea>
                </div>

                <button id="request-submit-btn" type="submit" class="mt-1 px-3 py-2 rounded-xl text-white bg-blue-700 hover:bg-blue-800 transition duration-75 cursor-pointer font-mono text-sm">
                    Enviar solicitud
                </button>
            </form>
        </div>
    </div>`;
}

function openRequestModal() {
    if (CURRENT_ROLE === "guest") return openAuthModal("login");

    const backdrop = document.getElementById("request-modal-backdrop");
    backdrop.style.display = "flex";
    setRequestModalMessage(null);
    lucide.createIcons();
}

function closeRequestModal() {
    const backdrop = document.getElementById("request-modal-backdrop");
    backdrop.style.display = "none";
    document.getElementById("request-modal-form").reset();
    setRequestModalMessage(null);
}

function setRequestModalMessage(text, isError) {
    const err  = document.getElementById("request-modal-error");
    const info = document.getElementById("request-modal-info");
    err.style.display  = "none";
    info.style.display = "none";
    if (!text) return;
    const target = isError ? err : info;
    target.textContent = text;
    target.style.display = "";
}

function initBookRequestModal() {
    const form = document.getElementById("request-modal-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!CURRENT_USER) return;

        const isbn   = document.getElementById("request-isbn").value.trim();
        const title  = document.getElementById("request-title").value.trim();
        const author = document.getElementById("request-author").value.trim();
        const notes  = document.getElementById("request-notes").value.trim();

        if (!isbn && !title) {
            setRequestModalMessage("Indica al menos el ISBN o el nombre del libro.", true);
            return;
        }

        setRequestModalMessage(null);
        const btn = document.getElementById("request-submit-btn");
        btn.disabled = true;

        try {
            const { error } = await supabase.from("book_requests").insert({
                user_id: CURRENT_USER.id,
                isbn: isbn || null,
                title: title || null,
                author: author || null,
                extra_notes: notes || null,
            });
            if (error) throw error;
            setRequestModalMessage("Solicitud enviada. ¡Gracias!", false);
            form.reset();
        } catch (err) {
            setRequestModalMessage(err.message || "No se pudo enviar la solicitud.", true);
        } finally {
            btn.disabled = false;
        }
    });
}
