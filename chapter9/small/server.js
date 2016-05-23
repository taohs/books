var express = require("express");
var search = require("./search-1");

var app = express.createServer();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false });

console.log(app.set("views"));

app.get("/",function(req, res, next) {
    res.render("index");
});
app.get("/search",function(req, res, next) {
    search(req.query.q, function (err, tweets) {
        if (err) {
            return next(err);
        }
        console.log("\n ============== \n");
        console.log("\n ============== \n");
        console.log("\n ============== \n");
        console.log("\n ============== \n");
        console.log(err);
        console.log(tweets);
        //res.write("hello");

//      var tweets = [{id:100,name:"taohs",text:"taohs_text",from_user:"100"},{id:200,name:"hqn"}];
        res.render("search-1", { results:tweets, search: "123"});
    });
});
app.listen(3000);
