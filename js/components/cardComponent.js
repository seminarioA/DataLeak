async function downloadBook(filePath) {
    const { data, error } = await supabase.storage
        .from("dataleake")
        .createSignedUrl(filePath, 3600); // duración 1 hora

    if (error) {
        console.error("Error generando URL:", error);
        return;
    }

    window.open(data.signedUrl, "_blank");
}


function htmlCardComponent(bg_color, url_image, book_title, authors_book, book_file_path) {
    let component = `
        <a href="" onclick="downloadBook(${book_file_path})">
                <div
                    class="max-w-60 rounded-3xl ${bg_color}-700 transition duration-75 hover:scale-102 hover:${bg_color}-800 h-full">
                    <img class="rounded-3xl p-1.5" src="${url_image}"
                        alt=""/>
                    <div class="px-3 py-1">
                        <div class="text-md mt-0 mb-0 font-bold text-white line-clamp-2">${book_title} 
                        </div>
                        <p class="mb-2 text-base text-gray-300 line-clamp-1">${authors_book.join(', ')}</p>
                    </div>
                </div>
            </a>`
    return component;
}
