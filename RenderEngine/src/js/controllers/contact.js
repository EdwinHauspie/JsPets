import BaseController from './_base'

class ContactController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, 'contact')
        BaseController.call(this, controllerConfig, 'contact') ///////IE10 fix

        this.models.index = {
            ...controllerConfig
        }
    }

    index(routeParams) {
        super.render('index')
    }
}

export default ContactController