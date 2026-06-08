// Modal for the admin to upload a new book (PDF + metadata) into the catalog.

// COLORS is defined in app.js — reuse its keys for the color <select>, with a safe fallback
// in case this script ever loads before app.js does.
function COLORS_LIST_FALLBACK() {
    return (typeof COLORS !== "undefined" && COLORS) ? COLORS : {
        gray: 1, red: 1, blue: 1, green: 1, orange: 1, amber: 1,
        yellow: 1, purple: 1, teal: 1, cyan: 1, sky: 1,
    };
}

function htmlAdminUploadModalComponent() {
    const colorOptions = Object.keys(COLORS_LIST_FALLBACK())
        .map(c => `<option value="${c}">${c}</option>`).join("");

    return `
    <div id="admin-upload-modal-backdrop" style="display:none;" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto" onclick="if(event.target===this) closeAdminUploadModal()">
        <div class="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 my-8">
            <div class="flex items-center justify-between mb-4">
                <h2 class="font-mono text-white text-lg font-bold">Subir libro</h2>
                <button onclick="closeAdminUploadModal()" class="text-gray-500 hover:text-white cursor-pointer">
                    <i data-lucide="x" style="width:18px;height:18px;"></i>
                </button>
            </div>

            <p id="admin-upload-error" style="display:none;" class="font-mono text-xs text-red-400 mb-3"></p>
            <p id="admin-upload-info" style="display:none;" class="font-mono text-xs text-green-400 mb-3"></p>

            <form id="admin-upload-form" class="grid grid-cols-2 gap-3">
                <div class="col-span-2">
                    <label class="font-mono text-xs text-gray-400">Título *</label>
                    <input id="admin-title" type="text" required class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div class="col-span-2">
                    <label class="font-mono text-xs text-gray-400">Autor(es) — separados por coma *</label>
                    <input id="admin-author" type="text" required class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Categorías — separadas por coma *</label>
                    <input id="admin-category" type="text" required class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Color *</label>
                    <select id="admin-color" required class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm">
                        ${colorOptions}
                    </select>
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">ISBN-13</label>
                    <input id="admin-isbn" type="text" maxlength="13" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Edición</label>
                    <input id="admin-edition" type="number" min="1" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div>
                    <label class="font-mono text-xs text-gray-400">Año de publicación</label>
                    <input id="admin-year" type="date" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div class="col-span-2">
                    <label class="font-mono text-xs text-gray-400">URL portada frontal *</label>
                    <input id="admin-cover-front" type="url" required class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div class="col-span-2">
                    <label class="font-mono text-xs text-gray-400">URL portada trasera</label>
                    <input id="admin-cover-back" type="url" class="mt-1 w-full px-3 py-2 rounded-xl bg-gray-950 text-white border border-gray-700 focus:outline-none focus:border-blue-400 font-mono text-sm" />
                </div>
                <div class="col-span-2">
                    <label class="font-mono text-xs text-gray-400">Archivo PDF *</label>
                    <input id="admin-pdf-file" type="file" accept="application/pdf" required class="mt-1 w-full text-sm text-gray-300 font-mono file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-blue-700 file:text-white file:font-mono file:text-xs hover:file:bg-blue-800 file:cursor-pointer cursor-pointer" />
                </div>

                <button id="admin-upload-submit-btn" type="submit" class="col-span-2 mt-1 px-3 py-2 rounded-xl text-white bg-blue-700 hover:bg-blue-800 transition duration-75 cursor-pointer font-mono text-sm">
                    Subir libro
                </button>
            </form>
        </div>
    </div>`;
}

function openAdminUploadModal() {
    if (CURRENT_ROLE !== "admin") return;
    const backdrop = document.getElementById("admin-upload-modal-backdrop");
    backdrop.style.display = "flex";
    setAdminUploadMessage(null);
    lucide.createIcons();
}

function closeAdminUploadModal() {
    const backdrop = document.getElementById("admin-upload-modal-backdrop");
    backdrop.style.display = "none";
    document.getElementById("admin-upload-form").reset();
    setAdminUploadMessage(null);
}

function setAdminUploadMessage(text, isError) {
    const err  = document.getElementById("admin-upload-error");
    const info = document.getElementById("admin-upload-info");
    err.style.display  = "none";
    info.style.display = "none";
    if (!text) return;
    const target = isError ? err : info;
    target.textContent = text;
    target.style.display = "";
}

function slugifyFileName(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function initAdminUploadModal() {
    const form = document.getElementById("admin-upload-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (CURRENT_ROLE !== "admin") return;

        const title       = document.getElementById("admin-title").value.trim();
        const authorRaw   = document.getElementById("admin-author").value.trim();
        const categoryRaw = document.getElementById("admin-category").value.trim();
        const color       = document.getElementById("admin-color").value;
        const isbn        = document.getElementById("admin-isbn").value.trim();
        const edition     = document.getElementById("admin-edition").value;
        const year        = document.getElementById("admin-year").value;
        const coverFront  = document.getElementById("admin-cover-front").value.trim();
        const coverBack   = document.getElementById("admin-cover-back").value.trim();
        const fileInput   = document.getElementById("admin-pdf-file");
        const file        = fileInput.files?.[0];

        if (!file) { setAdminUploadMessage("Selecciona el archivo PDF.", true); return; }
        if (isbn && isbn.length !== 13) { setAdminUploadMessage("El ISBN-13 debe tener 13 caracteres.", true); return; }

        setAdminUploadMessage(null);
        const btn = document.getElementById("admin-upload-submit-btn");
        btn.disabled = true;
        btn.textContent = "Subiendo...";

        try {
            const filePath = `${Date.now()}-${slugifyFileName(file.name)}`;

            const { error: uploadError } = await supabase.storage
                .from("dataleake").upload(filePath, file, { contentType: "application/pdf" });
            if (uploadError) throw uploadError;

            const { error: insertError } = await supabase.from("db_dataleake").insert({
                title,
                author: authorRaw.split(",").map(a => a.trim()).filter(Boolean),
                category: categoryRaw.split(",").map(c => c.trim()).filter(Boolean),
                color,
                "ISBN-13": isbn || null,
                num_edition: edition ? parseInt(edition, 10) : null,
                year_release: year || null,
                url_image_front_cover: coverFront,
                url_image_back_cover: coverBack || null,
                file_path: filePath,
            });
            if (insertError) throw insertError;

            setAdminUploadMessage("Libro subido correctamente.", false);
            form.reset();
            ALL_BOOKS = null; // force catalog refresh on next search/listing
        } catch (err) {
            setAdminUploadMessage(err.message || "No se pudo subir el libro.", true);
        } finally {
            btn.disabled = false;
            btn.textContent = "Subir libro";
        }
    });
}
