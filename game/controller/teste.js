const Turn = require('../models/Turn');
const game = require('./game');

const socket = 'meusocket';
const room = 'minhasala';
const p1 = 'p1';
const p2 = 'p2';

game.join(room, p1, socket);
game.join(room, p2, socket);

game.shot(room, p1, 1);
game.shot(room, p2, 1);
game.shot(room, p1, 2);
game.shot(room, p2, 2);
game.shot(room, p1, 3);
game.shot(room, p2, 3);
game.shot(room, p1, 4);
game.shot(room, p2, 4);
game.shot(room, p1, 5);
game.shot(room, p2, 6);


