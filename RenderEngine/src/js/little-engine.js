function randomStr() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7)
}

function rewrite(el, beforeText, afterText) {
    el.parentNode.insertBefore(document.createTextNode(beforeText), el)
    el.parentNode.insertBefore(document.createTextNode(afterText), el.nextSibling)
}

let LittleEngine = {}

LittleEngine.createRenderer = function (html) {
    var vDom = document.createElement('div')
    vDom.innerHTML = html.replace(/<!--([\s\S]*?)-->/g, '') //Remove comments

    //Rewrite if
    for (var ifEl; ifEl = vDom.querySelector('[if]'); ifEl.removeAttribute('if'))
        rewrite(ifEl, '{{ if (' + ifEl.getAttribute('if') + ') { }} ', ' {{ } }}')

    //Rewrite else-if
    for (var eiEl; eiEl = vDom.querySelector('[else-if]'); eiEl.removeAttribute('else-if'))
        rewrite(eiEl, '{{ else if (' + eiEl.getAttribute('else-if') + ') { }} ', ' {{ } }}')

    //Rewrite else
    for (var elseEl; elseEl = vDom.querySelector('[else]'); elseEl.removeAttribute('else'))
        rewrite(elseEl, '{{ else { }} ', ' {{ } }}')

    //Rewrite for loops
    for (var forEl; forEl = vDom.querySelector('[for]'); forEl.removeAttribute('for')) {
        var forStatement = forEl.getAttribute('for').split('in'),
            ref = forStatement[0].split(',')[0],
            i = forStatement[0].split(',')[1] || randomStr(),
            arr = forStatement[1],
            rndArr = randomStr()

        rewrite(forEl, '{{ for (var ' + i + ' = 0, ' + rndArr + ' = ' + arr + ', ' + ref + ' = ' + rndArr + '[' + i + ']; Math.abs(' + rndArr + '.length - ' + i + '); ' + i + '++, ' + ref + ' = ' + rndArr + '[' + i + ']) { }}', ' {{ } }}')
    }

    //Create function
    var html = vDom.innerHTML
    //console.log(html)

    var re = /\{\{(.+?)\}\}/g, reExp = /(^( )?(if\W|for\W|else\W|switch\W|case\W|var\W|break\W|{|}))(.*)?/g, code = 'var __r=[];\n', cursor = 0, match, add = function (line, js) {
        js ? (code += line.match(reExp) ? line.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') + '\n' : '__r.push(' + line + ');\n')
            : (code += line.trim().length ? '__r.push("' + line.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return __r.join("");';
    var funcCode = code.replace(/[\r\t\n]/g, '');
    //console.log(funcCode)

    return new Function('with (this) { ' + funcCode + ' }');
}

LittleEngine.render = function (renderer, viewModel) {
    //var vDom = document.createElement('div')
    //vDom.innerHTML = renderer.apply(viewModel)

    //Post process some attributes
    /*var attrs = ['data-style']
    attrs.forEach(function (a) {
        var items = [].slice.call(vDom.querySelectorAll('[' + a + ']'))
        items.forEach(function (x) {
            x.setAttribute('style', x.getAttribute(a))
            x.removeAttribute(a)
        })
    })*/

    //return vDom.innerHTML
    return renderer.apply(viewModel)
}

export default LittleEngine