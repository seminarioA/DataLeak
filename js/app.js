function loadHeader() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("afterbegin", htmlHeaderComponent());
}

function loadNavbar() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("beforeend", htmlNavbarComponent(NAVBAR_CATEGORIES));
}

async function downloadBook(filePath) {
    const response = await fetch(
        "https://buykkihkvljctcahbsjq.supabase.co/functions/v1/get-pdf-signed-url",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_path: filePath }),
        }
    );

    if (!response.ok) {
        console.error("Signed URL request failed", await response.text());
        return;
    }

    const { signedUrl } = await response.json();

    if (!signedUrl) {
        console.error("Signed URL missing in response");
        return;
    }

    window.open(signedUrl, "_blank");
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

loadHeader();
loadNavbar();
initDynamicCategories();
loadFooter();
