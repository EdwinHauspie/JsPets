const path = require('path')

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = content
        .replace('<template>', `import html from '${srcPath}/js/html.js'; function view() { return html\``)
        .replace('</template>', '\` }; export default view');

    this.value = content;
    return content;
}