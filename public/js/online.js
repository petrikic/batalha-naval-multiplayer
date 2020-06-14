
function handleUserClick(e) {
    let msg = `Deseja convidar o player ${e.id} para uma partida?`;
    showMessage(msg, 'Sim', () => {
        socket.emit('invite', e.id);
    });
}

const handleInvite = (players) => {
    let msg = `${players.player1} está te chamando para uma partida!`;
    showMessage(msg, 'Aceitar', () => {
        socket.emit('newGame', players);
    });
}

const listOnline = (user) => {
    $("#online-list").append(`
        <li
            class="user-online"
            id="${user}"
            onclick="handleUserClick(this);"
        >
            ${user}
        </li>
    `);
}

const toggle_sidebar = () => {
    $("#wrapper").toggleClass("toggled");
}

socket.on('listOnline', users => {
    users.forEach(user => {
        listOnline(user)
    });
});

socket.on('newUser', user => {
    listOnline(user);
});

socket.on('dropUser', user => {
    $('#' + user).closest('li').remove();
});

socket.on('invited', handleInvite)
