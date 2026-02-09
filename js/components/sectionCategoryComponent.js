function htmlSectionCategoryComponent(category, containerId) {
    const listId = `${containerId}-list`;
    let component = `
            <hr class="m-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
            <div id="${containerId}"></div>
            <section class="m-5">
                <h2 class="font-mono text-white text-2xl">
                    ${category}
                </h2>
                <div id="${listId}" class="snap-x flex grid-cols-1 bg-gray-950 py-5 gap-5"
                style="overflow-x: auto; scrollbar-color: #364153 #101828; padding-bottom: 1rem;">
                </div>
            </section>
        `
    return component;
}