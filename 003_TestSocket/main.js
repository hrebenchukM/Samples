// подключение express и socket.io 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path'); 

var port = 8080; 


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var counter = 0;



// событие connection генерируется, когда socket.io клиент подключается к серверу
io.on('connection', function (socket) {//подписываемся на событие connection,io-это обьект сокета на стороне сервера
    // генерация нового события test 
    socket.emit('test', {
        counter: counter++
    });
    // событие disconnect генерируется, когда socket.io клиент отключается от сервера 
    socket.on('disconnect', function () {//socket.on-подписываемся на событие которое генерируется на клиенте
        console.log('user disconnected');
    });
    
    // socket.on('sendname',function(data){
    // console.log(data.username);
    // });
});


server.listen(port, function () {
    console.log('app running on port ' + port); 
})