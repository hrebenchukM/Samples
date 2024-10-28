var app = require('http').createServer(handler)//стандарт родное для нода
var io = require('socket.io')(app);//сразу создали єкземпляр апп

var fs = require('fs');
var path = require('path'); 

var port = 8080; 

function handler(req, res) {//отвечает за запись заголовка
    // чтение файла index.html 
    fs.readFile(path.join(__dirname, 'index.html'),
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
}

io.on('connection', function (socket) {//on-подписываемся на событие конекшен,сокет попадает в цункцию обработчик
    // генерация событий, которые будут переданы клиенту 
    socket.emit('news', { greeting: 'Hello World!' });//emit -генерация нового события , которое отправляет обьект с ключом greeting и текстом 
    socket.on('greeting', function (data) {//подписываемся на событие greeting и передаем эти данные на консоль
        console.log(data);
    });
})


app.listen(port, function () {
    console.log('app running on port ' + port); 
});
