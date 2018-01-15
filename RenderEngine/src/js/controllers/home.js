import BaseController from './_base'

class HomeController extends BaseController {
    constructor(controllerConfig) {
        super(controllerConfig, 'home')
        BaseController.call(this, controllerConfig, 'home') ///////IE10 fix

        let root = this

        this.models.index = {
            ...controllerConfig,
            getRnd: function(min, max) {
                return Math.floor(Math.random() * max) + min
            },
            number: 123,
            refreshNumber: function () {
                this.number = this.getRnd(1, 1000)
                root.render('index', '#number')
            }
        }

        this.models.about = {
            ...controllerConfig,
            names: ['An', 'Jan', 'Rik', 'Leen'],
            addName: function (sender, e) {
                if (!sender.value.trim()) return
                this.names.push(sender.value.trim())
                root.render('about', '#names')
                sender.value = ''
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