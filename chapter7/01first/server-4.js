require('http').createServer(function (req, res) {
    res.writeHead("200",{ "content-type":"text/html" });
    res.write("Hello");
    setTimeout(function () {
        res.end("Hello <b>world</b>");
    },10000);

}).listen("3000");
