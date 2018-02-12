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
            }],
            depth: 2,
            calc: (sender) => {
                this.models.index.depth = Number.parseInt(sender.value)
                this.render('index', '#recursive')
            }
        }
    }

    index(routeParams) {
        this.render('index')
    }
}

export default ContactController