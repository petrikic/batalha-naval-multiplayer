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
            setTimeout(() => {
                $('#' + i + j).fadeIn(600);
            }, 12 * i * j + 200);
        }
    }
    setTimeout(() => {
        $('#hide_score').fadeIn(1000);
    }, 1200);
}
const updateScore = (score) => {
    $('#score').text(score);
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

const handleResume = (hitted, missed, sinked, score) => {
    createBoard();
    updateScore(score)
    hitted.forEach(e => {
        handleHit(e, score);
    });
    missed.forEach(e => {
        handleMiss(e);
    });
    sinked.forEach(e => {
        sink(e);
    });
}

const playHere = () => {
    socket.emit('playHere');
}

const alreadyInRoom = () => {
    let message = `Parece que você já está com uma
             aba do jogo aberta. Deseja jogar aqui?`;
    showMessage(message, 'Sim', playHere);
}

const connectionClosed = () => {
    let message = `A sua conexão foi encerrada. Deseja ir para a página inicial?`;
    showMessage(message, 'Sim', () => {
        location.href = '/';
    });
}

const youTurn = () => {
    showMessage('Sua vez de jogar.');
}

const opponentTurn = () => {
    showMessage('Vez do seu oponente jogar.');
}

socket.on('hit', handleHit);
socket.on('miss', handleMiss);
socket.on('sink', handleSink);
socket.on('updateScore', updateScore);
socket.on('startGame', createBoard);
socket.on('resumeGame', handleResume);
socket.on('alreadyInRoom', alreadyInRoom);
socket.on('disconnect', connectionClosed);
socket.on('youTurn', youTurn);
socket.on('opponentTurn', opponentTurn);


socket.emit('joinGame', room);

window.onbeforeunload = window.onunload = (e) => {
    socket.disconnect();
    return;
}