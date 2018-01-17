
// 封装一个 Ajax 函数
var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

// 生成当日星期
var getWeek = (date) => {
    var d = date.toDateString()
    var w = d.slice(0, 3)
    var o = {
        Mon: '星期一',
        Tue: '星期二',
        Wed: '星期三',
        Thu: '星期四',
        Fri: '星期五',
        Sat: '星期六',
        Sun: '星期日',
    }
    var week = o[w]
    return week
}

// 生成当天具体日期和星期
var getCurrentDate = function() {
    var d = new Date()
    var dT = d.toLocaleDateString().split('/').join('-')
    var week = getWeek(d)
    var currentDate = dT + ' ' + week
    return currentDate
}

// 构造要插入的 html 文本
var templateDate = function(date) {
    var d = date
    var t = `
        <div class="date light">
            <div class="pot"></div>
            ${d}
        </div>
    `
    return t
}

// 将日期渲染至页面
var insertDate = function() {
    var d = getCurrentDate()
    var t = templateDate(d)
    var div = e('.time-date')
    appendHtml(div, t)
}

// 构造要插入的 html 文本
var templateTheme = function() {
    var t = `
        <div class="theme-list">
            <div class="theme" id="theme1" data-css="black"></div>
            <div class="theme" id="theme2" data-css="pink"></div>
            <div class="theme" id="theme3" data-css="blue"></div>
            <div class="theme" id="theme-menu-up">
                <span class="up glyphicon glyphicon-menu-up" aria-hidden="true"></span>
            </div>
        </div>
    `
    return t
}

// 将列表渲染至页面
var insertThemeList = function() {
    var t = templateTheme()
    var div = e('.main-menu')
    appendHtml(div, t)
}

var templatetodo = function(todo) {
    var id = todo.id
    var task = todo.task
    var d = new Date(todo.created_time * 1000)
    var time = d.toTimeString().split(' ')[0].slice(0, -3)
    var t = `
        <div class="todo-cell" data-id="${id}">
            <span class="start-at-time light">${time}</span>
            <div class="checked-box">
                <input type="checkbox" class="radio">
                <span class="" aria-hidden="true"></span>
            </div>
            <div class="task-name">
                <span class="todo-task">${task}</span>
                <div class="delete-icon">
                    <span class="icon glyphicon glyphicon-trash" aria-hidden="true"></span>
                </div>
            </div>

        </div>
    `
    return t
}

var insertTodo = function(todo) {
    var container = e('.yy-todo-cell')
    appendHtml(container, todo)
}

var insertTodoAll = function(todos) {
    var html = ''
    for (var i = 0; i < todos.length; i++) {
        var b = todos[i]
        var t = templatetodo(b)
        html += t
    }
    // 把数据写入 .timeline 中，直接用覆盖式写入
    var div = document.querySelector('.yy-todo-cell')
    // log(`html is (${html})`, typeof html)
        div.innerHTML = html
}

var clearInput = function() {
    var input = e('#input')
    input.value = ''
    input.blur()
}

var todoAll = function() {
    var request = {
        method: 'GET',
        url: '/api/todo/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            // log('响应', response)
            var todos = JSON.parse(response)
            window.todos = todos
            // 可以增加一个筛选获取的后端数据的函数 selectorData(todos)
            // 目的是把不属于当日日期的数据渲染进网页
            // todos = selectorData(todos)
            insertTodoAll(todos)
        }
    }
    ajax(request)
}

// 用 Ajax 发送数据添加新 todo 事件
var todoNew = function(form) {
    // var form = {
    //     task: "任务内容",
    // }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/todo/add',
        contentType: 'application/json',
        data: data,
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            // log('响应', response)
            var res = JSON.parse(response)
            var todo = templatetodo(res)
            insertTodo(todo)
            clearInput()
        }
    }
    ajax(request)
}

// 用 Ajax 发送数据更新 todo 完成状态
var todoUpdate = function(form, span) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/todo/update',
        contentType: 'application/json',
        data: data,
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            var res = JSON.parse(response)
            // log('todo 完成状态', res.done)
            span.classList.toggle('glyphicon')
            span.classList.toggle('glyphicon-ok')
        }
    }
    ajax(request)
}

// 用 Ajax 发送数据删除 todo
var todoDelete = function(form, todo) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/todo/delete',
        contentType: 'application/json',
        data: data,
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            var res = JSON.parse(response)
            // log('todo 删除 ', res.success)
            todo.remove()
        }
    }
    ajax(request)
}

// 当鼠标悬停在任务项上时有淡淡的标记，移出时取消
var bindEventMarkTask = function () {
    var container = e('.yy-todo-cell')
    // 鼠标移入
    container.addEventListener('mouseover', function(event) {
        // 为 任务框添加标记
        // log('event1==', event)
        var self = event.target
        var todoCell = self.closest('.todo-cell')
        if (todoCell !== null) {
            var task = todoCell.querySelector('.task-name')
            task.classList.add('marked')
        }
    })

    // 鼠标移出
    container.addEventListener('mouseout', function(event) {
        // 为 任务框添加标记
        // log('event2==', event)
        var self = event.target
        var todoCell = self.closest('.todo-cell')
        if (todoCell !== null) {
            var task = todoCell.querySelector('.task-name')
            task.classList.remove('marked')
        }
    })
}

// 展开主题列表
var bindEventThemeList = function() {
    var button = e('#theme-item')
    button.addEventListener('click', function(event) {
        var main = button.closest('.main-menu')
        var list = main.querySelector('.theme-list')
        if (list !== null) {
            list.remove()
        }
        insertThemeList()
    })
}

// 收起主题列表
var bindEventClearList = function() {
    var main = e('.main-menu')
    main.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('up')) {
            // log('click menu-up')
            var list = self.closest('.theme-list')
            list.remove()
        }
    })
}

var changeCss = function(css) {
    var link = e('.yy-theme')
    if (link != null) {
        link.remove()
    }
    // 加入现在的皮肤
    var head = e('head')
    var linkTag = `<link rel="stylesheet" href="/css/${css}.css" class="yy-theme">`
    appendHtml(head, linkTag)
}

// 切换皮肤
var bindEventChange = function() {
    var main = e('.main-menu')
    main.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('theme')) {
            // log('change skin')
            var css = self.dataset.css
            // log('css=', css)
            changeCss(css)
        }
    })
}

// 绑定添加新 todo 事件
var bindEventNew = function() {
    var button = e('#add-button')
    button.addEventListener('click', function(event) {
        // log('click new')
        // 得到用户填写的数据
        var task = e('#input').value
        var form = {
            task,
        }
        // 用这个数据调用 todoNew 来创建一条新任务
        todoNew(form)
    })
}

// 利用事件委托绑定更新 todo 完成状态的事件
var bindEventDone = function() {
    var container = e('.yy-todo-cell')
    container.addEventListener('click', function(event) {
        // 判断点击的是否是 input checked 选择框
        var self = event.target
        if (self.classList.contains('radio')) {
            log('click done-checked')
            var todoCell = self.closest('.todo-cell')
            var todoId = todoCell.dataset.id
            var box = self.closest('.checked-box')
            var span = box.querySelector('span')

            // 需要发送给后端的数据
            var task = e('.todo-task').innerHTML
            var form = {
                task,
                id: todoId,
                done: true,
            }
            // 用这个数据调用 todoUpdate 来更新一条任务完成状态
            todoUpdate(form, span)
        }

        // 利用事件委托绑定删除 todo 的事件
        if (self.classList.contains('icon')) {
            // log('click delete-button')
            var todoCell = self.closest('.todo-cell')
            var todoId = todoCell.dataset.id

            // 需要发送给后端的数据
            var task = e('.todo-task').innerHTML
            var form = {
                task,
                id: todoId,
            }
            // 用这个数据调用 todoUpdate 来删除一条 todo 任务
            todoDelete(form, todoCell)
        }
    })
}

// 绑定一个 keydown 事件，当输入完成后按回车键添加新 todo
var bindEventEnter = function() {
    var input = e('#input')
    input.addEventListener('keydown', function(event) {
        // log('keydown', event)
        if (event.key == 'Enter') {
            // log('按了回车键', event)
            // 取消事件的默认行为,
            event.preventDefault()
            var task = e('#input').value
            var form = {
                task,
            }
            // 用这个数据调用 todoNew 来创建一条新任务
            todoNew(form)
        }
    })
}

var bindEvents = function() {
    // 添加新的 todo
    bindEventNew()
    // 更新 todo 的状态
    bindEventDone()
    // 用'回车键'添加新 todo
    bindEventEnter()
    // 标记事件
    bindEventMarkTask()
    // 点击主题按钮出现换不同的主题皮肤的按钮列表
    bindEventThemeList()
    // 点击主题菜单收起按钮，菜单收起
    bindEventClearList()
    // 点击按钮切换皮肤
    bindEventChange()
}

var __main = function() {
    // 载入当日时间
    insertDate()
    // 载入 todo 列表
    todoAll()
    // 绑定事件
    bindEvents()
}

__main()
