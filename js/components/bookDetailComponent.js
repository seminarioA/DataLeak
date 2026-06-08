// Same darkening hover as home cards (hover:${bg_color}-800 over a -700 base) — things darken, not light up.
const DETAIL_COLORS = {
    gray:   { bg: "bg-gray-700",   btn: "bg-gray-700 hover:bg-gray-800" },
    red:    { bg: "bg-red-700",    btn: "bg-red-700 hover:bg-red-800" },
    blue:   { bg: "bg-blue-700",   btn: "bg-blue-700 hover:bg-blue-800" },
    green:  { bg: "bg-green-700",  btn: "bg-green-700 hover:bg-green-800" },
    orange: { bg: "bg-orange-700", btn: "bg-orange-700 hover:bg-orange-800" },
    amber:  { bg: "bg-amber-700",  btn: "bg-amber-700 hover:bg-amber-800" },
    yellow: { bg: "bg-yellow-700", btn: "bg-yellow-700 hover:bg-yellow-800" },
    purple: { bg: "bg-purple-700", btn: "bg-purple-700 hover:bg-purple-800" },
    teal:   { bg: "bg-teal-700",   btn: "bg-teal-700 hover:bg-teal-800" },
    cyan:   { bg: "bg-cyan-700",   btn: "bg-cyan-700 hover:bg-cyan-800" },
    sky:    { bg: "bg-sky-700",    btn: "bg-sky-700 hover:bg-sky-800" },
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

    const metaRow = metaItems.join("");

    const safeFilePath = book.file_path.replace(/'/g, "\\'");

    return `
    <div class="m-5">

        <!-- Island: neutral panel like other detail surfaces, color lives in the cover frame and buttons -->
        <div class="bg-gray-950 max-w-2xl mx-auto rounded-3xl border border-gray-800 shadow-2xl flex">

            <!-- Cover — same w-60/h-80 sizing as the home cards' image, no color frame -->
            <img src="${book.url_image_front_cover}"
                 class="object-cover flex-shrink-0 rounded-3xl m-2 shadow-lg w-60 h-80" />

            <!-- Info: inherits bg, full flex column -->
            <div class="flex-1 flex flex-col gap-3 p-5">

                <h1 class="font-mono text-white text-lg font-bold leading-snug">${book.title}</h1>

                <div class="flex items-start gap-1.5 text-white/70">
                    <i data-lucide="user" style="width:13px;height:13px;flex-shrink:0;margin-top:3px;"></i>
                    <span class="text-sm">${(book.author || []).join(", ")}</span>
                </div>

                <!-- Meta: date, edition, category, isbn — each on its own line -->
                <div class="flex flex-col gap-1 text-xs font-mono">
                    ${metaRow}
                </div>
            </div>
        </div>

        <!-- Buttons: outside the island, full-width row, equal size, download pinned to the right -->
        <div class="max-w-2xl mx-auto flex gap-2 mt-3">
            <button id="toggle-pdf-btn"
                    onclick="togglePdfViewer('${safeFilePath}')"
                    class="flex-1 flex items-center gap-2 justify-center px-3 py-2 rounded-xl text-white transition duration-75 cursor-pointer font-mono text-xs ${palette.btn}">
                <i data-lucide="eye" style="width:13px;height:13px;"></i>
                Ver PDF
            </button>
            <button id="toggle-index-btn"
                    onclick="toggleBookIndex('${safeFilePath}')"
                    class="flex-1 flex items-center gap-2 justify-center px-3 py-2 rounded-xl text-white transition duration-75 cursor-pointer font-mono text-xs ${palette.btn}">
                <i data-lucide="list" style="width:13px;height:13px;"></i>
                Índice
            </button>
            <button onclick="downloadBook('${safeFilePath}')"
                    class="flex-1 flex items-center gap-2 justify-center px-3 py-2 rounded-xl text-white font-bold transition duration-75 cursor-pointer text-xs ${palette.btn}">
                <i data-lucide="download" style="width:13px;height:13px;"></i>
                Descargar PDF
            </button>
        </div>

        <!-- Section divider, same hr complement used between home sections -->
        <hr class="m-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        <!-- PDF Viewer -->
        <div id="pdf-viewer-section" class="max-w-2xl mx-auto" style="display:none;"></div>

        <!-- Book index extracted from PDF outline -->
        <div id="book-index-section" class="max-w-2xl mx-auto"></div>
    </div>`;
}
