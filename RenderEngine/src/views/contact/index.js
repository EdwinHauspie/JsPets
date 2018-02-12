import title from '../_components/title'

let tree = folders => {
    if (!folders || !folders.length) return ''

    return html`
        <ul>
            <for f in folders>
                <li>${f.name + tree(f.folders)}</li>
            </for>
        </ul>`
}

let recurse = (depth, curr = 1) => {
    return html`
        <ul>
            <for _, i in Array.from(Array(depth))>
                <li>${i+1} ${curr < depth ? recurse(depth, curr + 1) : ''}</li>
            </for>
        </ul>`
}

export default function ({ folders, depth }) {
    return html`
        <h1>Contact</h1>

        <c-title>'Tree'</c-title>

        <c-tree>folders</c-tree>

        <c-title>'Nested loop'</c-title>

        <select data-change="calc">
            <for d in [1, 2, 3, 4, 5]>
                <option ${depth == d ? 'selected="selected"' : ''}>${d}</option>
            </for>
        </select>

        <div id="recursive">
            <c-recurse>depth</c-recurse>
        </div>`
}