var fs = require("fs");
fs.readFile("/etc/passwd",function (err,data) {
    if(err){ console.log("error");return console.log(err);}
    console.log(data);
});
