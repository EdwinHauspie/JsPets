const path = require('path')

/*function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
}*/

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = `import html from '${srcPath}/js/html.js'\n` + content
        .replace(/<c-([^>]+)>(.*)<\/c-([^>]+)>/gi, '${$1' + '($2)}') //Replace <c-xxx>
        .replace(/<for ([^>]+) in ([^>]+)>/gi, '${$2.map(($1) => html`') //Replace <for>
        .replace(/<\/for>/gi, '`)}') //Replace <for>

    this.value = content;
    return content;
}