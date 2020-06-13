function Player(socket) {
    this.socket = socket;
    this.score = 0;
    this.multi = 1;
    this.board = undefined;
    this.ships = undefined;
    this.hit = [];
    this.miss = [];
    this.sink = [];
}

module.exports = Player;