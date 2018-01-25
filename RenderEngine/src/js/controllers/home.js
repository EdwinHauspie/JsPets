import BaseController from './_base'

function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min
}

class HomeController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, 'home')

        //IE10 fix: super not working correctly in constructor with babel
        //Note: in browsers without this issue, the constructor will get fired twice
        BaseController.call(this, controllerConfig, 'home')

        let self = this

        this.models.index = {
            ...controllerConfig,
            number: getRandom(1, 1000),
            refreshNumber: function () {
                this.number = getRandom(1, 1000)
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