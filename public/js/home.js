var socket = io('localhost:3000');

const list = (value) => {
    $("#list-rooms").append(`<li><a href="/r/public/${value}" id="${value}">${value}</a></li>`);
}

const listOnline = (user) => {
    $("#online-list").append(`
        <li>
            <a id="${user}" href="/users/${user}"><img src="/img/online-ico.png""> ${user}</a>
        </li>`);
}

socket.on('listRooms', rooms => {
    for (let i = 0; i < rooms.length; i++) {
        list(rooms[i]);
    }
});

socket.on('listOnline', list => {
    list.forEach(element => {
        listOnline(element)
    });
});

socket.on('closeRoom', (room) => {
    $('#' + room).closest('li').remove();
})

socket.on('newRoom', (room) => {
    list(room);
});

socket.on('newUser', user => {
    listOnline(user);
});

socket.on('dropUser', user => {
    $('#' + user).closest('li').remove();
});

const createRoom = () => {
    socket.emit('createRoom');
}

socket.on('room', (room) => {
    window.location.href = '/r/public/' + room;
});