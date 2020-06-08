exports.use = (io) => {
    const rooms = require('../controller/room');
    
    io.on("connection", client => {
        let room;
        console.log(`socket conectado: ${client.id}`);
        
        client.emit('listRooms', rooms.list);

        client.on('createRoom', () => {
            let newRoom = rooms.create();
            client.emit('room', newRoom);
            client.broadcast.emit('newRoom', newRoom);
        });

        client.on('disconnect', () => {
            console.log(`socket desconectado: ${client.id}`);
        });

    });
}