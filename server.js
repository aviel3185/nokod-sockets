const io = require("socket.io")();
const { verify, sign } = require('jsonwebtoken');
const port = process.env.PORT || 3000;
const secret = 'aboke3g89k';
const users = {};

const credentials = {
    ido: 'abc',
    aviel: '123'
};


io.on("connection", (socket) => {
    console.log("New Connection: " + socket.id);
    socket.on('new user', ({ username, password }) => {
        if (credentials[username] === password) {
            users[socket.id] = username;
            socket.broadcast.emit("message", `${username} joined the chat.`)
            socket.emit('token', sign({ username }, secret));
        } else {
            socket.emit('unauthorized', 'Wrong password')
        }
    });
    socket.on('message', ({ text, token }) => {
        try {
            verify(token, secret);
            socket.broadcast.emit("message", `${users[socket.id]}> ${text}`);
        } catch (err) {
            socket.emit('unauthorized');
        }
    });
});
// Starting up server on PORT
io.listen(port);
console.log('Listening on port: ' + port)