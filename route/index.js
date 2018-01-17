// 访问主页的 api

// 后台将读取文件的数据返回给客户端（浏览器），再由浏览器将数据渲染成页面
// 封装的函数 sendHtml，用来执行上述操作
const sendHtml = (path, response) => {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

// 建立用 get 方法访问主页的 api
const index = {
    path: '/',
    method: 'get',
    func: (request, response) => {
        var path = 'todo_index.html'
        sendHtml(path, response)
    }
}

var routes = [
    index,
]

module.exports.routes = routes
