const Match = require('../models/Match');
const Turn = require('../models/Turn');
const Player = require('../models/Player');
const ships = require('../libs/ships');
const board = require('../libs/board');

const matchs = {};

const join = (room, playerName, socket) => {
    if (matchs[room]) {
        if (matchs[room][playerName]) {
            socket.emit('alreadyInRoom');
            return;
        }
        matchs[room].player2 = playerName;
        matchs[room][playerName] = new Player(socket);
        setTimeout(() => {
            startGame(room);
        }, 200);
    } else {
        matchs[room] = new Match();
        matchs[room].player1 = playerName;
        matchs[room][playerName] = new Player(socket);
        socket.emit('waitPlayer');
    }
}

const playHere = (room, playerName, socket) => {
    console.log(`O jogador ${playerName} mudou de aba.`);
    matchs[room][playerName].socket.disconnect();
    matchs[room][playerName].socket = socket;
    if (matchs[room].start)
        resumeGame(room, playerName)
}
const startGame = (room) => {
    let player1 = matchs[room].player1;
    let player2 = matchs[room].player2;
    matchs[room].turn = new Turn(player1, player2);
    createBoard(room, player1);
    createBoard(room, player2);
    matchs[room][player1].socket.broadcast.to(room).emit('startGame');
    matchs[room][player1].socket.emit('startGame');
    console.log('game started!');
    setTimeout(() => {
        matchs[room].start = true;
        changeTurn(room);
    }, 1000);
}

const resumeGame = (room, playerName) => {
    matchs[room][playerName].socket.emit('resumeGame',
        matchs[room][playerName].hit,
        matchs[room][playerName].miss,
        matchs[room][playerName].sink,
        matchs[room][playerName].score);
    if (matchs[room].turn.getMe() == playerName) {
        matchs[room][playerName].socket.emit('youTurn');
    } else {
        matchs[room][playerName].socket.emit('opponentTurn');
    }
}

const finishGame = (room) => {
    let me = matchs[room].turn.getMe();
    let he = matchs[room].turn.getHe();
    matchs[room][he].socket.emit('win');
    matchs[room][he].socket.disconnect();
    matchs[room][me].socket.emit('lose');
    matchs[room][me].socket.disconnect();
    matchs[room].start = false;
    setTimeout(() => {
        delete matchs[room];
    }, 3000);
}

const isStarted = (room) => {
    return matchs[room].start;
}

const existMatch = (room) => {
    return matchs[room];
}

const createBoard = (room, playerName) => {
    let player = matchs[room][playerName]
    player.ships = ships();
    player.board = board(player.ships);
}

const destroyed = (ship) => {
    return ship.filter(part => part.status == 'ok')
        .length == 0;
}

const sink = (room, playerName, ship) => {
    let shipId = [];
    ship.forEach(part => {
        setSink(room, playerName, part.position);
        shipId.push(part.position);
    });
    matchs[room][playerName].socket.emit('sink', shipId);
}

const verifyShips = (room, playerName) => {
    const opponent = matchs[room].turn.getHe();
    const ships = matchs[room][opponent].ships;
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (destroyed(ship)) {
            ships.splice(i, 1);
            sink(room, playerName, ship);
        }
    }
    if (allDestroyed(room, playerName)) {
        finishGame(room);
    }
}

const updateScore = (playerName) => {
    playerName.score += playerName.multi++;
}

const sendScore = (room, playerName) => {
    let score = matchs[room][playerName].score;
    matchs[room][playerName].socket.emit('updateScore', score);
}

const sendHit = (room, playerName, id) => {
    matchs[room][playerName].socket.emit('hit', id);
    console.log(`${playerName} hit: ${id}`);
}

const sendMiss = (room, playerName, id) => {
    matchs[room][playerName].socket.emit('miss', id);
    console.log(`${playerName} miss: ${id}`);
}

const setHit = (room, playerName, id) => {
    matchs[room][playerName].hit.push(id);
}

const setMiss = (room, playerName, id) => {
    matchs[room][playerName].miss.push(id);
}

const setSink = (room, playerName, id) => {
    matchs[room][playerName].hit.pop(id);
    matchs[room][playerName].sink.push(id);
}

const changeTurn = (room) => {
    matchs[room].turn.next();
    let me = matchs[room].turn.getMe();
    let he = matchs[room].turn.getHe();
    if (isStarted(room)) {
        matchs[room][me].socket.emit('youTurn');
        matchs[room][he].socket.emit('opponentTurn');
    }
}

const shot = (room, playerName, id) => {
    const opponent = matchs[room].turn.getHe();
    let board = matchs[room][opponent].board;
    let i = (id / 10) | 0; // pick a right value
    let j = id % 10; // pick a left value
    if (matchs[room].turn.getMe() != playerName) {
        matchs[room][playerName].socket.emit('NotIsYouTurn');
    } else if (board[i][j] == 'hited') {
        matchs[room][playerName].socket.emit('AlreadyHit');
    } else if (board[i][j] !== undefined) {
        board[i][j].status = 'destroyed';
        board[i][j] = 'hited';
        setHit(room, playerName, id);
        verifyShips(room, playerName);
        updateScore(matchs[room][playerName]);
        sendScore(room, playerName);
        sendHit(room, playerName, id);
        changeTurn(room);
    } else {
        setMiss(room, playerName, id);
        board[i][j] = 'hited';
        matchs[room][playerName].multi = 1;
        sendMiss(room, playerName, id);
        changeTurn(room);
    }
}

const allDestroyed = (room, playerName) => {
    return (matchs[room][playerName]
        .ships.length == 0);
}

exports.join = join;
exports.shot = shot;
exports.playHere = playHere;
exports.existMatch = existMatch;
exports.isStarted = isStarted;