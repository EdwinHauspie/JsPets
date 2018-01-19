const funcs = {
    //Don't use fat arrows because it changes the meaning of this
    addClass: function (className) {
        this.forEach(x => x.classList.add(className))
        return this
    },
    removeClass: function (className) {
        this.forEach(x => x.classList.remove(className))
        return this
    },
    html: function (newHtml) {
        if (!newHtml) return (this[0] || {}).innerHTML
        if (this.length) this[0].innerHTML = newHtml
        return this
    },
    focus: function () {
        if (this.length) this[0].focus()
    },
    closest: function (selector) {
        return this.length ? this[0].closest(selector) : w.$([])
    },
    on: function (eventName, handler) {
        if (this.length) {
            if (window.document.attachEvent) this[0].attachEvent('on' + eventName, handler)
            else this[0].addEventListener(eventName, handler)
        }
        return this
    },
    replaceWith: function (newEl) {
        if (this.length) {
            this[0].parentNode.replaceChild(newEl instanceof Array ? newEl[0] : newEl, this[0])
            this[0] = newEl
        }
        return this
    },
    remove: function () {
        if (this.length) {
            this.forEach(x => x.parentNode.removeChild(x))
        }
    },
    attr: function (attrName, attrValue) {
        if (attrValue) {
            this.forEach(x => x.setAttribute(attrName, attrValue))
            return this
        }
        else if (attrValue === null) {
            this.forEach(x => x.removeAttribute(attrName))
            return this
        }
        return this[0].getAttribute(attrName)
    },
    toArray: function() {
        let output = []
        for (let i = 0; i < this.length; i++) output.push(this[0])
        return output
    }
}

const eQuery = function (selector, ctx) {
    let results = []

    if (selector.nodeType) results.push(selector)
    else if (selector instanceof Array) results = selector
    else {
        if (!ctx) ctx = window.document
        else if (typeof ctx === 'string') ctx = window.document.querySelector(ctx)
        results = [].slice.call(ctx.querySelectorAll(selector))
    }

    Object.keys(funcs).forEach(f => results[f] = funcs[f])
    return results
}

eQuery.get = viewUrl => fetch(viewUrl).then(r => r.status !== 200 ? `${r.status} ${r.statusText} ${viewUrl}` : r.text())

//export default eQuery
module.exports = eQuery