const Match = require('../models/Match');

const matches = {};

const join = (room, playerName, socket) => {
    if (existMatch(room)) {
        if (matches[room][playerName]) {
            socket.emit('alreadyInRoom');
            return;
        }
        matches[room].setPlayer('player2', playerName, socket);
        setTimeout(() => {
            startGame(room);
        }, 200);
    } else {
        matches[room] = new Match();
        matches[room].setPlayer('player1', playerName, socket);
        socket.emit('waitPlayer');
    }
}

const playHere = (room, playerName, socket) => {
    matches[room].playHere(playerName, socket);
    if (matches[room].start)
        resumeGame(room, playerName);
}
const startGame = (room) => {
    matches[room].startGame();
    console.log('game started!');
}

const resumeGame = (room, playerName) => {
    matches[room].resumeGame(playerName);
}

const finishGame = (room) => {
    matches[room].finishGame();
    setTimeout(() => {
        delete matches[room];
    }, 3000);
}

const isStarted = (room) => {
    return matches[room].start;
}

const existMatch = (room) => {
    return matches[room];
}

const shot = (room, playerName, id) => {
    matches[room].shot(playerName, id);

    if (allDestroyed(room, playerName)) {
        finishGame(room);
    }
}

const allDestroyed = (room, playerName) => {
    return (matches[room][playerName]
        .ships.length == 0);
}

exports.join = join;
exports.shot = shot;
exports.playHere = playHere;
exports.existMatch = existMatch;
exports.isStarted = isStarted;
exports.start = startGame;