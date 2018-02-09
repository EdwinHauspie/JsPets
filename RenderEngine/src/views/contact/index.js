import title from '../_partials/title'

let tree = folders => {
    if (!folders || !folders.length) return ''

    return html`
        <ul>
            ${folders.map(x => html`
                <li>${x.name + tree(x.folders)}</li>
            `)}
        </ul>`
}

export default function ({ folders }) {
    return html`
        <h1>Contact</h1>
        <c-title>'Tree'</c-title>

        <c-tree>folders</c-tree>
        <c-title>'Nested loop'</c-title>

        todo`
}