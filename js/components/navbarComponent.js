const NAVBAR_CATEGORIES = [
    "APIs",
    "DevOps",
    "Databases",
    "Data Engineering",
    "Machine Learning",
    "Python",
];

function htmlNavbarComponent(categories) {
    const links = categories
        .map((category) => {
            const slug = category.toLowerCase().replace(/\s+/g, "_");
            return `
            <a href="#category-${slug}-catalog" class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
                ${category}
            </a>`;
        })
        .join("");

    let navbar = `
        <nav class="flex flex-wrap gap-1 justify-center">
            ${links}
        </nav>`;

    return navbar;
}