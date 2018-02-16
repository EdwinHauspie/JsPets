import title from '../_components/title'
import tree from '../_components/tree'

let recurse = ({ arr, curr = 1 }) => {
    return html`
        <ul>
            <for _, i in arr>
                <li>Hello world! ${curr++ < arr.length ? recurse({arr, curr}) : ''}</li>
            </for>
        </ul>`
}

export default ({ folders, recurseArr }) => {
    return html`
        <c-title h1="'Contact'" />
        <c-title h3="'Tree'" />

        <c-tree items="folders" />

        <c-title h3="'Recursion'" />

        <select data-change="calc">
            <for x in 50>
                <option ${3 == x ? 'selected="selected"' : ''} value="${x}">Depth ${x}</option>
            </for>
        </select>

        <div id="recursor">
            <c-recurse arr="recurseArr" />
        </div>`
}