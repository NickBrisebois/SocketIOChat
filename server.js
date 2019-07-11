const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let activeUsers = [];

io.sockets.on('connection', (socket) => {
    socket.on('username', (username) => {
    });

    socket.on('disconnect', (username) => {
        console.log(socket.username + " disconnected from chat");
        let userIndex = activeUsers.indexOf(socket.username);
        activeUsers.splice(userIndex, 1);
        io.emit('is_online', {'users': activeUsers, 'msg': '<li'> + socket.username + ' left the chat</li>'});
    });

    socket.on('chat_message', (message) => {
        if(message.length > 0) {
            io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
        }
    });
    
    socket.on('set_username', (username) => {
        if(username.length > 0) {
            socket.username = username;
            activeUsers.push(username);
            io.emit('is_online', {'users': activeUsers, 'msg': '<li>' + socket.username + ' joined the chat</li>'});
        }
    });
})

const server = http.listen(8080, () => {
    console.log('listening on port 8080');
});
