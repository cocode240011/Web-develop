// 处理 todo 数据的后端 api
const todo = require('../model/todo')

const all = {
    path: '/api/todo/all',
    method: 'get',
    func: (request, response) => {
        var todos = todo.all()
        var r = JSON.stringify(todos, null, 2)
        response.send(r)
    }
}

const add = {
    path: '/api/todo/add',
    method: 'post',
    func: (request, response) => {
        // 浏览器发过来的数据 form（表单）
        var form = request.body
        // 插入新数据并返回
        var b = todo.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}


// 请求 POST /api/todo/delete 来删除一个 todo
// 用 deleteTodo 删除
const deleteTodo = {
    path: '/api/todo/delete',
    method: 'post',
    func: (request, response) => {
        // 浏览器发过来的数据 form（表单）
        var form = request.body
        // 删除数据并返回结果
        var success = todo.delete(form.id)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

// 请求 POST /api/todo/update 来更新一个 todo 状态
// 用 updateTodo 更新
const updateTodo = {
    path: '/api/todo/update',
    method: 'post',
    func: (request, response) => {
        // 浏览器发过来的数据 form（表单）
        var form = request.body
        // 更新数据并返回结果
        var result = todo.update(form)
        var r = JSON.stringify(result)
        response.send(r)
    }
}



var routes = [
    all,
    add,
    deleteTodo,
    updateTodo,
]

module.exports.routes = routes
