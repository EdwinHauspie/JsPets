const path = require('path')

/*function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
}*/

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = `import { html } from '${srcPath}/js/helpers.js'\n` + content
        //.replace(/<c-([^>]+)>(.*)<\/c-([^>]+)>/gi, '${$1' + '($2)}') //Replace <c-xxx>
        .replace(/<c-([^>\s]+)(.+)\/>/gi, function(str, $1, $2) { return '${' + $1 + '({' + $2.replace(/([^=]+)="([^"]+)"/gi, '$1: $2') + '})}' }) //Replace <c-xxx>
        .replace(/<for each="([^"]+)" in="([^"]+)">/gi, '${(Number.parseInt($2) ? (Array.from(Array($2)).map((x, i) => i+1)) : $2).map(($1) => html`') //Replace <for>
        .replace(/<\/for>/gi, '`)}') //Replace </for>

    this.value = content;
    return content;
}