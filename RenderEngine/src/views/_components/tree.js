let tree = ({ items }) => {
    if (!items || !items.length) return ''

    return html`
        <ul>
            <for each="x" in="items">
                <li>
                    ${x.name}
                    <c-tree items="x.children" />
                </li>
            </for>
        </ul>`
}

export default tree