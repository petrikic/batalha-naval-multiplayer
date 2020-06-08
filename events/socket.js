module.exports = (server) => {
    const io = require('socket.io')(server);
    const rooms = require('./rooms');
    const online = require('./online');
    const game = require('./game');

    rooms.use(io);
    online.use(io);
    game.use(io);

    return io;
}