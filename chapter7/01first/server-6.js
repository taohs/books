require('http').createServer(function (req, res) {
    res.writeHead("200",{ "content-type":"image/jpeg" });
    var stream = require("fs").createReadStream(__dirname + "/images/image.jpg").pipe(res);

}).listen("3000");
