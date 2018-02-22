import BaseController from './_base'
import index from '../../views/contact/index'

class ContactController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, { index })

        //IE10 fix: super not working correctly in constructor with babel
        if (!this.views) BaseController.call(this, controllerConfig, { index })

        this.models.index = {
            folders: [{
                name: 'My Folder',
                children: [
                    {
                        name: 'Pictures',
                        children: [
                            {
                                name: '2017',
                                children: [{ name: 'Photoshop' }]
                            },
                            { name: '2018' }
                        ]
                    },
                    { name: 'Movies' }
                ]
            }]
        }
    }

    index(routeParams) {
        this.render('index')
    }
}

export default ContactController