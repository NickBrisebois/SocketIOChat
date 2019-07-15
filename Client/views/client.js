
let serverUrl = "http://35.183.42.174:8080";
let socket = io.connect(serverUrl);
let usernameSet = false;

/* Li format to use for messages */
let listStyle = "<li class='list-group-item pl-3 p-1'>";

/*
 * On new chat message event:
 * Update the chat box with the new chat message 
 */
socket.on('chat_message', function(msgInfo){
    /* Username must be set before we let users see messages */
    if(usernameSet) {
        let msg = craftMsgHTML(msgInfo.user, msgInfo.msg);
        /* Bottom element is required to always be at the end so that we can scroll to it.
         * We maintain this by appending html above it and then scrolling it into view */
        document.getElementById('bottom').insertAdjacentHTML('beforebegin', msg);
        document.getElementById('bottom').scrollIntoView();
    }
});

/*
 * On new is_online event:
 * Someone either just went online of offline, print a message with that info
 */
socket.on('is_online', function(username) {
    // Generate HTML for userlist and status message
    let userStatus = craftStatusMsg(username.user, username.is_online);
    let userList = craftUserListHTML(username.all_users);

    // Print list of online users
    document.getElementById('bottom').insertAdjacentHTML('beforebegin', userStatus);
    document.getElementById('users').innerHTML = userList;
    document.getElementById('bottom').scrollIntoView();
});

/**
 * Returns HTML for a new message that can be used to append to the chat box
 */
function craftMsgHTML(username, message) {
    return listStyle + "<strong>" + username + "</strong>: " + message + "</li>";
}

/*
 * Returns HTML for the user list
 */
function craftUserListHTML(userList) {
    let listHTML = "";
    for(let i = 0; i < userList.length; i++) {
        listHTML += "<li class='list-group-item list-group-item-light pt-0 pb-0 lh-condensed'>" + userList[i] + "</li>";
    }
    return listHTML;
}

/* 
 * Craft a status update for when a user joins or leaves
 */
function craftStatusMsg(username, isOnline) {
    let userStatus = (isOnline) ? 'online' : 'offline';
    return listStyle + username + " is now " + userStatus + ".</li>";
}

/*
 * Handler for when a user submits a new message 
 */
function submitMessage(e) {
    e.preventDefault(); // Prevent the form from actually being submitted
    /* If the username hasn't been set then we want to set the username from the message box */
    if(!usernameSet) {
        /* Set new username */
        usernameSet = true;
        socket.emit('set_username', document.getElementById('txt').value);
        document.getElementById('txt').placeholder="Enter your message";
    }else {
        /* Send a new message */
        socket.emit('chat_message', document.getElementById('txt').value);
    }
    document.getElementById('txt').value = "";
    return false;
}

// Add an event handler for when the user hits enter or hits submit
document.getElementById('submit').addEventListener('click', submitMessage);


