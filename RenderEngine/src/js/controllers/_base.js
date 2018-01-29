import LittleEngine from '../little-engine'

class BaseController {
    constructor(controllerConfig, views) {
        this.config = controllerConfig
        this.models = {}

        this.views = {}
        Object.keys(views).forEach(v => this.views[v] = LittleEngine.createRenderer(views[v]))
    }

    execute(actionName, routeParams) {
        if (!this[actionName]) throw Error(`Action "${actionName}" not found. Check controller or router config.`)

        //Do action and bind model to the main element to catch events
        $('.js-main')[0].viewModel = this.models[actionName]
        this[actionName](routeParams)
    }

    render(actionName, selector) {
        let html = LittleEngine.render(this.views[actionName], this.models[actionName])

        if (selector) {
            let vDom = document.createElement('div')
            vDom.innerHTML = html
            var newPart = $(selector, vDom)
            var oldPart = $(selector)
            oldPart.replaceWith(newPart)
        }
        else $('.js-main').html(html)
    }
}

export default BaseController