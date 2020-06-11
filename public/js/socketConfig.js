var socket = io('localhost:3000', {
    transports: ['websocket'],
    upgrade: false
});