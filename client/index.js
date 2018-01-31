require('babel-register')();
const express = require('express');
const socket = require('socket.io');
const ReactEngine = require('express-react-views');
const Loki = require('lokijs');
const handleError = require('./middlewares/handleError');
const session = require('./middlewares/session');
const loginUser = require('./middlewares/loginUser');
const authUser = require('./middlewares/authUser');
const logoutUser = require('./middlewares/logoutUser');
const gamePage = require('./middlewares/gamePage');

const app = express();
const server = app.listen(80);
const io = socket.listen(server);
const db = new Loki('db.json');
const users = db.addCollection('users');

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
app.use(session);
app.use(loginUser);
app.use(authUser);
app.use('/logout', logoutUser);
app.use('/game', gamePage);
app.use('/', (req, res) => res.render('index'));

const computeState = function(_users) {
    return _users.find({}).map(({ x, y, userId }) => ({ x, y, userId }));
};

io.sockets.on('connection', socket => {
    let destroyTimeout = null;
    const { userId } = socket.handshake.query;
    const user = (users.findOne({ userId }) || users.insert({ userId, x: 30, y: 30 }));
    socket.emit('start', computeState(users));
    socket.on('move', direction => {
        if (direction === 'up') user.y -= 1;
        if (direction === 'down') user.y += 1;
        if (direction === 'left') user.x -= 1;
        if (direction === 'right') user.x += 1;
        users.update(user);
        io.sockets.emit('update', computeState(users));
    });
    socket.on('disconnect', () => {
        // restore timeout
        destroyTimeout = setTimeout(() => {
            users.remove(user);
            io.sockets.emit('update', computeState(users));
            clearTimeout(destroyTimeout);
            destroyTimeout = null;
        }, 20000);
    });
});
