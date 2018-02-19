import Navigo from 'navigo'
import $ from './js/eQuery'
import HomeController from './js/controllers/home'
import ContactController from './js/controllers/contact'
import menu from './views/_components/menu'
import './css/index.css'

let appConfig = {
    buildStamp: 123456789,
    api: 'api.demo.com'
}

//—————————————//
// Route setup //
//—————————————//

Navigo.prototype.go = function (routeName, routeParams) { this.navigate(this.generate(routeName, routeParams)) }
let router = new Navigo(null, false) /*root, useHash*/

let controllerClasses = { HomeController, ContactController }
let controllerInstances = {}
let currentModel = null

let execute = function (controllerName, actionName, routeParams) {
    //Create controller if necessary
    controllerInstances[controllerName] = controllerInstances[controllerName] || new controllerClasses[controllerName]({ router, ...appConfig })

    //Execute action
    currentModel = controllerInstances[controllerName].execute(actionName, routeParams || {})
}

router.notFound(function (routeParams) { router.go('home') })
router.on(function (routeParams) { execute('HomeController', 'index', routeParams) }) //Root route
router.on({
    '/home': { as: 'home', uses: function (routeParams) { execute('HomeController', 'index', routeParams) } },
    '/about': { as: 'about', uses: function (routeParams) { execute('HomeController', 'about', routeParams) } },
    '/contact': { as: 'contact', uses: function (routeParams) { execute('ContactController', 'index', routeParams) } },
})

//————————————//
// Menu setup //
//————————————//

router.hooks({
    after: function (routeParams) {
        let lastRoute = (router.lastRouteResolved() || {}).name || 'home'
        $('a', '.menu').removeClass('active')
        $(`[data-route="${lastRoute}"]`, '.menu').addClass('active')
    }
})

$('.menu').html(menu({router}))

router.resolve()

$(document).on('click', (e) => {
    let target = e.target || e.srcElement
    if (target && target.matches('[data-route]')) {
        let routeName = $(target).attr('data-route')
        router.go(routeName)
        if (e.preventDefault) e.preventDefault()
    }
})

//—————————————————//
// Event listeners //
//—————————————————//

let getEventInfos = el => {
    let eventInfos = {}

    for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++) {
        var attrName = atts[i].nodeName
        if (attrName.match(/^data-(click|change|input|space|enter|keyup)/i)) {
            let parts = attrName.split('-').map(x => x.toLowerCase())
            eventInfos[parts[1]] = { prevent: parts.includes('prevent'), value: atts[i].nodeValue }
        }
    }

    return eventInfos
}

;['click', 'keyup', 'keydown', 'change', 'input'].forEach(x => $(document).on(x, e => {
    let target = e.target || e.srcElement
    let eventInfos = getEventInfos(target)

    let which = e.which | e.keyCode
    let eventInfo = null

    if (e.type === 'click') eventInfo = eventInfos['click']
    else if (e.type === 'change') eventInfo = eventInfos['change']
    else if (e.type === 'input') eventInfo = eventInfos['input]']
    else if (e.type === 'keydown' && which === 32) eventInfo = eventInfos['space']
    else if (e.type === 'keydown' && which === 13) eventInfo = eventInfos['enter']
    else if (e.type === 'keyup') eventInfo = eventInfos['keyup']

    if (!eventInfo) return true
    if (eventInfo.prevent && e.preventDefault) e.preventDefault()

    let func = (eventInfo.value || '').trim()
    if (!func) return true

    try {
        let model = currentModel

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

    return true
}))