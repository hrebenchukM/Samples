// подключение express и socket.io 
//в данном примере мы подняли несколько клиентов, но в одном интерфейсе поэтому структуру странички просто разделии на 2 части
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path'); 

var port = 8080; 
app.get('/', function (req, res) {//гет запрос отправляет страничку
    res.sendFile(path.join(__dirname, 'index.html'));
});
io.on('connection', function (socket) {    //подписываемся на событие connection
    // отправка данных клиенту 
    socket.emit('data', { message: 'data from server' }); //сокет генерирует новое событие data и отправляет в обработчик этого события обьект message с текстом 
    // подтверждение получения данных клиентом 
    socket.on('response', function (data) {//сам подписывается на событие response
        console.log(data.message);
    });
});
server.listen(port, function () {
    console.log('app running on port ' + port); 
})