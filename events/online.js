exports.use = (io) => {
    const online = require('../controller/online');
    
    io.on("connection", client => {
        const username = client.handshake.session.user;
        client.join(username);
        if (!online.check(username)) {
            client.broadcast.emit('newUser', username);
            console.log(`User online: ${username}`);
        }
        online.set(username);

        client.emit('listOnline', online.list());

        client.on("disconnect", () => {
            online.remove(username);
            if (!online.check(username)) {
                client.broadcast.emit('dropUser', username);
            }
        });
    });
}