function htmlHeaderComponent(){
    let header = `
        <h1 class="font-mono m-3 text-white text-2xl text-center">DataLeake</h1>
        <hr class="mb-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 w-full" />
        <div class="flex justify-center px-4 pb-3">
            <input
                id="search-input"
                type="text"
                placeholder="Buscar libro o autor..."
                class="w-full max-w-2xl px-4 py-2 rounded-xl bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-400 focus:ring-0 transition"
            />
        </div>
        `;
    return header;
}
