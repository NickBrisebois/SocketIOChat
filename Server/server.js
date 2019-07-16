const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    pingTimeout: 10000,
    pingInterval: 50000
});

let activeUsers = [];
let userIds = [];

/* On a new connection:
 * Begin watching for new events
 */
io.sockets.on('connection', (socket) => {

    io.emit('first_load', {'all_users': activeUsers, 'user': socket.username, 'is_online': false});
    console.log("IP of user: " + socket.handshake.address);

    /*
     * On user disconnect:
     * A user has disconnected, remove them from the list of active users
     */
    socket.on('disconnect', (username) => {
        console.log(username + " disconnected from chat");
        console.log("user id: " + socket.userId);

        // Find the user in activeUsers by ID
        let index = activeUsers.findIndex(u => u.id == socket.userId);
        let idIndex = userIds.indexOf(socket.userId);

        //Remove user from active user list
        activeUsers.splice(index, 1);
        userIds.splice(idIndex, 1);

        io.emit('is_online', {'all_users': activeUsers, 'user': socket.username, 'is_online': false});
    });

    /*
     * On new message:
     * A user has sent a message to the server, send the message to everyone connected
     */
    socket.on('chat_message', (message) => {
        /* Make sure user's message isn't empty (this is also done client side) */
        if(message.length > 0) {
            if(message[0] == '/') {
                parseCmd(socket.username, message);
            }else {
                /* Send new 'chat_event' event to all users containing the new message and the sender */
                io.emit('chat_message', {'user': socket.username, 'msg': message, 'options': {'isText': true}});
            }
        }
    });
    
    /* 
     * On username set:
     * A user has submitted a username, we now add them to the list of active users
     */
    socket.on('set_username', (username) => {
        console.log(socket.username + " joined the chat");
        let userId = createId();
        socket.userId = userId;
        if(username.length > 0) {
            socket.username = username;
            activeUsers.push({
                "id": userId,
                "username": username
            });
            io.emit('is_online', {'all_users': activeUsers, 'user': socket.username, 'is_online': true});
        }
    });
})

const server = http.listen(8080, () => {
    console.log('listening on port 8080');
});

function createId() {
    let id = userIds.length;
    while (userIds.indexOf(id) != -1){
        id++;
    }
    userIds.push(id);
    return id;
}

function parseCmd(user, message) {
    let parsedMsg = message.split(" ");
    message = message.slice(parsedMsg[0].length, message.length);
    switch(parsedMsg[0]) {
        case "/help": {
            let options = {
                'isText': true
            }
            io.emit('chat_message', {'user': 'help', 'msg': printHelp(), 'options': options});
            break
        }
        case "/big": {
            let options = {
                'isText': true,
                'size': 3,
            }
            io.emit('chat_message', {'user': user, 'msg': message, 'options': options});
            break; 
        }
        case "/small": {
            let options = {
                'isText': true,
                'size': 1,
            }
            io.emit('chat_message', {'user': user, 'msg': message, 'options': options});
            break; 
        }
        case "/img": {
            let options = {
                'isText': false,
                'isImg': true
            }
            io.emit('chat_message', {'user': user, 'msg': message, 'options': options});
            break; 
        }
    }
}

function printHelp() {
    let help = "Commands:\n\t";
    help += "| /help - get this help menu\n\t |";
    help += "| /img [link] - prints the image in the given link\n\t |";
    help += "| /big [text] - prints your text BIG\n\t |";
    help += "| /small [text] - prints your text SMALL\n\t |";
    return help;
}
