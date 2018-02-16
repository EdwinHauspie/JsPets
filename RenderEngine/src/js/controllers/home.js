import BaseController from './_base'
import $ from '../eQuery'
import { getRandom } from '../helpers'
import index from '../../views/home/index'
import about from '../../views/home/about'

class HomeController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, { index, about })

        //IE10 fix: super not working correctly in constructor with babel
        if (!this.views) BaseController.call(this, controllerConfig, { index, about })

        this.models.index = {
            ...controllerConfig,
            number: getRandom(),
            refresh: () => {
                this.models.index.number = getRandom()
                this.render('index')
            }
        }

        this.models.about = {
            ...controllerConfig,
            names: ['An', 'Jan', 'Rik'],
            addName: (sender, e) => {
                if (!sender.value.trim()) return
                this.models.about.names.push(sender.value.trim())
                this.render('about', '#names')
                sender.value = ''
            }
        }
    }

    index(routeParams) {
        this.render('index')
    }

    about(routeParams) {
        this.render('about')
        $('input').focus()
    }
}

export default HomeController