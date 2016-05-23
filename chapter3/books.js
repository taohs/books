var books = [
    'Metamorphosis',
    'Crime and punishment'
];

function serveBooks () {
    var html = '<b>'  + books.join('</b><br><b>') + '</b>';

    books = [];

    return html;
}


var http =  require("http");
http.createServer(function(req,res) {
    res.end(serveBooks());
}).listen(3000);
