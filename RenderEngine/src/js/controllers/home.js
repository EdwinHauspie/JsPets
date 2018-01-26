import BaseController from './_base'
import index from '../../views/home/index.html'
import about from '../../views/home/about.html'

function getRandom(min = 1, max = 1000) {
    return Math.floor(Math.random() * max) + min
}

class HomeController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, 'home')

        //IE10 fix: super not working correctly in constructor with babel
        //Note: in browsers without this issue, the constructor will get fired twice
        BaseController.call(this, controllerConfig, 'home')

        this.addViews({ index, about })

        let self = this

        this.models.index = {
            ...controllerConfig,
            number: getRandom(),
            refreshNumber: function () {
                this.number = getRandom()
                self.render('index')
            }
        }

        this.models.about = {
            ...controllerConfig,
            names: ['An', 'Jan', 'Rik'],
            addName: function (sender, e) {
                if (!sender.value.trim()) return
                this.names.push(sender.value.trim())
                self.render('about')
                $('input').focus()
            }
        }
    }

    //—————————//
    // Actions //
    //—————————//

    index(routeParams) {
        super.render('index')
    }

    about(routeParams) {
        super.render('about')
        $('input').focus()
    }
}

export default HomeController