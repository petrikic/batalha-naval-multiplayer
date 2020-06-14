var socket = io();

const list = (value) => {
    $("#list-rooms").append(`<li><a href="/r/public/${value}" id="${value}">${value}</a></li>`);
}

socket.on('listRooms', rooms => {
    for (let i = 0; i < rooms.length; i++) {
        list(rooms[i]);
    }
});


socket.on('closeRoom', (room) => {
    $('#' + room).closest('li').remove();
})

socket.on('newRoom', (room) => {
    list(room);
});

const createRoom = () => {
    socket.emit('createRoom');
}

socket.on('room', (room) => {
    window.location.href = '/r/public/' + room;
});

const toggle = () => {
    $('#sidebar-content').toggle(600);
}
