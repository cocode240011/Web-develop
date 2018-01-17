var log = console.log.bind(console)

// 选取一个元素
var e = function(selector) {
    var element = document.querySelector(selector)
    if (element == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

// 选取多个元素
var es = function(selector) {
    var elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

// 添加元素
var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

// 绑定事件
var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

// 移出所有 class
var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        log('classname', className, e)
        e.classList.remove(className)
    }
}

// 为多个元素绑定事件
var bindAll = function(selector, eventName, callback) {
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 函数可以查找 element 的所有子元素
var find = function(element, selector) {
    var e = element.querySelector(selector)
    if (e == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return e
    }
}

// 实现向上查找带有 class 的父元素的 closestClass 函数
var closestClass = function(element, className){
    var e = element
    while (e != null) {
        if (e.classList.contains(className)) {
            return e
        } else {
            e = e.parentElement
        }
    }
}

// 实现向上查找带有 id 的父元素的 closestClass 函数
var closestId = function(element, idName){
    var e = element
    while (e != null) {
        // 判断 e 是否包含 idName 这个 id
        if (e.id == idName) {
            return e
        } else {
            e = e.parentElement
        }
    }
}

// 实现向上查找带 tagName 的父元素的 closestClass 函数
var closestTag = function(element, tagName){
    var e = element
    while (e != null) {
        // 判断 e 是否和 tagName 相等
        if (e.tagName.toUpperCase() == tagName.toUpperCase()) {
            return e
        } else {
            e = e.parentElement
        }
    }
}

// 综合过后的向上查找父元素的 closest 函数
var closest = function(element, selector){
    var c = selector[0]
    if (c == '.') {
        var className = selector.slice(1)
        return closestClass(element, className)
    } else if (c == '#') {
        var idName = selector.slice(1)
        return cloestId(element, idName)
    } else {
        var tag = selector
        return closestTag(element, tag)
    }
}

// 在 element 上绑定一个事件委托,只会响应拥有 responseClass 类的元素
var bindEventDelegate = function(element, eventName, callback, responseClass) {
    element.addEventListener(eventName, function(event) {
        var self = event.target
        if (self.classList.contains(responseClass)) {
            callback(event)
        }
    })
}
