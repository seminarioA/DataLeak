const DETAIL_COLORS = {
    gray:   { header: "bg-gray-700",   btn: "bg-gray-600 hover:bg-gray-500" },
    red:    { header: "bg-red-700",    btn: "bg-red-600 hover:bg-red-500" },
    blue:   { header: "bg-blue-700",   btn: "bg-blue-600 hover:bg-blue-500" },
    green:  { header: "bg-green-700",  btn: "bg-green-600 hover:bg-green-500" },
    orange: { header: "bg-orange-700", btn: "bg-orange-600 hover:bg-orange-500" },
    amber:  { header: "bg-amber-700",  btn: "bg-amber-600 hover:bg-amber-500" },
    yellow: { header: "bg-yellow-700", btn: "bg-yellow-600 hover:bg-yellow-500" },
    purple: { header: "bg-purple-700", btn: "bg-purple-600 hover:bg-purple-500" },
    teal:   { header: "bg-teal-700",   btn: "bg-teal-600 hover:bg-teal-500" },
    cyan:   { header: "bg-cyan-700",   btn: "bg-cyan-600 hover:bg-cyan-500" },
    sky:    { header: "bg-sky-700",    btn: "bg-sky-600 hover:bg-sky-500" },
};

function htmlBookDetailPage(book) {
    const palette = DETAIL_COLORS[book.color] || DETAIL_COLORS.blue;

    const year = book.year_release
        ? new Date(book.year_release).getFullYear()
        : null;

    const categoryBadges = (book.category || [])
        .map(c => `<span class="px-3 py-1 rounded-full text-xs font-mono bg-gray-800 text-gray-300 border border-gray-700">${c}</span>`)
        .join("");

    const metaItems = [
        year         ? `<span class="flex items-center gap-1.5"><i data-lucide="calendar" style="width:13px;height:13px;"></i>${year}</span>` : "",
        book.num_edition ? `<span class="flex items-center gap-1.5"><i data-lucide="layers" style="width:13px;height:13px;"></i>Edición ${book.num_edition}</span>` : "",
        book["ISBN-13"]  ? `<span class="flex items-center gap-1.5"><i data-lucide="hash" style="width:13px;height:13px;"></i>${book["ISBN-13"]}</span>` : "",
    ].filter(Boolean).join('<span class="text-gray-700">·</span>');

    const backCover = book.url_image_back_cover
        ? `<img src="${book.url_image_back_cover}" class="rounded-xl shadow-md max-w-48 opacity-60" />`
        : "";

    const safeFilePath = book.file_path.replace(/'/g, "\\'");

    return `
    <div class="min-h-screen bg-gray-950">

        <div class="px-5 pt-5">
            <button onclick="navigateBack()"
                    class="flex items-center gap-2 text-gray-400 hover:text-white transition font-mono text-sm">
                <i data-lucide="arrow-left" style="width:15px;height:15px;"></i>
                Volver
            </button>
        </div>

        <div class="${palette.header} mt-4 px-6 pt-8 pb-0">
            <div class="max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-end">
                <img src="${book.url_image_front_cover}"
                     class="rounded-t-xl shadow-2xl self-end"
                     style="width:200px;flex-shrink:0;" />
                <div class="flex flex-col gap-3 pb-6">
                    <h1 class="font-mono text-white text-2xl font-bold leading-snug">${book.title}</h1>
                    <div class="flex items-start gap-2 text-white/80">
                        <i data-lucide="user" style="width:14px;height:14px;flex-shrink:0;margin-top:3px;"></i>
                        <span class="text-sm">${(book.author || []).join(", ")}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-5">

            ${metaItems ? `<div class="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-400">${metaItems}</div>` : ""}

            <div class="flex flex-wrap gap-2">${categoryBadges}</div>

            ${backCover}

            <button
                onclick="downloadBook('${safeFilePath}')"
                class="flex items-center gap-2 justify-center px-8 py-4 rounded-xl text-white font-bold text-base transition cursor-pointer ${palette.btn}">
                <i data-lucide="download" style="width:18px;height:18px;"></i>
                Descargar PDF
            </button>
        </div>
    </div>`;
}
