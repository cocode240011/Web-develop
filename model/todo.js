// 帮助后台 api 处理 todo 数据的文件

const fs = require('fs')

const todoFilePath = 'db/todo.json'


// 这是一个用来存储 todo 数据的对象
var ModelTodo = function(form) {
    console.log('form in model', form)
    this.task = form.task || ''
    // 生成一个 unix 时间
    this.created_time = Math.floor(new Date() / 1000)
}

const loadTodos = () => {
    // 确保文件有内容，暂不考虑文件不存在或者内容错误的情况
    var content = fs.readFileSync(todoFilePath, 'utf8')
    var todos = JSON.parse(content)
    // console.log('load todos', todos)
    return todos
}


// b有一个 data 属性用来存储所有的 todos 对象
var b = {
    data: loadTodos(),
}

// 它有 all 方法返回一个包含所有 todo 的数组
b.all = function() {
    var todos = this.data
    return todos
}

// 它有 new 方法来在数据中插入一个新的 todo 并且返回
b.new = function(form) {
    console.log('form in new', form)
    var m = new ModelTodo(form)
    // console.log('new todo', form, m)
    // 设置新数据的 id
    var d = this.data[this.data.length - 1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把数据加入 this.data 数组
    this.data.push(m)
    // 把最新数据保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

/*
它能够删除指定 id 的数据
删除后保存修改到文件中
*/
b.delete = function(id) {
    var todos = this.data
    var found = false
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        if (todo.id == id) {
            found = true
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    todos.splice(i, 1)
    return found
}


var doneChange = function(todo, form) {
    if (!todo.done) {
    todo.done = form.done
    } else {
    todo.done = false
    }
    return todo
}

//它有 update 方法来更新任务状态
b.update = function(form) {
    // console.log('form-up=', form)
    var data = this.data
    id = Number(form.id)
    // 在 data 中找到 id 对应的数据, 更新它的done属性
    var index = -1
    for (var i = 0; i < data.length; i++) {
        var t = data[i]
        if (t.id == id) {
            // 找到了
            index = i
            break
        }
    }
    // 判断 index 来查看是否找到了相应的数据
    if (index > -1) {
        // 找到了, 原todo数据的done属性被新输入数据的done改变
        var t = doneChange(t, form)
        return t
    } else {
        // 没找到
        return {}
    }
}


// 它有 save 方法来保存更改到文件中
b.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFile(todoFilePath, s, (error) => {
        if (error != null) {
            console.log('error', error)
        } else {
            console.log('保存成功')
        }
    })
}


module.exports = b
