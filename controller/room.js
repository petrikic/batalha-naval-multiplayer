var listRooms = [];
var userRooms = {};

const generateSerial = () => {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j != 0 && j % 8 == 0)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}

const existsRoom = (room) => {
    return listRooms.includes(room);
}

const createRoom = () => {
    let room = generateSerial();
    listRooms.push(room);
    userRooms[room] = [];
    return room;
}

const removeRoom = (room) => {
    if (existsRoom(room)) {
        listRooms.pop(room);
    }
}

const checkRoom = (room, user) => {
    if (!existsRoom(room)) {
        throw "RoomDoesNotExistException";
    } else if (userRooms[room].includes(user)) {
        //throw "AlreadyInRoomException";
    } else if (userRooms[room].length > 1) {
        throw "FullRoomException";
    }
}

const setToRoom = (room, user) => {
    userRooms[room].push(user);
}

const unsetToRoom = (room, user) => {
    userRooms[room].pop(user);
}

exports.exists = existsRoom;
exports.create = createRoom;
exports.remove = removeRoom;
exports.check = checkRoom;
exports.setTo = setToRoom;
exports.unsetTo = unsetToRoom;
exports.list = listRooms;