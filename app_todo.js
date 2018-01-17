// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))


const registerRoutes = (app, routes) => {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}



// 导入 route/index.js 的所有路由数据
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

// 导入 route/todo.js 的所有路由数据
const routeTodo = require('./route/todo')
registerRoutes(app, routeTodo.routes)


// listen 函数
var server = app.listen(8000, () => {
    var host = server.address().address
    var port = server.address().port

    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
