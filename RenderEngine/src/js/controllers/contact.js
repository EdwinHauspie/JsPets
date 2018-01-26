import BaseController from './_base'
import index from '../../views/contact/index.html'

class ContactController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, 'contact')

        //IE10 fix: super not working correctly in constructor with babel
        //Note: in browsers without this issue, the constructor will get fired twice
        BaseController.call(this, controllerConfig, 'contact')

        this.addViews({ index })

        this.models.index = {
            ...controllerConfig,
            text: 'Brussels'
        }
    }

    index(routeParams) {
        super.render('index')
    }
}

export default ContactController