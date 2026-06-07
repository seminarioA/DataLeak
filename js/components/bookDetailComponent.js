const DETAIL_BTN_COLORS = {
    gray:   "bg-gray-600 hover:bg-gray-500",
    red:    "bg-red-600 hover:bg-red-500",
    blue:   "bg-blue-600 hover:bg-blue-500",
    green:  "bg-green-600 hover:bg-green-500",
    orange: "bg-orange-600 hover:bg-orange-500",
    amber:  "bg-amber-600 hover:bg-amber-500",
    yellow: "bg-yellow-600 hover:bg-yellow-500",
    purple: "bg-purple-600 hover:bg-purple-500",
    teal:   "bg-teal-600 hover:bg-teal-500",
    cyan:   "bg-cyan-600 hover:bg-cyan-500",
    sky:    "bg-sky-600 hover:bg-sky-500",
};

function htmlBookDetailComponent(book) {
    const btnColor = DETAIL_BTN_COLORS[book.color] || "bg-blue-600 hover:bg-blue-500";

    const categoryBadges = (book.category || [])
        .map(c => `<span class="px-3 py-1 rounded-full text-xs font-mono bg-gray-800 text-gray-300 border border-gray-700">${c}</span>`)
        .join("");

    const safeFilePath = book.file_path.replace(/'/g, "\\'");

    return `
    <div id="book-detail-overlay"
         class="fixed inset-0 z-50 flex items-center justify-center p-4"
         style="background:rgba(0,0,0,0.82);backdrop-filter:blur(4px);"
         onclick="if(event.target===this)closeBookDetail()">

        <div class="relative bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-800"
             style="max-height:90vh;overflow-y:auto;">

            <!-- Close -->
            <button onclick="closeBookDetail()"
                    class="absolute top-4 right-4 text-gray-500 hover:text-white transition z-10">
                <i data-lucide="x" style="width:22px;height:22px;"></i>
            </button>

            <div class="flex flex-col sm:flex-row">

                <!-- Covers -->
                <div class="flex flex-row sm:flex-col gap-3 p-5 flex-shrink-0 items-start">
                    <img src="${book.url_image_front_cover}"
                         class="rounded-xl shadow-xl object-cover"
                         style="width:160px;" />
                    <img src="${book.url_image_back_cover}"
                         class="rounded-xl shadow-md object-cover opacity-60"
                         style="width:160px;" />
                </div>

                <!-- Info -->
                <div class="flex flex-col gap-4 p-5 flex-1 min-w-0">
                    <h2 class="font-mono text-white text-xl font-bold leading-snug pr-8">${book.title}</h2>

                    <div class="flex items-start gap-2 text-gray-300">
                        <i data-lucide="user" style="width:15px;height:15px;flex-shrink:0;margin-top:3px;"></i>
                        <span class="text-sm">${(book.author || []).join(", ")}</span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        ${categoryBadges}
                    </div>

                    <div class="flex items-center gap-2 text-gray-500 text-xs font-mono mt-1">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i>
                        <span>${book.file_path}</span>
                    </div>

                    <button
                        onclick="downloadBook('${safeFilePath}')"
                        class="mt-auto flex items-center gap-2 justify-center px-6 py-3 rounded-xl text-white font-bold transition cursor-pointer ${btnColor}">
                        <i data-lucide="download" style="width:18px;height:18px;"></i>
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
