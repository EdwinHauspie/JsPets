import title from '../components/title'

export default ({ number }) => {
    let isEven = (number + 1) % 2

    return html`
        <c-title caption="'Conditions'" />

        <span-if test="!isEven" class="red">${number} is odd</span-if>
        <span-if test="isEven" class="green">${number} is even</span-if>

        <c-title caption="'Functions'" />

        <a href="" data-click-prevent="refresh">Refresh number</a>
        <br>
        <a href="" data-click-prevent="function(vm, e) { vm.refresh(this, e) }">Refresh number</a>
        <br>
        <a href="" data-click-prevent="vm, e => vm.refresh(this, e)">Refresh number</a>`
}