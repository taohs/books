/**
 *
 */
require("http").createServer(function (req, res) {
    if ("/" ==req.url) {
        res.writeHead(200, { "Content-Type": "text/html; charset:utf-8" });
        res.end([
                '<form method="POST" action="/url">',
                '<h1>My form</h1>',
                '<fieldset>',
                '<lable>Personal infomation</lable>',
                '<p>What is your name?</p>',
                '<input type="text" name="name">',
                '<p><button>Submit</button></p>',
                '</form>'
        ].join(""));

    }else if ("/url" == req.url && "POST" == req.method) {
    
        var body = "";
        req.on("data", function (chunk) {
            body += chunk;
        });
        req.on("end", function () {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end("<p>Content- Type:" + req.headers["Content-Type"] + "</p>" + 
                    "<p>Data:</p><pre>" + body + "</p>");


            res.writeHead(200, { "Content-Type": "text/html"});
            res.end("You sent a <em>" + req.method + "</em> request");
        });
    }
}).listen(3000);
