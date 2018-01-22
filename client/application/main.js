const io = require('socket.io-client');
const socket = io.connect('http://localhost:3020');

const W = 87;
const A = 65;
const S = 83;
const D = 68;

window.addEventListener('DOMContentLoaded', () => {
    const chat = document.getElementById('chat');
    const input = document.getElementById('message');
    const submit = document.getElementById('submit');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(0, 0, 320, 240);
    ctx.fillStyle = 'blue';
    ctx.fill();
    submit.addEventListener('click', () => {
        const message = input.value;
        socket.emit('send', { message });
        input.value = '';
    });
    socket.on('message', ({ message }) => {
        const pre = document.createElement('pre');
        const text = document.createTextNode(message);
        pre.appendChild(text);
        chat.appendChild(pre);
    });
    socket.on('updatePosition', (sockets) => {
        ctx.beginPath();
        ctx.rect(0, 0, 320, 240);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.fillStyle = 'white';
        sockets.forEach(({ x, y }) => {
            ctx.fillRect(x, y, 4, 4);
        });
    });
    document.addEventListener('keydown', (e) => {
        console.log(e.keyCode);
        if (e.keyCode === W) socket.emit('sendMove', 'up');
        if (e.keyCode === A) socket.emit('sendMove', 'left');
        if (e.keyCode === S) socket.emit('sendMove', 'down');
        if (e.keyCode === D) socket.emit('sendMove', 'right');
    });
});
