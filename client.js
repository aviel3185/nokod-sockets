const io = require('socket.io-client');
const socket = io("http://localhost:3000");
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });

let token;

console.log("What is your name?");
rl.question("What is your name?", (username) => {
    console.log('What is your password')
    rl.question('What is your password', (password) => {
        socket.emit('new user', { username: username.trim(), password });
        console.log("verifying password...");
        // process.stdout.write("> ");
    });
});

socket.on('token', (text) => {
    token = text;
    console.log('Welcome to the chat!');
});
socket.on('unauthorized', () => {
    console.error('Wrong password, exiting process..');
    process.exit(0);
})
socket.on("message", (text) => {
    process.stdout.write("\r\x1b[K")
    console.log(text);
    process.stdout.write("> ");
});
// Prompting user to enter message.
rl.prompt();
// Fires when we input text from user.
rl.on('line', (text) => {
    socket.emit('message', { text: text.trim(), token });
    process.stdout.write("> ");
    rl.prompt();
});