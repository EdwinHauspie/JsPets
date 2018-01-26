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

        //Uitvoeren van action
        this[actionName](routeParams)
    }

    addViews(obj) {
        Object.keys(obj).forEach(k => this.views[k] = LittleEngine.createRenderer(obj[k]))
    }

    render(actionName) {
        let html = LittleEngine.render(this.views[actionName], this.models[actionName])
        $('.js-main').html(html)
    }
}

export default BaseController