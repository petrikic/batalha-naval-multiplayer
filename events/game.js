exports.use = (io) => {
    const rooms = require('../controller/room');
    const game = require('../game/controller/game');

    io.on("connection", client => {
        let player = client.handshake.session.user;
        let room;

        client.on('newGame', (players) => {
            let room = rooms.create()


            io.to(players.player1).emit('room', room);
            io.to(players.player2).emit('room', room);

        });
        client.on('invite', invited => {
            io.to(invited).emit('invited', players = {
                player1: player,
                player2: invited
            });
        });
        client.on('joinGame', (roomName) => {
            if (rooms.exists(roomName)) {
                rooms.setTo(roomName, player);
                game.join(roomName, player, client);
                client.join(roomName);
                room = roomName;
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
                        rooms.remove(room);
                        client.broadcast.emit('closeRoom', room);
                    }
                }, 800);
            }
        });
    });
}