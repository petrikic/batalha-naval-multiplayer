class Turn {
    constructor(player1, player2) {
        this.player = [];
        this.player.push(player1, player2);
        this.shift = 1;
    }

    getCurrent() {
        return this.player[this.shift];
    }

    getNext() {
        return this.player[(this.shift + 1) % 2];
    }

    next() {
        this.shift = ++this.shift % 2
    }
}

module.exports = Turn;