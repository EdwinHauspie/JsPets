import title from '../_components/title'
import tree from '../_components/tree'

let recurse = ({ id = '', arr, curr = 1 }) => {
    return html`
        <ul id="${id}">
            <li>
                Hello world!
                ${curr++ < arr.length ? recurse({ arr, curr }) : ''}
            </li>
        </ul>`
}

export default ({ folders, recurseArr }) => {
    return html`
        <c-title h1="'Contact'" />
        <c-title h3="'Tree'" />

        <c-tree items="folders" />

        <c-title h3="'Recursion'" />

        <select data-change="calc">
            <for each="x" in="50">
                <option ${3 == x ? 'selected="selected"' : ''} value="${x}">Depth ${x}</option>
            </for>
        </select>

        <c-recurse id="'recursor'" arr="recurseArr" />`
}