function htmlSectionCategoryComponent(category, containerId) {
    let component = `
            <hr class="m-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
            <section class="m-5">
                <h2 class="text-white text-2xl">
                    ${category}
                </h2>
                <div id="${containerId}" class="flex grid-cols-1 bg-gray-950 my-5 gap-5">
                </div>
            </section>

        `
    return component;
}