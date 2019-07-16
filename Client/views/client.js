
let serverUrl = "http://35.183.42.174:8080";
let socket = io.connect(serverUrl);
let usernameSet = false;

socket.on('first_load', function(loadInfo) {
    updateUserList(loadInfo.all_users);
});

/*
 * On new chat message event:
 * Update the chat box with the new chat message 
 */
socket.on('chat_message', function(msgInfo){
    /* Username must be set before we let users see messages */
    if(usernameSet) {
        addMessage(msgInfo.user, msgInfo.msg, msgInfo.options);
    }
});

/*
 * On new is_online event:
 * Someone either just went online of offline, print a message with that info
 */
socket.on('is_online', function(username) {
    let userStatus = (username.is_online) ? 'online' : 'offline';
    let options = {
        'isText': true,
        'isStatus': true  
    }
    addMessage(username.user, ' is now ' + userStatus, options);
    updateUserList(username.all_users);
});


/*
 * Updates the user list with the new list of users
 */
function updateUserList(userList) {
    let listHTML = "";
    for(let i = 0; i < userList.length; i++) {
        listHTML += "<li class='list-group-item list-group-item-light pt-1 pb-1 lh-condensed'>" 
            + "<span class='badge badge-secondary'>ID: " + userList[i].id + "</span> " + userList[i].username + "</li>";
    }
    document.getElementById('users').innerHTML = listHTML;
}

/*
 * Handler for when a user submits a new message 
 */
function submitMessage(e) {
    e.preventDefault(); // Prevent the form from actually being submitted

    /* If the username hasn't been set then we want to set the username from the message box */
    if(!usernameSet) {
        let desiredName = document.getElementById('txt').value;
        if(desiredName != "") {
            /* Set new username */
            usernameSet = true;
            socket.emit('set_username', desiredName);
            document.getElementById('txt').placeholder="Enter your message";
        }
    }else {
        /* Send a new message */
        socket.emit('chat_message', document.getElementById('txt').value);
    }

    document.getElementById('txt').value = "";
    return false;
}

// Add an event handler for when the user hits enter or hits submit
document.getElementById('submit').addEventListener('click', submitMessage);


