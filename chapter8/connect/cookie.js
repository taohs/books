var connect = require("connect");
var server = connect.createServer();

server.use(connect.cookieParser());

server.use(function (req, res, next) {
    req.cookies.secret1 = "value1";
    req.cookies.name = "value2";
    next();
});
server.listen(3000);
