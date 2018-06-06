export default ({ router }) => {
    let pages = router._routes.map(r => r.name)

    return html`
        <for each="p in pages">
            <a href="${router.generate(p)}" data-route="${p}">
                ${p}
            </a>
        </for>`
}