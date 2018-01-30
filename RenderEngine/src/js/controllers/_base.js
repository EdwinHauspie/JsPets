import LittleEngine from '../little-engine'

class BaseController {
    constructor(controllerConfig, views) {
        this.config = controllerConfig
        this.views = views
        this.models = {}
    }

    execute(actionName, routeParams) {
        if (!this[actionName])
            throw Error(`Action "${actionName}" not found. Check controller or router config.`)

        //Do action and bind model to the main element to catch events
        $('.js-main')[0].viewModel = this.models[actionName]
        this[actionName](routeParams)
    }

    render(actionName, selector) {
        //Compile view if necessary
        if (typeof this.views[actionName] === 'string')
            this.views[actionName] = LittleEngine.createRenderer(this.views[actionName])

        //Render html
        let html = LittleEngine.render(this.views[actionName], this.models[actionName])

        if (selector) {
            let vDom = document.createElement('div')
            vDom.innerHTML = html
            var newPart = $(selector, vDom)
            var oldPart = $(selector, '.js-main')
            oldPart.replaceWith(newPart)
        }
        else $('.js-main').html(html)
    }
}

export default BaseController