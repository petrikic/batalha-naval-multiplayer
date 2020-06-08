var socket = io('localhost:3000');

let room = window.location.href.split('/')[5];

socket.emit('joinGame', room);

function renderMessage(value) {
    $('.messages').append('<div class = "message"><strong>' + value.author + '</strong>: ' + value.message + '</div>');
}


socket.on('startGame', () => {
    renderMessage({author:'Game Start', message: 'Game Start'});
});

socket.on('previousMessages', function (messages) {
    for (message of messages) {
        renderMessage(message);
    }
});

socket.on('receivedMessage', value => {
    renderMessage(value);
})

$('#chat').submit(function (event) {
    event.preventDefault();

    let value = $('input[name = message]').val();
    $('input[name = message]').val("");

    if (value.length) {
        socket.emit('sendMessage', value);
    }
});