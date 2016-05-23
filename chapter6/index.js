/**
 * module dependencies
 */

var net = require("net");
var count = 0, 
    users = {};
var server = net.createServer(function (conn) {

    var nickname;
    conn.setEncoding("utf8");
    //
    // handle connection
    console.log("\033[90m  new connection \033[39m");
    conn.write(
            "\n > welcome to \033[92mnode-chat\033[39m!" + 
            "\n >" + count + " other people are connected at this time." + 
            "\n > Please write your name and press enter:"
            );
    count++;

    conn.on("data",function(data){
        data = data.replace('\r\n','');
        if (!nickname) {
            if (users[data]) {
                conn.write("\033[93m > nickname already in use. try again:\033[39m ");
                return ;
            } else {
                nickname = data;
                users[nickname] = conn;

                for ( var i in users) {
                    broadcast("\33[90m " + nickname + " joined the room\00[39m\n");
                }
            }
        } else {
            // for (var i in users) {
                if(i != nickname) {
                    broadcast("\033[96m > " + nickname + ":\033[39m " + data + "\n");
                }
            // }


        }
        //console.log(data);
        //conn.write(data);
    });
    conn.on("close",function(){
        count--;
        delete users[nickname];
        broadcast("\033[90m > " + nickname + " left the romm\033[39m\n");
    });

    function broadcast (msg, exceptMyself) {
        for (var i in users) {
            if (!exceptMyself || i != nickname) {
                users[i].write(msg);
            }
        }
    }

});

server.listen(3000,function() {
    console.log("\033[96m  server listen on *:3000 \033[39m");
});

