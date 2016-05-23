require('http').createServer(function (req, res) {
    res.writeHead("200",{ "content-type":"image/jpeg" });
    var stream = require("fs").createReadStream(__dirname + "/images/image.jpg");
    stream.on("data", function (data) {
        res.write(data);
    });
    stream.on("end", function () {
        res.end();
    });
    setTimeout(function () {
        res.end("Hello <b>world</b>");
    },10000);

}).listen("3000");
