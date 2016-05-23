window.onload = function () {
    var socket = io.connect();

    socket.on("connect", function () {
        socket.emit("join", prompt("What is your nickname"));

        document.getElementById('chat').style.display = 'block';
    });


    socket.on('annoucement',function (msg) {
        var li = document.createElement('li');
        li.className = 'annoucement';
        li.innerHTML = msg;
        document.getElementById('messages').appendChild(li);
    });

    socket.on('text',addMessage);
    var input = document.getElementById('input');
    document.getElementById('form').onsubmit = function () {
        socket.emit('text', input.value);
        addMessage('me',input.value);

        input.value = '';
        input.focus();

        return false;
    }

    function addMessage (from, text) {
        var li = document.createElement('li');
        li.className = 'message';
        li.innerHTML = '<b>' + from + '</b>: ' + text;
        document.getElementById('messages').appendChild(li);
    }
}
