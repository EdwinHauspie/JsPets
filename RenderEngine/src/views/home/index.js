import title from '../_components/title'

export default ({ number }) => {
    return html`
        <c-title h1="'Home'" />
        <c-title h3="'Conditions and functions'" />

        <if-else number % 2>
            <span class="red">${number} is odd</span>
            <else />
            <span class="green">${number} is even</span>
        </if-else>

        <a href="#" data-click-prevent="refresh">Refresh number</a>

        <c-title h3="'Inline functions'" />

        <ul>
            <li>
                <a href="#" data-click-prevent="function(vm, e) { this.innerHTML = vm.number }">Demo 1</a>
            </li>
            <li>
                <a href="#" data-click-prevent="vm => this.innerHTML = vm.number">Demo 2</a>
            </li>
        </ul>`
}