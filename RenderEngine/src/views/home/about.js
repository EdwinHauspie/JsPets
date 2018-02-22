import title from '../_components/title'

export default ({ names }) => {
    return html`
        <c-title caption="'Data entry'" />

        <input type="text" data-enter="addName" placeholder="Enter name" maxlength="25" />

        <ul id="names">
            <for each="n, i" in="names">
                <li>$${n}</li>
            </for>
        </ul>`
}