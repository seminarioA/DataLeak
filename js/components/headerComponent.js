function htmlHeaderComponent(){
    let header = `
        <h1 class="font-mono m-3 text-white text-2xl text-center">DataLeake</h1>
        <hr class="mb-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 w-full" />
        <div class="flex justify-center px-4 pb-3">
            <div class="relative w-full max-w-2xl">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" style="width:16px;height:16px;"></i>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar libro o autor..."
                    class="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-950 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-400 focus:ring-0 transition"
                />
            </div>
        </div>
        `;
    return header;
}
