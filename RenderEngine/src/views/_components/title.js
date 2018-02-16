export default ({ h1, h3 }) => {
    if (h1) return html`<h1>${h1}</h1>`
    if (h3) return html`<div><h3>${h3}</h3></div>`
}