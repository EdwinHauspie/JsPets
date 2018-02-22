const path = require('path')

function toCamel(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() })
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/');

    content = `import { html } from '${srcPath}/js/helpers.js'\n` + content

        //Rewrite <c-my-func arg="123" /> to ${myFunc({arg:123})}
        .replace(/<c-([^>\s]+)(.+)\/>/gi, function (str, $1, $2) { return '${' + toCamel($1) + '({' + $2.replace(/([^=]+)="([^"]+)"/gi, '$1: $2, ') + '})}' })

        //Rewrite <for> to ${arr.map(...)}
        .replace(/<for each="([^"]+)" in="([^"]+)">/gi, '${(Number.parseInt($2) ? (Array.from(Array($2)).map((x, i) => i+1)) : $2).map(($1) => html`')
        //.replace(/<for ([^>]+) in (.+)(?!=)>/gi, '${(Number.parseInt($2) ? (Array.from(Array($2)).map((x, i) => i+1)) : $2).map(($1) => html`')
        .replace(/<\/for>/gi, '`)}')

        //Rewrite <if>
        //.replace(/<if test="([^"]+)">/gi, '${$1 ? html`')
        //.replace(/<\/if>/gi, '`:``}')

        //Rewrite <if-else>
        //.replace(/<if-else test="([^"]+)">/gi, '${$1 ? html`')
        //.replace(/<else ?\/>/gi, '`:`')
        //.replace(/<\/if-else>/gi, '`}')

        //Rewrite if
        .replace(/<([^-]+)-if test="([^"]+)"([^>]+)>/gi, '${$2 ? html`<$1 $3>')
        .replace(/<\/([^-]+)-if>/gi, '</$1>`:``}')

    this.value = content;

    //console.log(content, '\n\n---------------------------------------\n')

    return content;
}