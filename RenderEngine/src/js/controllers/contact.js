import BaseController from './_base'
import index from '../../views/contact/index.js'

class ContactController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, { index })

        //IE10 fix: super not working correctly in constructor with babel
        if (!this.views) BaseController.call(this, controllerConfig, { index })

        this.models.index = {
            folders: [{
                name: 'My Folder',
                folders: [
                    {
                        name: 'Pictures',
                        folders: [
                            {
                                name: '2017',
                                folders: [{ name: 'Photoshop' }]
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
        super.render('index')
    }
}

export default ContactController