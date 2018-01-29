import Navigo from 'navigo'
import eQuery from './js/eQuery'
import LittleEngine from './js/little-engine'
import HomeController from './js/controllers/home'
import ContactController from './js/controllers/contact'
import './css/index.css'

window.$ = eQuery

let appConfig = {
    buildStamp: 123456789,
    api: 'api.demo.com'
}

//————————//
// Router //
//————————//

Navigo.prototype.go = function (routeName, routeParams) { this.navigate(this.generate(routeName, routeParams)) }
let router = new Navigo(null, false) /*root, useHash*/

let controllers = {}
let controllerClasses = { HomeController, ContactController }

let execute = function (controllerName, actionName, routeParams) {
    //Create controller if necessary
    controllers[controllerName] = controllers[controllerName] || new controllerClasses[controllerName]({ router, ...appConfig })

    //Execute view
    controllers[controllerName].execute(actionName, routeParams || {})
}

router.notFound(function (routeParams) { router.go('home') })
router.on(function (routeParams) { execute('HomeController', 'index', routeParams) }) //Root route
router.on({
    '/home': { as: 'home', uses: function (routeParams) { execute('HomeController', 'index', routeParams) } },
    '/about': { as: 'about', uses: function (routeParams) { execute('HomeController', 'about', routeParams) } },
    '/contact': { as: 'contact', uses: function (routeParams) { execute('ContactController', 'index', routeParams) } },
})

router.hooks({
    after: function (routeParams) {
        let lastRoute = (router.lastRouteResolved() || {}).name || 'home'
        $('a', '.js-menu').removeClass('active')
        $(`[data-route="${lastRoute}"]`, '.js-menu').addClass('active')
    }
})

//——————//
// Menu //
//——————//

let $menu = $('.js-menu')
$menu[0].viewModel = {
    go: page => router.go(page),
    pages: router._routes.map(r => r.name),
    router
}
let menuRenderer = LittleEngine.createRenderer($menu.html())
let menuHtml = LittleEngine.render(menuRenderer, $menu[0].viewModel)
$menu.html(menuHtml)

router.resolve()

//————————//
// Events //
//————————//

let events = ['click', 'keyup', 'keydown', 'change', 'input']

events.forEach(x => $(document).on(x, e => {
    let target = e.target || e.srcElement
    let prevent = target.matches('[data-prevent]')
    let which = e.which | e.keyCode

    if (prevent && e.preventDefault)
        e.preventDefault()

    let eventType = null

    if (e.type === 'click' && target.matches(`[data-click]`)) eventType = 'click'
    else if (e.type === 'change' && target.matches(`[data-change]`)) eventType = 'change'
    else if (e.type === 'input' && target.matches(`[data-input]`)) eventType = 'input'
    else if (e.type === 'keydown' && which === 32 && target.matches(`[data-space]`)) eventType = 'space'
    else if (e.type === 'keydown' && which === 13 && target.matches(`[data-enter]`)) eventType = 'enter'
    else if (e.type === 'keyup' && target.matches(`[data-keyup]`)) eventType = 'keyup'

    if (!eventType) return !prevent

    let func = (target.getAttribute('data-' + eventType) || '').trim()
    if (!func) return !prevent

    try {
        let model = target.closest('[data-view]').viewModel

        if (model && model[func]) model[func](target, e)
        else {
            if (func.indexOf('function') === 0) (new Function('model, e', '(' + func + ').apply(this, [model, e])')).apply(target, [model, e])
            else if (func.match(/=>/g)) (new Function(func.split('=>')[0].replace(/^\s*\(/, '').replace(/\)\s*$/, ''), func.split('=>')[1])).apply(target, [model, e])
            else (new Function('', func)).apply(target)
        }
    }
    catch (e) {
        throw Error('Function not found or contains errors: ' + func + '\r\n' + e.message)
    }

    return !prevent
}))