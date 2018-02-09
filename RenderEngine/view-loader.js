const path = require('path')

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = `import html from '${srcPath}/js/html.js'\n` + content
        .replace(/<c-([^>]+)>(.*)<\/c-([^>]+)>/gi, '${$1($2)}')

    this.value = content;
    return content;
}