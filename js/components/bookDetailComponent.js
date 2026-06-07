const DETAIL_COLORS = {
    gray:   { top: "bg-gray-700",   btn: "bg-gray-600 hover:bg-gray-500" },
    red:    { top: "bg-red-700",    btn: "bg-red-600 hover:bg-red-500" },
    blue:   { top: "bg-blue-700",   btn: "bg-blue-600 hover:bg-blue-500" },
    green:  { top: "bg-green-700",  btn: "bg-green-600 hover:bg-green-500" },
    orange: { top: "bg-orange-700", btn: "bg-orange-600 hover:bg-orange-500" },
    amber:  { top: "bg-amber-700",  btn: "bg-amber-600 hover:bg-amber-500" },
    yellow: { top: "bg-yellow-700", btn: "bg-yellow-600 hover:bg-yellow-500" },
    purple: { top: "bg-purple-700", btn: "bg-purple-600 hover:bg-purple-500" },
    teal:   { top: "bg-teal-700",   btn: "bg-teal-600 hover:bg-teal-500" },
    cyan:   { top: "bg-cyan-700",   btn: "bg-cyan-600 hover:bg-cyan-500" },
    sky:    { top: "bg-sky-700",    btn: "bg-sky-600 hover:bg-sky-500" },
};

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function formatDate(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-");
    return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

function htmlBookDetailPage(book) {
    const palette  = DETAIL_COLORS[book.color] || DETAIL_COLORS.blue;
    const fullDate = formatDate(book.year_release);

    const categoryBadges = (book.category || [])
        .map(c => `<span class="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/20 text-white border border-white/30">${c}</span>`)
        .join("");

    const metaItems = [
        fullDate         ? `<span class="flex items-center gap-1"><i data-lucide="calendar" style="width:12px;height:12px;"></i>${fullDate}</span>` : "",
        book.num_edition ? `<span class="flex items-center gap-1"><i data-lucide="bookmark" style="width:12px;height:12px;"></i>Ed. ${book.num_edition}</span>` : "",
        book["ISBN-13"]  ? `<span class="flex items-center gap-1"><i data-lucide="hash" style="width:12px;height:12px;"></i>${book["ISBN-13"]}</span>` : "",
    ].filter(Boolean).join('<span class="text-white/30 mx-1">·</span>');

    const safeFilePath = book.file_path.replace(/'/g, "\\'");

    return `
    <div class="py-6 px-4">

        <button onclick="navigateBack()"
                class="flex items-center gap-2 text-gray-400 hover:text-white transition font-mono text-sm mb-6 ml-2">
            <i data-lucide="arrow-left" style="width:15px;height:15px;"></i>
            Volver
        </button>

        <!-- Island -->
        <div class="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">

            <!-- Colored top section -->
            <div class="${palette.top} p-6 flex flex-col sm:flex-row gap-5">
                <img src="${book.url_image_front_cover}"
                     class="rounded-xl shadow-2xl flex-shrink-0 self-start"
                     style="width:150px;" />
                <div class="flex flex-col gap-3 py-1">
                    <h1 class="font-mono text-white text-xl font-bold leading-snug">${book.title}</h1>
                    <div class="flex items-start gap-2 text-white/70">
                        <i data-lucide="user" style="width:13px;height:13px;flex-shrink:0;margin-top:3px;"></i>
                        <span class="text-sm">${(book.author || []).join(", ")}</span>
                    </div>
                    ${metaItems ? `<div class="flex flex-wrap items-center gap-1 text-xs font-mono text-white/60">${metaItems}</div>` : ""}
                    ${categoryBadges ? `<div class="flex flex-wrap gap-1.5">${categoryBadges}</div>` : ""}
                </div>
            </div>

            <!-- Dark bottom section -->
            <div class="bg-gray-900 px-6 py-5">
                <div class="flex gap-3">
                    <button onclick="downloadBook('${safeFilePath}')"
                            class="flex-1 flex items-center gap-2 justify-center px-5 py-3 rounded-xl text-white font-bold transition cursor-pointer ${palette.btn}">
                        <i data-lucide="download" style="width:16px;height:16px;"></i>
                        Descargar PDF
                    </button>
                    <button id="toggle-pdf-btn"
                            onclick="togglePdfViewer('${safeFilePath}')"
                            class="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition cursor-pointer font-mono text-sm">
                        <i data-lucide="eye" style="width:16px;height:16px;"></i>
                        Ver PDF
                    </button>
                </div>
            </div>
        </div>

        <!-- PDF Viewer -->
        <div id="pdf-viewer-section" class="max-w-2xl mx-auto mt-4" style="display:none;"></div>
    </div>`;
}
