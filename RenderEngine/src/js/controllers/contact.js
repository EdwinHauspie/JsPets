import BaseController from './_base'
import index from '../../views/contact/index.html'

class ContactController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, { index })

        //IE10 fix: super not working correctly in constructor with babel
        if (!this.views) BaseController.call(this, controllerConfig, { index })
    }

    index(routeParams) {
        super.render('index')
    }
}

export default ContactController