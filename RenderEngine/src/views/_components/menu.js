export default function (router) {
    let pages = router._routes.map(r => r.name)

    return html`
        ${pages.map((p, i) => html`
            <a href="${router.generate(p)}" data-route="${p}">${p}</a>
        `)}`
}