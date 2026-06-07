function loadHeader() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("afterbegin", htmlHeaderComponent());
}

function loadNavbar() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("beforeend", htmlNavbarComponent(NAVBAR_CATEGORIES));
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

var BOOKS_CACHE = {};

function cacheBook(book) {
    BOOKS_CACHE[book.file_path] = book;
}

function showBookDetail(filePath) {
    const book = BOOKS_CACHE[filePath];
    if (!book) return;
    const existing = document.getElementById("book-detail-overlay");
    if (existing) existing.remove();
    document.body.insertAdjacentHTML("beforeend", htmlBookDetailComponent(book));
    lucide.createIcons();
    document.body.style.overflow = "hidden";
}

function closeBookDetail() {
    const overlay = document.getElementById("book-detail-overlay");
    if (overlay) overlay.remove();
    document.body.style.overflow = "";
}

var COLORS = {
    gray: "bg-gray",
    red: "bg-red",
    blue: "bg-blue",
    green: "bg-green",
    orange: "bg-orange",
    amber: "bg-amber",
    yellow: "bg-yellow",
    orange: "bg-orange",
    purple: "bg-purple",
    teal: "bg-teal",
    cyan: "bg-cyan",
    sky: "bg-sky",
};

async function loadCategory(categoryName, containerId) {
    const container = document.getElementById(`${containerId}-list`);

    const { data, error } = await supabase
        .from("db_dataleake")
        .select("*")
        .contains("category", [categoryName]);

    for (const book of data) {
        cacheBook(book);
        const card = htmlCardComponent(
            COLORS[book.color],
            book.url_image_front_cover,
            book.url_image_back_cover,
            book.title,
            book.author,
            book.file_path,
        );
        container.insertAdjacentHTML("beforeend", card);
    }
}

async function loadAllCategories() {
    const { data, error } = await supabase
        .from("db_dataleake")
        .select("category");

    const categories = new Set();

    for (const row of data) {
        if (Array.isArray(row.category)) {
            row.category.forEach(cat => categories.add(cat));
        }
    }

    return Array.from(categories);
}

async function initDynamicCategories() {
    const body = document.querySelector("body");

    body.insertAdjacentHTML("beforeend", '<div id="search-results-root" style="display:none;"></div>');
    body.insertAdjacentHTML("beforeend", '<div id="categories-root"></div>');

    const categories = await loadAllCategories();

    const root = document.getElementById("categories-root");

    for (const category of categories) {
        const containerId = `category-${category.toLowerCase().replace(/\s+/g, "_")}-catalog`;

        const section = htmlSectionCategoryComponent(category, containerId);

        root.insertAdjacentHTML("beforeend", section);

        loadCategory(category, containerId);
    }
}

function loadFooter() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("beforeend", htmlFooterComponent());
}

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
    const root = document.getElementById("search-results-root");
    const categoriesRoot = document.getElementById("categories-root");
    const navbar = document.getElementById("main-navbar");

    if (!query.trim()) {
        root.style.display = "none";
        root.innerHTML = "";
        if (categoriesRoot) categoriesRoot.style.display = "";
        return;
    }

    if (categoriesRoot) categoriesRoot.style.display = "none";
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
            book.file_path
        );
    }).join("");

    root.innerHTML = `
        <section class="m-5">
            <h2 class="font-mono text-white text-2xl mb-4">Resultados para "${query}"</h2>
            <div class="snap-x flex bg-gray-950 py-5 gap-5"
                style="overflow-x: auto; scrollbar-color: #364153 #101828; padding-bottom: 1rem;">
                ${cards}
            </div>
        </section>`;
}

function initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    let debounceTimer;
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        const query = input.value;
        debounceTimer = setTimeout(async () => {
            if (!query.trim()) {
                renderSearchResults([], query);
                return;
            }
            const books = await searchBooks(query);
            renderSearchResults(books, query);
        }, 300);
    });
}

loadHeader();
lucide.createIcons();
loadNavbar();
initDynamicCategories();
loadFooter();
initSearch();
