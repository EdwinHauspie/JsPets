import title from '../_components/title'

export default ({ number }) => {
    return html`
        <c-title h1="'Home'" />
        <c-title h3="'Conditions and functions'" />

        <div>
            <span class="${number % 2 ? 'red' : 'green'}">${number} is ${number % 2 ? 'odd' : 'even'}</span>
            <a href="#" data-click-prevent="refresh">Refresh number</a>
        </div>

        <c-title h3="'Inline functions'" />

        <ul>
            <li><a href="#" data-click-prevent="function(vm, e) { this.innerHTML = vm.number }"vent>Demo 1</a></li>
            <li><a href="#" data-click-prevent="vm => this.innerHTML = vm.number">Demo 2</a></li>
        </ul>`
}