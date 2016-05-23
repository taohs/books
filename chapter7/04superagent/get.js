var request = require("superagent");
request.get("https://www.baidu.com").end(function(res){ console.log(res);});
