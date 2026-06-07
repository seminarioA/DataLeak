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

async function searchBooks(query) {
    const { data, error } = await supabase
        .from("db_dataleake")
        .select("*")
        .ilike("title", `%${query}%`);

    if (error) {
        console.error("Error en búsqueda", error);
        return [];
    }
    return data || [];
}

function renderSearchResults(books, query) {
    const root = document.getElementById("search-results-root");
    const categoriesRoot = document.getElementById("categories-root");
    const navbar = document.getElementById("main-navbar");

    if (!query.trim()) {
        root.style.display = "none";
        root.innerHTML = "";
        if (categoriesRoot) categoriesRoot.style.display = "";
        if (navbar) navbar.style.display = "";
        return;
    }

    if (categoriesRoot) categoriesRoot.style.display = "none";
    if (navbar) navbar.style.display = "none";
    root.style.display = "";

    if (books.length === 0) {
        root.innerHTML = `
            <section class="m-5">
                <h2 class="font-mono text-white text-2xl mb-4">Resultados para "${query}"</h2>
                <p class="text-gray-400 font-mono">No se encontraron libros.</p>
            </section>`;
        return;
    }

    const cards = books.map(book =>
        htmlCardComponent(
            COLORS[book.color] || "bg-gray",
            book.url_image_front_cover,
            book.url_image_back_cover,
            book.title,
            book.author,
            book.file_path
        )
    ).join("");

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
loadNavbar();
initDynamicCategories();
loadFooter();
initSearch();
