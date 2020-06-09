var socket = io('localhost:3000', {
    transports: ['websocket'],
    upgrade: false
});
let room = window.location.href.split('/')[5];

const createSquare = (i, j) => {
    let square = document.createElement('div');

    square.innerText = '';

    square.className = 'square sea';
    square.addEventListener('click', onClick)
    square.id = [i, j].join('');

    return square;
}

const onClick = (event) => {
    event.preventDefault()
    socket.emit('click', event.target.id)
}

const createBoard = () => {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            $('#root').append(createSquare(i, j));
        }
    }
}

const updateScore = (score) => {
    $('#score').val(score);
}

const handleHit = (id) => {
    $('#' + id).toggleClass('hit');
}

const handleMiss = (id) => {
    $('#' + id).toggleClass('miss');
}

const sink = (id) => {
    $('#' + id).toggleClass('sink');
}

const handleSink = (ship) => {
    ship.forEach(id => {
        sink(id);
    });
}

const handleResume = (hitted, missed, sinked) => {
    createBoard();
    hitted.forEach(e => {
        handleHit(e);
    });
    missed.forEach(e => {
        handleMiss(e);
    });
    sinked.forEach(e => {
        sink(e);
    });
}

const playHere = () => {
    alert('teste playhere');
}

const alreadyInRoom = () => {
    $("#msg").append(`<div class="message"  
  role="alert">Parece que você já está com uma aba do jogo aberta. Deseja jogar aqui?
  <button class="btn btn-lg btn-primary btn-block" onclick="refresh()">Sim</button></div>`).hide().fadeIn(600);
}

socket.on('hit', handleHit);
socket.on('miss', handleMiss);
socket.on('sink', handleSink);
socket.on('startGame', createBoard);
socket.on('resumeGame', handleResume);


socket.emit('joinGame', room);

window.onbeforeunload = window.onunload = (e) => {
    socket.emit('refresh');
    socket.disconnect();
    return;
}