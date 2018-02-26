const path = require('path')

function toCamel(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() })
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = `import { html, intArr } from '${srcPath}/js/helpers.js'\n` + content
        //Rewrite <xxx-if test="" />
        .replace(/<(.+)-if([^\/>]*) test="([^"]+)"([^\/>]*)\/>/gi, '${$3 ? html`<$1$2$4/>` : ``}')

        //Rewrite <xxx-for each="" />
        .replace(/<(.+)-for([^\/>]*) each="([^"]+)\s+in\s+([^"]+)"([^\/>]*)\/>/gi, '${intArr($4).map(($3) => html`<$1$2$5/>`)}')

        //Rewrite <xxx-if test="">...</xxx-if>
        .replace(/<(.+)-if([^\/>]*) test="([^"]+)"([^\/>]*)>/gi, '${$3 ? html`<$1$2$4>')
        .replace(/<\/(.+)-if([^>]*)>/gi, '</$1$2>`:``}')

        //Rewrite <xxx-for each="">...</xxx-for>
        .replace(/<(.+)-for([^\/>]*) each="([^"]+)\s+in\s+([^"]+)"([^\/>]*)>/gi, '${intArr($4).map(($3) => html`<$1$2$5>')
        .replace(/<\/(.+)-for([^>]*)>/gi, '</$1$2>`)}')

        //Rewrite <if>...</if>
        .replace(/<if\s+test="([^"]+)"[^\/>]*>/gi, '${$1 ? html`')
        .replace(/<\/if>/gi, '`:``}')

        //Rewrite <for>...</for>
        .replace(/<for\s+each="([^"]+)\s+in\s+([^"]+)"[^\/>]*>/gi, '${intArr($2).map(($1) => html`')
        .replace(/<\/for>/gi, '`)}')

        //Rewrite <c-my-func arg="123" /> to ${myFunc({arg:123})}
        .replace(/<c-([^\s]+)([^\/>]+)\/>/gi, function (str, $1, $2) { return '${' + toCamel($1) + '({' + $2.replace(/([^=]+)="([^"]+)"/gi, '$1: $2, ') + '})}' })

    this.value = content;

    console.log(content, '\n\n---------------------------------------\n')

    return content;
}