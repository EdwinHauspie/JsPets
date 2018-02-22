import title from '../_components/title'

export default ({ number }) => {
    return html`
        <c-title caption="'Conditions'" />

        <span-if test="number % 2" class="red">${number} is odd</span-if>
        <span-if test="!(number % 2)" class="green">${number} is even
        </span-if>

        <c-title caption="'Functions'" />

        <ul>
            <for each="x" in="['refresh', 'function(vm, e) { vm.refresh(this, e) }', 'vm, e => vm.refresh(this, e)']">
                <li>
                    <a href="" data-click-prevent="${x}">
                        Refresh number
                    </a>
                </li>
            </for>
        </ul>`
}