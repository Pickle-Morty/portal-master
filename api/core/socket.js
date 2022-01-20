const socket = require('socket.io');
const http = require('http');

const createSocket = (http) => {
    const io = socket(http);

    io.on('connection', (socket) => {
       
    });

    return io
};

module.exports = createSocket;
