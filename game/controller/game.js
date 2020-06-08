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
            matchs[room][player].socket = socket;
            if(matchs[room].start) resumeGame(room, player);
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
    }
}

const startGame = (room) => {
    let player1 = matchs[room].player1;
    let player2 = matchs[room].player2;
    matchs[room].turn = new Turn(player1, player2);
    createBoard(room, player1);
    createBoard(room, player2);
    matchs[room][player1].socket.broadcast.to(room).emit('startGame');
    matchs[room][player1].socket.emit('startGame');
    matchs[room].start = true;
    console.log('game started!');
}

const resumeGame = (room, player) => {
    matchs[room][player].socket.emit('resumeGame',
        matchs[room][player].hit,
        matchs[room][player].miss,
        matchs[room][player].sink);
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
}

const updateScore = (player) => {
    player.score += player.multi++;
}

const sendHit = (room, player, id) => {
    let score = matchs[room][player].score;
    matchs[room][player].socket.emit('hit', id, score);
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
        sendHit(room, player, id);
        matchs[room].turn.next();
    } else {
        setMiss(room, player, id);
        board[i][j] = 'hited';
        matchs[room][player].multi = 1;
        sendMiss(room, player, id);
        matchs[room].turn.next();
    }
}

function allDestroyed(room, player) {
    return (matchs[room][player].ships.length == 0);
}

exports.join = join;
exports.shot = shot;