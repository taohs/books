require('http').createServer(function (req, res) {
    res.writeHead("200",{ "content-type":"text/html" });
    res.end("Hello <b>world</b>");

}).listen("3000");
