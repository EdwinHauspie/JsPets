import title from '../_partials/title'

let num = nr => {
    return html`
        <div id="number" class="${nr % 2 ? 'red' : 'green'}">
            ${nr} is ${nr % 2 ? 'odd' : 'even'}
            <a href="#" data-click="refresh" data-prevent>Refresh number</a>
        </div>`
}

let link = (caption, click) => {
    return html`
        <a href="#" data-click="${click}" data-prevent>${caption}</a>
        <i>${click}</i>`
}

export default function ({ number }) {
    return html`
        <h1>Home</h1>
        ${title('Conditions and functions')}

        <c-num>number</c-num>

        ${title('Inline functions')}

        <ul>
            <li><c-link>'Normal', 'function(vm, e) { this.innerHTML = vm.number }'</c-link></li>
            <li><c-link>'Arrow', 'vm => this.innerHTML = vm.number'</c-link></li>
        </ul>`
}