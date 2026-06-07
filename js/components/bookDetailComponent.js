const DETAIL_COLORS = {
    gray:   { bg: "bg-gray-700",   btn: "bg-gray-600 hover:bg-gray-500" },
    red:    { bg: "bg-red-700",    btn: "bg-red-600 hover:bg-red-500" },
    blue:   { bg: "bg-blue-700",   btn: "bg-blue-600 hover:bg-blue-500" },
    green:  { bg: "bg-green-700",  btn: "bg-green-600 hover:bg-green-500" },
    orange: { bg: "bg-orange-700", btn: "bg-orange-600 hover:bg-orange-500" },
    amber:  { bg: "bg-amber-700",  btn: "bg-amber-600 hover:bg-amber-500" },
    yellow: { bg: "bg-yellow-700", btn: "bg-yellow-600 hover:bg-yellow-500" },
    purple: { bg: "bg-purple-700", btn: "bg-purple-600 hover:bg-purple-500" },
    teal:   { bg: "bg-teal-700",   btn: "bg-teal-600 hover:bg-teal-500" },
    cyan:   { bg: "bg-cyan-700",   btn: "bg-cyan-600 hover:bg-cyan-500" },
    sky:    { bg: "bg-sky-700",    btn: "bg-sky-600 hover:bg-sky-500" },
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

    const metaChip = (icon, text) =>
        `<span class="flex items-center gap-1 text-white/70">
            <i data-lucide="${icon}" style="width:12px;height:12px;flex-shrink:0;"></i>${text}
        </span>`;

    const metaItems = [
        fullDate         ? metaChip("calendar",  fullDate)         : "",
        book.num_edition ? metaChip("bookmark",  `Ed. ${book.num_edition}`) : "",
        ...(book.category || []).map(c => metaChip("tag", c)),
        book["ISBN-13"]  ? metaChip("hash", book["ISBN-13"])       : "",
    ].filter(Boolean);

    const metaRow = metaItems.map((item, i) =>
        i < metaItems.length - 1
            ? item + `<span class="text-white/30">·</span>`
            : item
    ).join("");

    const safeFilePath = book.file_path.replace(/'/g, "\\'");

    return `
    <div class="py-6 px-4">

        <!-- Island: entire bg is book color -->
        <div class="${palette.bg} max-w-2xl mx-auto rounded-2xl border border-gray-800 shadow-2xl flex">

            <!-- Cover — rounded like cards, margin shows color behind -->
            <img src="${book.url_image_front_cover}"
                 class="object-cover flex-shrink-0 rounded-2xl m-2 shadow-lg"
                 style="width:150px;" />

            <!-- Info: inherits bg, full flex column -->
            <div class="flex-1 flex flex-col gap-3 p-5">

                <h1 class="font-mono text-white text-lg font-bold leading-snug">${book.title}</h1>

                <div class="flex items-start gap-1.5 text-white/70">
                    <i data-lucide="user" style="width:13px;height:13px;flex-shrink:0;margin-top:3px;"></i>
                    <span class="text-sm">${(book.author || []).join(", ")}</span>
                </div>

                <!-- Meta: date · edition · category · isbn (all with icons) -->
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                    ${metaRow}
                </div>

                <!-- Buttons pinned to bottom -->
                <div class="flex gap-3 mt-auto pt-2">
                    <button onclick="downloadBook('${safeFilePath}')"
                            class="flex-1 flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl text-white font-bold transition cursor-pointer text-sm bg-black/25 hover:bg-black/40">
                        <i data-lucide="download" style="width:15px;height:15px;"></i>
                        Descargar PDF
                    </button>
                    <button id="toggle-pdf-btn"
                            onclick="togglePdfViewer('${safeFilePath}')"
                            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition cursor-pointer font-mono text-sm bg-black/25 hover:bg-black/40">
                        <i data-lucide="eye" style="width:15px;height:15px;"></i>
                        Ver PDF
                    </button>
                </div>
            </div>
        </div>

        <!-- PDF Viewer -->
        <div id="pdf-viewer-section" class="max-w-2xl mx-auto mt-4" style="display:none;"></div>
    </div>`;
}
