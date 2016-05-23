var express = require('express'),
    wsio = require('websocket.io');

/**
 * create express app
 */

var app = express.createServer();

/**
 * Attach websocket server
 */

var ws = wsio.attach(app);

/**
 * Serve your code
 */

app.use(express.static("public_mouse"));

/**
 * Listening on connections
 */

var connect_echo = function (socket) {
//...
        socket.on("message", function (msg) {
            console.log("\033[96mgot:\033[39m " +  msg);
            socket.send('pong');
        });
};

var positions = {},
    total = 0;
var connect_mouse = function (socket) {

    //you give the socket an id
    socket.id = ++total;
    //you send the positions of every one else
    socket.send(JSON.stringify(positions));

    socket.on("message", function (msg) {
        try{
            var pos = JSON.parse(msg);
        } catch (e) {
            return ;
        }
        positions[socket.id] = pos;

        broadcast(JSON.stringify({ type: 'position',pos:pos,id:socket.id}));
    });

    socket.on("close", function (){
        delete positions[socket.id]; 

        broadcast(JSON.stringify({ type: 'disconnect',id:socket.id}));
    });

    function broadcast(msg) {
        for (var i = 0, l = ws.clients.length; i < l; i++ ) {
            // you avoid sending a message to the same socket that broadcats
            //if (ws.clients[i] && socket.id != ws.clients[i].id) {
                // you call 'send' on the other clients;
               ws.clients[i] && ws.clients[i].send(msg);
           // }
        }
    }
}



ws.on("connection",connect_mouse);

/**
 * Listen
 */
app.listen(3000);
