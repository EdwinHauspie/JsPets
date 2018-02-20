import title from '../_components/title'

let numberDisplay = ({ number }) => {
    return number % 2
        ? html`<span class="red">${number} is odd</span>`
        : html`<span class="green">${number} is even</span>`
}

export default ({ number }) => {
    return html`
        <c-title h1="'Home'" />
        <c-title h3="'Conditions and functions'" />

        <c-number-display number="number" />
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