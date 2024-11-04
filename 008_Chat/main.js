// подключение express и socket.io 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path'); 

var port = 8080; 

// массив для хранения текущих подключений 
var connections = [];//(сокеты по факту, будет массив сокетов благодаря этому мы можем генерировать сообщения для всех сокетов, по факту каждый сокет это каждый отдельно взятый экземпляр клиента )

// массив для хранения текущих пользователей 
var users = [];//сохраняем  имена
// массив для хранения текущих сообщений 
var messages = []; //сохраням сообщени
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'auth.html')); 
});

app.get('/:id', function (req, res) {//начальна настройка гет запроса по айдишнику

    if (req.params.id == 'client.js') {
        res.sendFile(path.join(__dirname, 'client.js'));
    }
    else if (req.params.id == 'favicon.ico') {
        res.sendStatus(404); 
    }
    else {

        users.push(req.params.id);
        res.sendFile(path.join(__dirname, 'index.html'));
    }
   
})

// установка соединения, как только какой-то клиент присоединился
io.on('connection', function (socket) {
   
    connections.push(socket);//сокет этого клиента добавляем в массив сокетов
    console.log(users)//показываем массив пользователей
    console.log('Connected: %s sockets connected', connections.length);//показываем количество сокетов которые подключились 

    // окончание соединения 
    socket.on('disconnect', function (data) {
 
        var index = connections.indexOf(socket)//ищем этот сокет из массива connections

        // удалить разорванное соединение из списка текущих соединений 
        var deletedItem = connections.splice(index, 1);//удаляем сокет

        // удалить пользователя из массива текущих пользователей  
        users.splice(index, 1);//удаляем пользователя из массива текущих пользователей, индексы у юзеров и конекшонсов одинаковые 

        //генерируем новое событие чтоб обновить список пользователей на клиенте 
        io.sockets.emit('users loaded', { users: users })

        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // обработка сообщения 
    socket.on('send message', function (data) {//подписываемся на событие send message
        // сохранить сообщение
        messages.push(data);//добавляем сообщение от какого-то сокета в массив сообщений

        // сгенерировать событие chat message и отправить его дата всем доступным подключенным сокетам клиентам
        io.sockets.emit('chat message', data);
    });

    // загрузить пользователей
    socket.on('load users', function () {
        console.log(users)
        io.sockets.emit('users loaded', { users: users })//для всех юзеров всегда sockets
    });

    // загрузить сообщения
    socket.on('load messages', function () {
        socket.emit('messages loaded', { messages: messages })
    });

    // добавить нового пользователя в чат 
    socket.emit('new user', { name: users[users.length - 1] });//юзер добавлет свой список когда клиент подпишется на событие new user

}); 

server.listen(port, function () {
    console.log('app running on port ' + port);
})