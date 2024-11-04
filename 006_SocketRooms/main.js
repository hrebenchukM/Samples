// подключение express и socket.io 
//пример с тематическими чатами 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path'); 

var port = 8080; 

app.get('/', function (req, res) {//в целом гет запрос всего приложения
    res.sendFile(path.join(__dirname, 'index.html'));
});

// создать пронстранство имен
var namespace = io.of('/namespace'); 

// подключение к пространству имен 
namespace.on('connection', function (socket) {
    console.log('connected to namespace');

    var room = ''; //создаем комнату 
    // в каждом пространстве имен может быть выделена отдельная комната(room) - канал связи с произвольным названием  
    socket.on('btn_click', function (data) {//начинаю обрабатывать событие btn_click от клиента
        if (data.btn == 1) {

            room = 'demo room 1'; 
            // подключение к комнате 1
            socket.join(room);//выполняю соединение
            socket.emit('room_join', { roomname: 1 });//генерирую событие room_join и передаю туда имя 1 

        } else if (data.btn == 2) {

            room = 'demo room 2'; 
            // подключение к комнате 2
            socket.join(room);
            socket.emit('room_join', { roomname: 2 });
        }

        socket.on('get_greeting', function () {//подписываемся на событие get_greeting
            // метод to позволяет генерировать события, которые будут отправлены указанной комнате(какая комната будет генерировать события по факту)
            namespace.to('demo room 1').emit('greet', { message: 'Hello from room 1!' });
            namespace.to('demo room 2').emit('greet', { message: 'Hello from room 2!' });

        });
    });
});


server.listen(port, function () {
    console.log('app running on port ' + port);
})