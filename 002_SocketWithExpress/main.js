// подключение express и socket.io 
var app = require('express')();//подключаем експресс и создаем экземпляр 
var server = require('http').Server(app);//подключаем и создаем экзмепляр
var io = require('socket.io')(server);//подключаем и создаем экзмепляр

var path = require('path'); 

var port = 8080; 

app.get('/', function (req, res) {//обрабатываем гет запрос, отправляем в компонент мидлвер свой обработчик
    res.sendFile(path.join(__dirname, 'index.html'));
});//по сути это заменяет функцию handler с первого примера ибо у нас есть експресс

io.on('connection', function (socket) {//подписываемся на событие connection
   
    // метод send автоматически генерирует событие 'message'
    socket.send('Hello world')//отправили сообщение

    // обработка события 
    socket.on('greeting', function (data) {//подписались на событие greeting
        console.log(data);
    });
}) 

server.listen(port, function () {
    console.log('app running on port ' + port); 
})