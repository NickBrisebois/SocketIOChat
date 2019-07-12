const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.render('index.html');
});

const server = http.listen(80, () => {
    console.log('listening on port 80');
});
