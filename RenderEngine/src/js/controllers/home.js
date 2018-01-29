import BaseController from './_base'
import index from '../../views/home/index.html'
import about from '../../views/home/about.html'

function getRandom(min = 1, max = 1000) {
    return Math.floor(Math.random() * max) + min
}

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
                this.render('index', '#number')
            }
        }

        this.models.about = {
            ...controllerConfig,
            names: ['An', 'Jan', 'Rik'],
            addName: (sender, e) => {
                if (!sender.value.trim()) return
                this.models.about.names.push(sender.value.trim())
                this.render('about', '#names')
                $('input')[0].value = ''
            }
        }
    }

    index(routeParams) {
        super.render('index')
    }

    about(routeParams) {
        super.render('about')
        $('input').focus()
    }
}

export default HomeController