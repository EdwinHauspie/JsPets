import BaseController from './_base'

class ContactController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, 'contact')

        this.models.index = {
            ...controllerConfig
        }
    }

    index(routeParams) {
        super.render('index')
    }
}

export default ContactController