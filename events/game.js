exports.use = (io) => {
    const rooms = require('../controller/room');
    const game = require('../game/controller/game');

    io.on("connection", client => {
        let player = client.handshake.session.user;
        let room;
        client.on('joinGame', (roomName) => {
            if (rooms.exists(roomName)) {
                rooms.setTo(roomName, player);
                game.join(roomName, player, client);
                client.join(roomName);
                room = roomName;
                console.log(`O cliente ${client.id} se conectou a sala ${room}`);
            }
        });
        client.on('click', (id) => {
            if (game.existMatch(room) && game.isStarted(room))
                game.shot(room, player, id);
        });
        client.on('playHere', () => {
            game.playHere(room, player, client);
        });
        client.on('disconnect', () => {
            if (room) {
                rooms.unsetTo(room, player);
                setTimeout(() => {
                    if (!io.sockets.adapter.rooms[room]) {
                        console.log(`Fechando a sala: ${room}`);
                        rooms.remove(room);
                        client.broadcast.emit('closeRoom', room);
                    }
                }, 800);
            }
        });
    });
}