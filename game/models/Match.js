const Player = require('./Player');
const Turn = require('./Turn');
const ships = require('../libs/ships');
const board = require('../libs/board');
const matchDB = require('../../controller/match');

class Match {
    constructor() {
        this.player1 = undefined;
        this.player2 = undefined;
        this.turn = undefined;
        this.start = false;
    }

    setPlayer(type, playerName, socket) {
        this[type] = playerName
        this[playerName] = new Player(socket);
    }

    playHere(playerName, socket) {
        this[playerName].socket.disconnect();
        this[playerName].socket = socket;
    }

    __createBoard(player) {
        this[player].ships = ships();
        this[player].board = board(this[player].ships);
    }

    startGame() {
        const player1 = this.player1
        const player2 = this.player2
        this.turn = new Turn(player1, player2);

        this.__createBoard(player1);
        this.__createBoard(player2);

        this[player1].socket.emit('startGame');
        this[player2].socket.emit('startGame');
        setTimeout(() => {
            this.start = true;
            this.__changeTurn();
        }, 1000);
    }

    resumeGame(playerName) {
        this[playerName].socket.emit('resumeGame',
            this[playerName].hit,
            this[playerName].miss,
            this[playerName].sink,
            this[playerName].score);
        if (this.turn.getCurrent() == playerName) {
            this[playerName].socket.emit('youTurn');
        } else {
            this[playerName].socket.emit('opponentTurn');
        }
    }

    __saveMatch(winner, loser) {
        let match = {
            winner: winner,
            loser: loser,
            score: this[winner].score,
            timestamp: Date.now()
        }
        matchDB.insert(match);
    }

    finishGame() {
        const me = this.turn.getCurrent();
        const he = this.turn.getNext();
        this[me].socket.emit('win');
        this[me].socket.disconnect();
        this[he].socket.emit('lose');
        this[he].socket.disconnect();
        this.start = false;
        this.__saveMatch(me, he);
    }

    __changeTurn() {
        this.turn.next();
        const current = this.turn.getCurrent();
        const next = this.turn.getNext();
        if (this.start) {
            this[current].socket.emit('youTurn');
            this[next].socket.emit('opponentTurn');
        }
    }

    __updateScore(player) {
        player.score += player.multi++;
        player.socket.emit('updateScore', player.score);
    }

    __sendHit(player, id) {
        player.socket.emit('hit', id);
    }

    __sendMiss(player, id) {
        player.socket.emit('miss', id);
    }

    __setHit(player, id) {
        player.hit.push(id);
    }

    __setMiss(player, id) {
        player.miss.push(id);
    }

    __sink(playerName, ship) {
        const sinked = [];
        ship.forEach(part => {
            const pt = {};
            pt.position = part.position;
            pt.type = part.type;
            pt.orientation = part.orientation;
            sinked.push(pt);
            this[playerName].sink.push(pt);
        });
        this[playerName].socket.emit('sink', sinked);
    }

    __destroyed(ship) {
        return ship.destroyed >= ship.length;
    }

    __allDestroyed(playerName) {
        return (this[playerName]
            .ships.length == 0);
    }

    __verifyShips(playerName) {
        const opponent = this.turn.getNext();
        const ships = this[opponent].ships;
        for (let i = 0; i < ships.length; i++) {
            let ship = ships[i];
            if (this.__destroyed(ship)) {
                ships.splice(i, 1);
                this.__sink(playerName, ship);
            }
        }
    }

    shot(playerName, id) {
        const opponent = this.turn.getNext();
        let board = this[opponent].board;
        let i = (id / 10) | 0; // pick a right value
        let j = id % 10; // pick a left value
        if (this.turn.getCurrent() != playerName) {
            this[playerName].socket.emit('NotIsYouTurn');
        } else if (board[i][j] == 'hited') {
            this[playerName].socket.emit('AlreadyHit');
        } else if (board[i][j] !== undefined) {
            board[i][j].ship.destroyed++;
            board[i][j] = 'hited';
            this.__verifyShips(playerName);
            this.__setHit(this[playerName], id);
            this.__updateScore(this[playerName]);
            this.__sendHit(this[playerName], id);
            this.__changeTurn();
        } else {
            board[i][j] = 'hited';
            this.__setMiss(this[playerName], id);
            this.__sendMiss(this[playerName], id);
            this[playerName].multi = 1;
            this.__changeTurn();
        }
    }

}
module.exports = Match;