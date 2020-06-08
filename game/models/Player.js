module.exports = (socket) => {
    return {
        socket: socket,
        score: 0,
        multi: 1,
        board: '',
        ships: '',
        hit: [],
        miss: [],
        sink: []
    };
}