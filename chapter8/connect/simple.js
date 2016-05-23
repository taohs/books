/**
 * 模块依赖
 */

var connect = require("connect"),
    time = require("./request-time");

/**
 * 创建服务器
 */

var server = connect.createServer();

/**
 * 记录请求情况
 */
server.use(connect.logger('dev'));

/**
 * 实现时间中间件
 */

server.use(time({ time: 500}));

/**
 * 快速响应/
 */

server.use(function (req, res, next) {
    if ('/a' == req.url) {
        res.writeHead(200);
        res.end("fast");
    } else {
        next();
    }
});

/**
 * 慢速响应
 */

server.use(function (req, res, next) {
    if("/b" == req.url) {
        setTimeout(function() {
            res.writeHead(200);
            res.end("Slow");
        } , 1000);
    } else {
        next();
    }
});

/**
 * 处理静态文件
 */

//server.use(connect.static(__dirname + "/../website"));
server.use("/images",connect.static("./website/images"));

/**
 * 监听
 */

server.listen(3000);

