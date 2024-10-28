// подключение express и socket.io 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path'); 

var port = 8080; 


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var sumPrice = 0;
let products = [
    { name: 'Картошечка', price: 35 },
    { name: 'Бургер', price: 50 },
    { name: 'Курочка', price: 70 },
    { name: 'Сок', price: 20 },
    { name: 'Мороженое', price: 40 }
];

// событие connection генерируется, когда socket.io клиент подключается к серверу
io.on('connection', function (socket) {//подписываемся на событие connection,io-это обьект сокета на стороне сервера
    
    console.log('user connected');

    socket.on('sendorder', function (data) {
        let order = data.userorder;
        let sumPrice = 0;

        for (let o of order) {
            for (let product of products) {
                if (product.name === o.name) {
                    sumPrice += product.price * o.count;
                    break;
                }
            }
        }
    
    
    // генерация нового события cost 
    socket.emit('cost', { sum: sumPrice });

});





    // событие disconnect генерируется, когда socket.io клиент отключается от сервера 
    socket.on('disconnect', function () {//socket.on-подписываемся на событие которое генерируется на клиенте
        console.log('user disconnected');
    });
    
    
});


server.listen(port, function () {
    console.log('app running on port ' + port); 
})