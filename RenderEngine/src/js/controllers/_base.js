import LittleEngine from '../little-engine'

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
        $('.js-main')[0].viewModel = this.models[actionName]

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
                html = html.replace(/<([a-zA-Z]+-[a-zA-Z]+)\s?\/>/gi, '<$1></$1>')

                //Get partials
                let vDom = document.createElement('div')
                vDom.innerHTML = html

                //let partialElements = $('partial', vDom).toArray()
                //let partials = {}
                //partialElements.forEach(x => partials[x.getAttribute('name')] = '')
                //let partialHtmls = {}
                //let gets = Object.keys(partials).map(p => $.get(`./views/_partials/${toCamelCase(p)}.html`).then(html => partials[p] = html))

                //return Promise.all(gets).then(() => {
                    //; console.log(partials);
                    //; console.log(partialElements);
                    //partialElements.forEach(x => x.outerHTML = partials[x.getAttribute('name')])
                    return vDom.innerHTML
                //})
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
            $('.js-main').html(html)
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