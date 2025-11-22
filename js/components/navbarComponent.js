function htmlNavbarComponent() {
    let navbar = `
        <nav class="flex flex-wrap gap-1 justify-center">
            <a href="#category-apis-catalog" class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
            APIs
            </a>   
            <a href="#category-devops-catalog" class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
            DevOps
            </a>
            <a href="#category-databases-catalog" class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
            Databases
            </a>
            <a href="#category-data_engineering-catalog"
                class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
                Data Engineering
            </a>
            <a href="#category-machine_learning-catalog"
                class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
                Machine Learning
            </a>
            </a >
                <a href="#category-python-catalog" class="font-bold rounded-lg px-3 py-2 text-gray-100 hover:text-blue-600">
                    Python
                </a>
        </nav > `;

    return navbar;
}