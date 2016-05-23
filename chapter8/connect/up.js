var connect = require("connect");

var server = connect(
        connect.bodyParser(),
        connect.static("static"),
        function(req,res,next) {
            if("POST" == req.method) {
                //  console.log(req.method);
                console.log(req);
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
