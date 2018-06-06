import title from '../components/title'
import tree from '../components/tree'

let recurse = ({ depth = 0 }) => {
    return depth > 10 ? '' : html`
        <ul>
            <li>
                Hello world
                <c-recurse depth="++depth" />
            </li>
        </ul>`
}

export default ({ folders }) => {
    return html`
        <c-title caption="'Tree'" />
        <c-tree items="folders" />

        <c-title caption="'Recursion'" />
        <c-recurse />`
}