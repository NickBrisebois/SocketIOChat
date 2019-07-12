const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let activeUsers = [];

/* On a new connection:
 * Begin watching for new events
 */
io.sockets.on('connection', (socket) => {
    /*
     * On user disconnect:
     * A user has disconnected, remove them from the list of active users
     */
    socket.on('disconnect', (username) => {
        console.log(socket.username + " disconnected from chat");
        let userIndex = activeUsers.indexOf(socket.username);
        activeUsers.splice(userIndex, 1);
        io.emit('is_online', {'all_users': activeUsers, 'user': socket.username, 'is_online': false});
    });

    /*
     * On new message:
     * A user has sent a message to the server, send the message to everyone connected
     */
    socket.on('chat_message', (message) => {
        /* Make sure user's message isn't empty (this is also done client side) */
        if(message.length > 0) {
            /* Send new 'chat_event' event to all users containing the new message and the sender */
            io.emit('chat_message', {'user': socket.username, 'msg': message});
        }
    });
    
    /* 
     * On username set:
     * A user has submitted a username, we now add them to the list of active users
     */
    socket.on('set_username', (username) => {
        console.log(socket.username + " joined the chat");
        if(username.length > 0) {
            socket.username = username;
            activeUsers.push(username);
            io.emit('is_online', {'all_users': activeUsers, 'user': socket.username, 'is_online': true});
        }
    });
})

const server = http.listen(8080, () => {
    console.log('listening on port 8080');
});
