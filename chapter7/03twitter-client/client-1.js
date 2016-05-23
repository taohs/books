require("http").request({
    host: "baidu.com",
    port: 443,
    url: "/",
    method: "GET"
}, function (res) {
    var body = "";
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        body += chunk;
    });
    res.on("end", function () {
        console.log("\n We got: \033[96m" + body + "\033[39m\n");
    });
}).end();
