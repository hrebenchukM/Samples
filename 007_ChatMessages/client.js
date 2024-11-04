window.onload = function () { 
//принцип сенд чат отправка получение 
    var btn = document.getElementById('btn'); 
    var message_input = document.getElementById('inp'); 
    var message_container = document.getElementById('messages'); 

    var socket = io.connect('http://26.222.247.153:8080');

    socket.on('chat message', function (message) {//все клиенты подписываются на событие сервера chat message
        console.log(message)
        // сгенерировать html блок разметку сообщения 
        var display_message = `<div class ="panel well">
                                   <h4>Message: </h4>
                                   <h5>${message.text}</h5>
                               </div>` 

        // добавить результат блок на страницу клиента
        message_container.innerHTML += display_message;

    })

    btn.onclick = function () {
        // сгенерировать событие отправки сообщения при нажатии на кнопку
        socket.emit('send message', { text: message_input.value }); 

    }
}