// подключение express и socket.io 
//принцип сенд чат отправка получение 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path'); 

var port = 8080; 

// массив для хранения текущих подключений 
var connections = [];//нужен чтоб сохранять данные пользователей которые подключаются к нам

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/client.js', function (req, res) {//разделили скрипт от штмл разметки просто , в случае если клиентска программа работает на одном хостинге а сервер на другом хостинге
    res.sendFile(path.join(__dirname, 'client.js')); 
});

// установка соединения
io.on('connection', function (socket) {

    connections.push(socket);//socket добавляется в наш массив connections, типо вектор под капотом
    console.log('Connected: %s sockets connected', connections.length); //показали на стороне сервера что сокет присоединяется

    // окончание соединения 
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);//indexOf ищем этот сокет и splice удаляет его и сдвигает освобождает место 
        console.log('Disconnected: %s sockets connected', connections.length); 
    })

    socket.on('send message', function (data) {//подписываемся на событие send message от клиента
        // сгенерировать новое событие chat message и отправить его всем доступным подключениям 
        io.sockets.emit('chat message', data); // у нас есть массив сокетов, похоже на мультикаст,  всем подписчикам(всем подключеннім сокетам) генерирую событие chat message и передаю всем данные дата- проблема дублирования информации у каждого клиента
    })
})

server.listen(port, function () {
    console.log('app running on port ' + port); 
})