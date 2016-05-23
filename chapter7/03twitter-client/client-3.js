/**
 * twitter api
 *
 */

var qs = require("querystring"),
    http = require("https");

//var search = process.argv.slice(2).join("").trim();

//if (!search.lenth) {
    //    return console.log("\n Usage: node tweets <search term>\n");
//}
//console.log("\n search for: \033[96m" + search + "\033[39m\n");

http.request({
    host: "api.github.com",
    headers:{
        "User-Agent":  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/601.5.17 (KHTML, like Gecko) Version/9.1 Safari/601.5.17"
    }
}, function (res) {
    var body = "";
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        body += chunk;
    });

    res.on("end", function () {
       // console.log(body);
         var obj = JSON.parse(body);
        // console.log(obj);
        //    console.log(obj.current_user_url);
        //    console.log(obj.results);
        for ( var item in obj){
            console.log(item);
        }
      //   obj.each(function (tweet) {
      //     console.log(" \033[90m" + tweet + "\033[39m");

      //             console.log(" \033[94m" + tweet.from_user + "\033[39m");
      //             console.log("--");
      //  });
    });
}).end();
