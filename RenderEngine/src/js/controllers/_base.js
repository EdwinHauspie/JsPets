import $ from '../eQuery'

class BaseController {
    constructor(controllerConfig, views) {
        this.config = controllerConfig
        this.views = views
        this.models = {}
    }

    execute(actionName, routeParams) {
        if (!this[actionName]) throw Error(`Action "${actionName}" not found. Check controller or router config.`)
        this[actionName](routeParams)
        return this.models[actionName]
    }

    render(actionName, selector) {
        //Render html
        let html = this.views[actionName](this.models[actionName] || {})

        if (selector) {
            let vDom = document.createElement('div')
            vDom.innerHTML = html
            var newPart = $(selector, vDom)
            var oldPart = $(selector, '.main')
            oldPart.replaceWith(newPart)
        }
        else $('.main').html(html)
    }
}

export default BaseController