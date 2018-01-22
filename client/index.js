require('babel-register')();
const express = require('express');
const socketIO = require('socket.io');
const ReactEngine = require('express-react-views');
const handleError = require('./middlewares/handleError');
const app = express();
const server = app.listen(80);
const io = socketIO.listen(server);

app.set('views', `${__dirname}/views`);
app.set('view engine', 'jsx');
app.engine('jsx', ReactEngine.createEngine({
    beautify: false,
    babel: {
        presets: ['react', 'es2015'],
        plugins: ['transform-class-properties']
    }
}));

app.use(handleError);
app.use('/assets', express.static(`${__dirname}/assets`));
app.get('/', (req, res) => res.render('index'));

let id = 0;
const sockets = [];

io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    socket.player = { id, x: 50, y: 50 };
    id += 1;
    socket.emit('message', { message: `welcome to the chat ${socket.player.id}` });
    socket.on('send', function(data) {
        io.sockets.emit('message', data);
    });
    socket.on('sendMove', function(direction) {
        const { player } = socket;
        if (direction === 'up') {
            if (player.y > 0) player.y -= 1;
        }
        if (direction === 'down') {
            if (player.y < 320) player.y += 1;
        }
        if (direction === 'left') {
            if (player.x > 0) player.x -= 1;
        }
        if (direction === 'right') {
            if (player.x < 240) player.x += 1;
        }
        const updates = sockets.map(({ player }) => ({
            x: player.x,
            y: player.y
        }));
        io.emit('updatePosition', updates);
    });
});
