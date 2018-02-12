import title from '../_partials/title'

let num = nr => {
    return html`
        <div id="number" class="${nr % 2 ? 'red' : 'green'}">
            ${nr} is ${nr % 2 ? 'odd' : 'even'}
            <a href="#" data-click="refresh" data-prevent>Refresh number</a>
        </div>`
}

let link = (click) => {
    return html`
        <a href="#" data-click="${click}" data-prevent>${click}</a>`
}

export default function ({ number }) {
    return html`
        <h1>Home</h1>
        ${title('Conditions and functions')}

        <c-num>number</c-num>

        ${title('Inline functions')}

        <ul>
            <li>${link('function(vm, e) { this.innerHTML = vm.number }')}</li>
            <li>${link('vm => this.innerHTML = vm.number')}</li>
        </ul>`
}