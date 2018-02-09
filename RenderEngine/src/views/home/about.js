import title from '../_partials/title'

export default function ({ names }) {
    return html`
        <h1>About</h1>
        <c-title>'Data entry'</c-title>

        <input type="text" data-enter="addName" placeholder="Enter name" maxlength="25" />

        <ul id="names">
            ${names.map(name => html`<li>$${name}</li>`)}
        </ul>`
}