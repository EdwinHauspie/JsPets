const path = require('path')

function toCamel(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() })
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = `import { html, intArr } from '${srcPath}/js/helpers.js'\n` + content
        //Rewrite <xxx-if test="" />
        //TODO
        .replace(/<(.+)-if test="([^"]+)"(.*)\/>/gi, '${$2 ? html`<$1$3/>` : ``}')

        //Rewrite <xxx-if test="">...</xxx-if>
        .replace(/<(.+)-if test="([^"]+)"/gi, '${$2 ? html`<$1')
        .replace(/<\/(.+)-if>/gi, '</$1>`:``}')

        //Rewrite <if>...</if>
        .replace(/<if test="([^"]+)">/gi, '${$1 ? html`')
        .replace(/<\/if>/gi, '`:``}')

        //Rewrite <for>...</for>
        .replace(/<for each="([^"]+) in ([^"]+)">/gi, '${intArr($2).map(($1) => html`')
        .replace(/<\/for>/gi, '`)}')

        //Rewrite <c-my-func arg="123" /> to ${myFunc({arg:123})}
        .replace(/<c-([^ ]+)(( *[a-z0-9]+="[^"]+")*) ?\/>/gi, (str, $1, $2 = '') => ('${' + $1 + '({' + $2.replace(/ *([^=]+)="([^"]+)"/gi, '$1:$2,') + '})}'))

    this.value = content;

    console.log(content, '\n\n---------------------------------------\n')

    return content;
}