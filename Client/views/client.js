
let serverUrl = "http://35.183.42.174:8080";
let socket = io.connect(serverUrl);
let usernameSet = false;

function submitMessage(e) {
    e.preventDefault();
    if(!usernameSet) {
        usernameSet = true;
        socket.emit('set_username', document.getElementById('txt').value);
        document.getElementById('txt').placeholder="Enter your message";
    }else {
        socket.emit('chat_message', document.getElementById('txt').value);
    }
    document.getElementById('txt').value = "";
    return false;
}

document.getElementById('submit').addEventListener('click', submitMessage);

// append the chat text message
socket.on('chat_message', function(msg){
    if(usernameSet) {
        msg = "<li class='list-group-item'>" + msg + "</li>";
        document.getElementById('bottom').insertAdjacentHTML('beforebegin', msg);
        document.getElementById('bottom').scrollIntoView();
    }
});

// append text if someone is online
socket.on('is_online', function(username) {
    // Print list of online users
    let status = (username.is_online) ? 'online' : 'offline';
    let message = "<li class='list-group-item'>" + username.user + " is now " + status + ".</li>";
    document.getElementById('bottom').insertAdjacentHTML('beforebegin', message);
    let userList = "";
    for(let i = 0; i < username.all_users.length; i++) {
        userList += username.all_users[i] + "<hr/>";
    }
    userList += "";
    document.getElementById('users').innerHTML = userMotd;
    document.getElementById('bottom').scrollIntoView();
});
