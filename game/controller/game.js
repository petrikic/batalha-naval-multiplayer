const Match = require('../models/Match');
const Turn = require('../models/Turn');
const CreatePlayer = require('../models/Player');
const ships = require('../libs/ships');
const board = require('../libs/board');

const matchs = {};

const join = (room, player, socket) => {
    console.log(`join at ${room}`);
    if (matchs[room]) {
        if (matchs[room][player]) {
            socket.emit('alreadyInRoom');
            return;
        }
        matchs[room].player2 = player;
        matchs[room][player] = CreatePlayer(socket);
        setTimeout(() => {
            startGame(room);
        }, 100);
    } else {
        matchs[room] = Match();
        matchs[room].player1 = player;
        matchs[room][player] = CreatePlayer(socket);
        socket.emit('waitPlayer');
    }
}

const playHere = (room, player, socket) => {
    console.log(`O jogador ${player} trocou de aba.`);
    matchs[room][player].socket.disconnect();
    matchs[room][player].socket = socket;
    if (matchs[room].start)
        resumeGame(room, player)
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

const resumeGame = (room, player) => {
    matchs[room][player].socket.emit('resumeGame',
        matchs[room][player].hit,
        matchs[room][player].miss,
        matchs[room][player].sink,
        matchs[room][player].score);
    if (matchs[room].turn.getMe() == player) {
        matchs[room][player].socket.emit('youTurn');
    } else {
        matchs[room][player].socket.emit('opponentTurn');
    }
}

const finishGame = (room) => {
    let me = matchs[room].turn.getMe();
    let he = matchs[room].turn.getHe();
    matchs[room][me].socket.emit('win');
    matchs[room][me].socket.disconnect();
    matchs[room][he].socket.emit('lose');
    matchs[room][he].socket.disconnect();
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
    isDestroyed = true;
    for (let i = 0; i < ship.length; i++) {
        if (ship[i].status == 'ok') {
            isDestroyed = false;
        }
    }
    return isDestroyed;
}

const sink = (room, player, ship) => {
    let shipId = [];
    ship.forEach(part => {
        setSink(room, player, part.position);
        shipId.push(part.position);
    });
    matchs[room][player].socket.emit('sink', shipId);
}

const verifyShips = (room, player) => {
    const opponent = matchs[room].turn.getHe();
    const ships = matchs[room][opponent].ships;
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (destroyed(ship)) {
            console.log('ship destroyed');
            ships.splice(i, 1);
            sink(room, player, ship);
        }
    }
    if (allDestroyed(room, player)) {
        changeTurn(room);
        finishGame(room);
    }
}

const updateScore = (player) => {
    player.score += player.multi++;
}

const sendScore = (room, player) => {
    let score = matchs[room][player].score;
    matchs[room][player].socket.emit('updateScore', score);
}

const sendHit = (room, player, id) => {
    matchs[room][player].socket.emit('hit', id);
    console.log(`${player} hit: ${id}`);
}

const sendMiss = (room, player, id) => {
    matchs[room][player].socket.emit('miss', id);
    console.log(`${player} miss: ${id}`);
}

const setHit = (room, player, id) => {
    matchs[room][player].hit.push(id);
}

const setMiss = (room, player, id) => {
    matchs[room][player].miss.push(id);
}

const setSink = (room, player, id) => {
    matchs[room][player].hit.pop(id);
    matchs[room][player].sink.push(id);
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

const shot = (room, player, id) => {
    const opponent = matchs[room].turn.getHe();
    let board = matchs[room][opponent].board;
    let i = (id / 10) | 0; // pick a right value
    let j = id % 10; // pick a left value
    if (matchs[room].turn.getMe() != player) {
        matchs[room][player].socket.emit('NotIsYouTurn');
    } else if (board[i][j] == 'hited') {
        matchs[room][player].socket.emit('AlreadyHit');
    } else if (board[i][j] !== undefined) {
        board[i][j].status = 'destroyed';
        board[i][j] = 'hited';
        setHit(room, player, id);
        verifyShips(room, player);
        updateScore(matchs[room][player]);
        sendScore(room, player);
        sendHit(room, player, id);
        changeTurn(room);
    } else {
        setMiss(room, player, id);
        board[i][j] = 'hited';
        matchs[room][player].multi = 1;
        sendMiss(room, player, id);
        changeTurn(room);
    }
}

const allDestroyed = (room, player) => {
    return (matchs[room][player].ships.length == 0);
}

exports.join = join;
exports.shot = shot;
exports.playHere = playHere;
exports.existMatch = existMatch;
exports.isStarted = isStarted;