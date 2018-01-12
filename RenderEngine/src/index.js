import Navigo from './core/navigo'
import './core/q.js'
import './core/little-engine.js'

import HomeController from './controllers/home'
import ContactController from './controllers/contact'

import './index.css'

(function (appConfig) {
    //————————//
    // Router //
    //————————//

    Navigo.prototype.url = Navigo.prototype.generate
    Navigo.prototype.go = function (routeName, routeParams) { this.navigate(this.url(routeName, routeParams)) }
    let router = new Navigo(null, true) /*root, useHash*/

    let controllers = {}
    let C = { 'HomeController': HomeController, 'ContactController': ContactController}

    let execute = function (controllerName, actionName, routeParams) {
        //Create controller if necessary
        controllers[controllerName] = controllers[controllerName] || new C[controllerName]({ router, ...appConfig })

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
        before: function (done, routeParams) {
            let lastRoute = (router.lastRouteResolved() || {}).name || 'home'
            Q('a.active', '.js-menu').removeClass('active')
            Q(`[data-route="${lastRoute}"]`, '.js-menu').addClass('active')
            done()
        }
    })

    //——————//
    // Menu //
    //——————//

    let menu = Q('.js-menu')
    let menuRenderer = LittleEngine.createRenderer(menu.html())
    menu.html(LittleEngine.render(menuRenderer, { pages: router._routes.map(r => r.name), router }))

    router.resolve()

    //————————//
    // Events //
    //————————//

    let events = ['click', 'keyup', 'keydown', 'change', 'input']

    events.forEach(x => Q(document).on(x, e => {
        if (e.target.matches('[data-prevent]'))
            e.preventDefault()

        let eventType

        if (e.type === 'click' && e.target.matches(`[data-click]`)) eventType = 'click'
        else if (e.type === 'change' && e.target.matches(`[data-change]`)) eventType = 'change'
        else if (e.type === 'input' && e.target.matches(`[data-input]`)) eventType = 'input'
        else if (e.type === 'keydown' && e.which === 32 && e.target.matches(`[data-space]`)) eventType = 'space'
        else if (e.type === 'keydown' && e.which === 13 && e.target.matches(`[data-enter]`)) eventType = 'enter'
        else if (e.type === 'keyup' && e.target.matches(`[data-keyup]`)) eventType = 'keyup'

        if (!eventType) return

        let func = (e.target.getAttribute('data-' + eventType) || '').trim()
        if (!func) return

        try {
            let model = e.target.closest('[data-view]').viewModel
            if (model && model[func]) model[func](e.target, e)
            else if (func.indexOf('function') === 0 || func.match(/=>/g)) (new Function('sender, e', '(' + func + ')(sender, e)')).apply(model, [e.target, e])
            else (new Function('sender, e', 'with (this) {' + func + '}')).apply(model, [e.target, e])
        }
        catch (e) {
            throw Error('Function not found or contains errors: ' + func + '\r\n' + e.message)
        }
    }))
})({
    buildStamp: 123456789,
    api: 'api.demo.com'
    //...
})