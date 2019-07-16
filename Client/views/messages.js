/* list classes to use for messages */
let msgClasses = "list-group-item pl-3 p-1 list-group-flush";

/**
 * Creates and adds the new message element to the page
 */
function addMessage(username, message, options) {
    // Create the new element with the syntax <li> username : <span> msg contents </span> </li>
    let newMsg = document.createElement('li');
    let usernameContent = document.createTextNode(username + " : ");
    let msgSpan = document.createElement('span');
    let msgContent;

    if(options.isText) {
        msgContent = document.createTextNode(message);

        if(options.bold) {
            msgSpan.style = 'font-weight: bold';
        }
        if(options.size == 3) {
            msgSpan.style = 'font-size: 50px';
        }
        if(options.size == 1) {
            msgSpan.style = 'font-size: 10px';
        }
        msgSpan.appendChild(msgContent);
    }else {
        if(options.isImg) {
            msgContent = document.createElement('IMG');
            msgContent.src = message;
            msgSpan.appendChild(msgContent);
        }   
    }

    newMsg.appendChild(usernameContent);
    newMsg.appendChild(msgSpan);
    newMsg.className = msgClasses;

    /* Bottom element is required to always be at the end so that we can scroll to it.
     * We maintain this by appending html above it and then scrolling it into view */
    document.getElementById('bottom').insertAdjacentElement('beforebegin', newMsg);
    document.getElementById('bottom').scrollIntoView();
}
