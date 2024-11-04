// подключение express и socket.io 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);//сокет ио - это библиотека работающая по событийно-ориентированной модели.То есть клиент и сервер не общаются друг с другом через http протокол(например rest архитектура) . Они тут общаются друг с другом на основе собыйтий(сервер генерирует событие , клиент подписывается на это событие.Клиент обрабатывает событие и генерирует другое событие на которое подписывается сервер )

var path = require('path'); 

var port = 8080; 

//создаем компонент мидлвер для обработки гет запроса
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));//отправили файлик
});

// пространства имен в socket.io создаются с помощью функции io.of('namespace_name') 
var namespace = io.of('/namespace'); //создаю пространство имен чтоб изолировать определнные фрагменты друг от друга чтоб не было конфликта при одинаковых идентификаторах 

// подключение к именному пространству socket.io 
namespace.on('connection', function (socket) {//в рамках неймспейса создаю обработчик для события конекшен
    console.log('connected to namespace');
    // генерация нового события под названием  greet 
    namespace.emit('greet', { message: 'Hello from namespace!' });

});
server.listen(port, function () {
    console.log('app running on port ' + port);
});