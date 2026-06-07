function loadHeader() {
    document.getElementById("page-header").insertAdjacentHTML("beforeend", htmlHeaderComponent());
}

function loadNavbar() {
    document.getElementById("page-header").insertAdjacentHTML("beforeend", htmlNavbarComponent(NAVBAR_CATEGORIES));
}

async function downloadBook(filePath) {
    const { data, error } = await supabase.storage
        .from("dataleake")
        .createSignedUrl(filePath, 3600);

    if (error || !data?.signedUrl) {
        console.error("Error generando URL firmada", error);
        alert("No se pudo descargar el archivo. Intenta nuevamente.");
        return;
    }

    window.open(data.signedUrl, "_blank");
}

var _pdfBlobUrl = null;

const PDF_SPINNER = `
    <div class="rounded-2xl border border-gray-800 bg-gray-900 flex flex-col items-center justify-center gap-3 py-16">
        <svg class="animate-spin text-gray-400" style="width:32px;height:32px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-400 font-mono text-sm">Cargando PDF...</span>
    </div>`;

async function togglePdfViewer(filePath) {
    const section = document.getElementById("pdf-viewer-section");
    const btn = document.getElementById("toggle-pdf-btn");
    if (!section) return;

    if (section.style.display !== "none") {
        if (_pdfBlobUrl) { URL.revokeObjectURL(_pdfBlobUrl); _pdfBlobUrl = null; }
        section.style.display = "none";
        section.innerHTML = "";
        if (btn) { btn.innerHTML = '<i data-lucide="eye" style="width:16px;height:16px;"></i> Ver PDF'; lucide.createIcons(); }
        return;
    }

    section.style.display = "";
    section.innerHTML = PDF_SPINNER;
    if (btn) { btn.innerHTML = '<i data-lucide="eye-off" style="width:16px;height:16px;"></i> Cerrar'; lucide.createIcons(); }

    const { data, error } = await supabase.storage
        .from("dataleake")
        .createSignedUrl(filePath, 3600);

    if (error || !data?.signedUrl) {
        section.innerHTML = `<div class="rounded-2xl border border-gray-800 bg-gray-900 flex items-center justify-center py-12 text-red-400 font-mono text-sm">No se pudo obtener el archivo.</div>`;
        return;
    }

    try {
        const response = await fetch(data.signedUrl);
        if (!response.ok) throw new Error(response.status);
        const blob = await response.blob();
        _pdfBlobUrl = URL.createObjectURL(blob);
        section.innerHTML = `
            <div class="rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
                <iframe src="${_pdfBlobUrl}#toolbar=1" style="width:100%;height:80vh;border:none;display:block;"></iframe>
            </div>`;
    } catch (e) {
        console.error("PDF load error", e);
        section.innerHTML = `<div class="rounded-2xl border border-gray-800 bg-gray-900 flex items-center justify-center py-12 text-red-400 font-mono text-sm">Error al cargar el PDF. Intenta descargarlo.</div>`;
    }
}

var COLORS = {
    gray:   "bg-gray",
    red:    "bg-red",
    blue:   "bg-blue",
    green:  "bg-green",
    orange: "bg-orange",
    amber:  "bg-amber",
    yellow: "bg-yellow",
    purple: "bg-purple",
    teal:   "bg-teal",
    cyan:   "bg-cyan",
    sky:    "bg-sky",
};

var BOOKS_CACHE = {};

function cacheBook(book) {
    BOOKS_CACHE[book.file_path] = book;
}

// ── Router ────────────────────────────────────────────────────────────────────

function showBookPage(bookId) {
    const numId = parseInt(bookId);
    const cached = Object.values(BOOKS_CACHE).find(b => b.id === numId);

    if (cached) {
        renderBookPage(cached);
    } else {
        supabase.from("db_dataleake").select("*").eq("id", numId).single()
            .then(({ data }) => {
                if (data) { cacheBook(data); renderBookPage(data); }
            });
    }
}

function renderBookPage(book) {
    const pageDetail = document.getElementById("page-detail");
    const pageMain   = document.getElementById("page-main");
    pageDetail.innerHTML = htmlBookDetailPage(book);
    pageMain.style.display   = "none";
    pageDetail.style.display = "";
    window.scrollTo(0, 0);
    lucide.createIcons();
    loadBookIndex(book.file_path);
}

function showMainPage() {
    document.getElementById("page-main").style.display   = "";
    document.getElementById("page-detail").style.display = "none";
}

function ensureMainVisible() {
    const detail = document.getElementById("page-detail");
    if (detail && detail.style.display !== "none") {
        history.pushState(null, null, window.location.pathname + window.location.search);
        showMainPage();
    }
}

function navigateBack() {
    history.back();
}

function router() {
    const match = window.location.hash.match(/^#\/book\/(\d+)$/);
    if (match) showBookPage(match[1]);
    else        showMainPage();
}

window.addEventListener("hashchange", router);

// ── Category loading ──────────────────────────────────────────────────────────

async function loadCategory(categoryName, containerId) {
    const container = document.getElementById(`${containerId}-list`);

    const { data } = await supabase
        .from("db_dataleake")
        .select("*")
        .contains("category", [categoryName]);

    if (!data) return;
    for (const book of data) {
        cacheBook(book);
        container.insertAdjacentHTML("beforeend", htmlCardComponent(
            COLORS[book.color],
            book.url_image_front_cover,
            book.url_image_back_cover,
            book.title,
            book.author,
            book.file_path,
            book.id,
        ));
    }
}

async function loadAllCategories() {
    const { data } = await supabase.from("db_dataleake").select("category");
    const categories = new Set();
    for (const row of data || []) {
        if (Array.isArray(row.category)) row.category.forEach(c => categories.add(c));
    }
    return Array.from(categories);
}

async function initDynamicCategories() {
    const root = document.getElementById("page-main");
    root.insertAdjacentHTML("beforeend", '<div id="search-results-root" style="display:none;"></div>');
    root.insertAdjacentHTML("beforeend", '<div id="categories-root"></div>');

    const categories = await loadAllCategories();
    const catRoot = document.getElementById("categories-root");

    for (const category of categories) {
        const containerId = `category-${category.toLowerCase().replace(/\s+/g, "_")}-catalog`;
        catRoot.insertAdjacentHTML("beforeend", htmlSectionCategoryComponent(category, containerId));
        loadCategory(category, containerId);
    }
}

function loadFooter() {
    document.getElementById("page-main").insertAdjacentHTML("beforeend", htmlFooterComponent());
}

// ── Fuzzy search ──────────────────────────────────────────────────────────────

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}

function getTolerance(len) {
    if (len <= 3) return 0;
    if (len <= 5) return 1;
    return 2;
}

var ALL_BOOKS = null;

async function getAllBooks() {
    if (ALL_BOOKS) return ALL_BOOKS;
    const { data } = await supabase.from("db_dataleake").select("*");
    ALL_BOOKS = data || [];
    ALL_BOOKS.forEach(cacheBook);
    return ALL_BOOKS;
}

async function searchBooks(query) {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const queryWords = trimmed.split(/\s+/).filter(w => w.length > 0);
    const books = await getAllBooks();

    return books
        .map(book => {
            const titleWords = book.title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, " ")
                .split(/\s+/)
                .filter(w => w.length > 0);

            let totalScore = 0;
            for (const qWord of queryWords) {
                const maxDist = getTolerance(qWord.length);
                const bestDist = Math.min(...titleWords.map(t => levenshtein(qWord, t)));
                if (bestDist > maxDist) { totalScore = 0; break; }
                totalScore += qWord.length - bestDist;
            }
            return { ...book, _score: totalScore };
        })
        .filter(b => b._score > 0)
        .sort((a, b) => b._score - a._score);
}

function renderSearchResults(books, query) {
    const root    = document.getElementById("search-results-root");
    const catRoot = document.getElementById("categories-root");

    if (!query.trim()) {
        root.style.display = "none";
        root.innerHTML     = "";
        if (catRoot) catRoot.style.display = "";
        return;
    }

    if (catRoot) catRoot.style.display = "none";
    root.style.display = "";

    if (books.length === 0) {
        root.innerHTML = `
            <section class="m-5">
                <h2 class="font-mono text-white text-2xl mb-4">Resultados para "${query}"</h2>
                <p class="text-gray-400 font-mono">No se encontraron libros.</p>
            </section>`;
        return;
    }

    const cards = books.map(book => {
        cacheBook(book);
        return htmlCardComponent(
            COLORS[book.color] || "bg-gray",
            book.url_image_front_cover,
            book.url_image_back_cover,
            book.title,
            book.author,
            book.file_path,
            book.id,
        );
    }).join("");

    root.innerHTML = `
        <section class="m-5">
            <h2 class="font-mono text-white text-2xl mb-4">Resultados para "${query}"</h2>
            <div class="snap-x flex bg-gray-950 py-5 gap-5"
                style="overflow-x:auto;scrollbar-color:#364153 #101828;padding-bottom:1rem;">
                ${cards}
            </div>
        </section>`;
}

function initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;
    let debounceTimer;
    input.addEventListener("input", () => {
        ensureMainVisible();
        clearTimeout(debounceTimer);
        const query = input.value;
        debounceTimer = setTimeout(async () => {
            if (!query.trim()) { renderSearchResults([], query); return; }
            const books = await searchBooks(query);
            renderSearchResults(books, query);
        }, 300);
    });
}

// ── Book index (PDF outline) ──────────────────────────────────────────────────

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function renderOutlineItems(items, depth) {
    if (!items || items.length === 0) return "";
    return items.map(item => {
        const indent   = depth * 14;
        const textSize = depth === 0 ? "text-sm font-semibold text-gray-200" : "text-xs text-gray-400";
        const bullet   = depth > 0 ? '<span class="text-gray-600 mr-1.5 select-none">›</span>' : "";
        const subs     = depth < 2 ? renderOutlineItems(item.items, depth + 1) : "";
        return `
            <div style="padding-left:${indent}px" class="py-0.5 leading-snug ${textSize} truncate">
                ${bullet}${item.title}
            </div>
            ${subs}`;
    }).join("");
}

async function loadBookIndex(filePath) {
    const section = document.getElementById("book-index-section");
    if (!section) return;

    section.innerHTML = `
        <div class="flex items-center gap-2 text-gray-500 font-mono text-xs py-4 justify-center">
            <svg class="animate-spin" style="width:14px;height:14px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Extrayendo índice...
        </div>`;

    const { data, error } = await supabase.storage
        .from("dataleake")
        .createSignedUrl(filePath, 3600);

    if (error || !data?.signedUrl) { section.innerHTML = ""; return; }

    try {
        const pdf     = await pdfjsLib.getDocument({ url: data.signedUrl, rangeChunkSize: 65536, disableAutoFetch: true }).promise;
        const outline = await pdf.getOutline();

        if (!outline || outline.length === 0) {
            section.innerHTML = `<p class="text-gray-600 font-mono text-xs text-center py-4">Este PDF no tiene índice de contenidos.</p>`;
            return;
        }

        section.innerHTML = `
            <div class="max-w-2xl mx-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                <div class="flex items-center gap-2 px-5 py-3 border-b border-gray-800">
                    <i data-lucide="list" style="width:14px;height:14px;" class="text-gray-400"></i>
                    <span class="font-mono text-sm text-gray-300 font-semibold">Índice de contenidos</span>
                    <span class="ml-auto text-xs text-gray-600 font-mono">${outline.length} secciones</span>
                </div>
                <div class="px-5 py-3 font-mono overflow-y-auto" style="max-height:320px;">
                    ${renderOutlineItems(outline, 0)}
                </div>
            </div>`;
        lucide.createIcons();
    } catch (e) {
        console.error("Outline extraction error", e);
        section.innerHTML = "";
    }
}

// ── Boot ──────────────────────────────────────────────────────────────────────

loadHeader();
lucide.createIcons();
loadNavbar();
initDynamicCategories();
loadFooter();
initSearch();
router();
