var connect = require("connect");
var fs = require("fs");

var server = connect(
        connect.bodyParser(),
        connect.static("static"),
        function(req,res,next) {
            if("POST" == req.method && req.files) {
                //  console.log(req.method);
                
                    console.log(req.files.files.path);
                    fs.readFile(req.files.files.path,'utf8',function(err, data) {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error');
                            return;
                        }
                        res.writeHead(200, { "Content-Type": "text/html" } );
                        res.end([
                            '<h3>File: '+ req.files.files.name + "</h3>",
                            "<h4>Type: "+ req.files.files.type + "</h4>",
                            "<h4>Contents:</h4><pre>" + data + "</pre>"
                        ].join(""));
                    });
            } else {
                console.log(req.method);
                next();
            }

        } ).listen(3000);

/* server.use(function(req,res,next) { */
    // if("POST" == req.method) {
        // //  console.log(req.method);
        // console.log(req.body.file);
    // } else {
        // console.log(req.method);
        // next();
    // }
///* } */);
// server.listen(3000);
