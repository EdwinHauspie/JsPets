import title from '../_components/title'

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
        <a href="" data-click-prevent="vm, e => vm.refresh(this, e)">Refresh number</a>

        <c-title caption="'Test area'" />
        <hr-if test="true" />

        <if test="1%2">
            lol
            <span-if test="true">wut</span-if>
        </if>

        <br-if-for each="x in 5" data-b="${x}" test="true" />

        <span-if-for test="false" each="x in 3">LOL</span-if-for>

        <for-if test="true" each="x in 10">
            ${x}
        </for-if>`
}