import LittleEngine from '../core/little-engine'

class BaseController {
    constructor(controllerConfig, name) {
        this.config = controllerConfig
        this.name = name
        this.views = {}
        this.models = {}
    }

    execute(actionName, routeParams) {
        if (!this[actionName]) throw Error(`Action "${actionName}" not found in controller "${this.name}". Check controller or router config.`)

        //Koppelen van model aan DOM element voor event handlers
        $('.js-body')[0].viewModel = this.models[actionName]

        //Uitvoeren van action als de view reeds bestaat
        if (this.views[actionName]) {
            this[actionName](routeParams)
            return Promise.resolve()
        }

        let toCamelCase = x => x.toLowerCase().replace(/-([a-zA-Z])/g, g => g[1].toUpperCase())

        //Ophalen van de view
        return $.get(`./views/${this.name}/${actionName}.html`)
            .then(html => {
                //Correct self closing custom tags
                //<my-tag /> is invalid html - it must be <my-tag></my-tag>
                html = html.replace(/<([-a-zA-Z]+)\s?\/>/gi, '<$1></$1>')

                //Get partials
                let vDom = document.createElement('div')
                vDom.innerHTML = html

                //https://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name
                var VALID_CUSTOM_ELEMENT_NAME_REGEX = /^(?!(?:annotation-xml|color-profile|font-face|font-face(?:-(?:src|uri|format|name))?|missing-glyph)$)[a-z][a-z.0-9_\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u200C\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uDFFF\uF900-\uFDCF\uFDF0-\uFFFD]*-[\-a-z.0-9_\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u200C\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uDFFF\uF900-\uFDCF\uFDF0-\uFFFD]*$/;
                let customTags = $('*', vDom).filter(x => x.constructor === HTMLUnknownElement || x.constructor === HTMLElement && VALID_CUSTOM_ELEMENT_NAME_REGEX.test(x.localName))
                let partials = customTags.reduce((agg, x) => { agg[x.tagName] = null; return agg }, {})
                let gets = Object.keys(partials).map(p => $.get(`./views/_partials/${toCamelCase(p)}.html`).then(partialHtml => partials[p] = partialHtml))

                return Promise.all(gets).then(() => {
                    customTags.forEach(x => x.outerHTML = partials[x.tagName])
                    return vDom.innerHTML
                })
            })
            .then(html => {
                //Bewaren van view
                this.views[actionName] = LittleEngine.createRenderer(html)

                //Action uitvoeren
                this[actionName](routeParams)
            })
    }

    render(actionName, idSelector) {
        let html = LittleEngine.render(this.views[actionName], this.models[actionName])

        if (!idSelector || idSelector.indexOf('#') !== 0) {
            $('.js-body').html(html)
            return
        }

        let vDom = document.createElement('div')
        vDom.innerHTML = html

        var newPart = $(idSelector, vDom)
        var oldPart = $(idSelector)

        if (newPart.length && oldPart.length) {
            oldPart.replaceWith(newPart)
        }
        else if (!newPart.length && oldPart.length) {
            oldPart.remove()
        }
        else if (newPart.length && !oldPart.length) {
            //????????
        }
    }
}

export default BaseController