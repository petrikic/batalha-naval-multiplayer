function Turn(player1, player2) {
    this.player = [];
    this.player.push(player1, player2);
    this.shift = 1;
}

Turn.prototype.getMe = function () {
    return this.player[this.shift];
}

Turn.prototype.getHe = function () {
    return this.player[(this.shift + 1) % 2];
}

Turn.prototype.next = function () {
    this.shift = ++this.shift % 2
}

module.exports = Turn;