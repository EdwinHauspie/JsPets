import title from '../_components/title'

export default function ({ names }) {
    return html`
        <h1>About</h1>
        <c-title>'Data entry'</c-title>

        <input type="text" data-enter="addName" placeholder="Enter name" maxlength="25" />

        <ul id="names">
            <for n, i in names>
                <li class="stagger" style="animation: slideIn 0.4s ${(.3 / names.length) * i}s ease-out 1 forwards;">
                    $${n}
                </li>
            </for>
        </ul>`
}