require('babel-register')();
const express = require('express');
const socket = require('socket.io');
const ReactEngine = require('express-react-views');
const amqp = require('amqplib');
const handleError = require('./middlewares/handleError');
const session = require('./middlewares/session');
const loginUser = require('./middlewares/loginUser');
const authUser = require('./middlewares/authUser');
const logoutUser = require('./middlewares/logoutUser');
const gamePage = require('./middlewares/gamePage');

const app = express();
const server = app.listen(80);
const io = socket.listen(server);
const mqReady = amqp.connect(process.env.AMQP_HOST);

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

const channelReady = new Promise(resolve => {
    mqReady.then(conn => {
        return conn.createChannel().then(ch => {
            return Promise.all([
                ch.assertQueue('loginUser', { durable: false }),
                ch.assertQueue('logoutUser', { durable: false }),
                ch.assertQueue('update', { durable: false }),
                ch.assertQueue('move', { durable: false })
            ]).then(() => resolve(ch));
        });
    }).catch(() => process.exit(1));
});

io.sockets.on('connection', socket => {
    channelReady.then(ch => {
        const { userId } = socket.handshake.query;
        const consumerTag = userId;
        ch.sendToQueue('loginUser', Buffer.from(userId));
        ch.consume('update', message => {
            try {
                const newState = JSON.parse(message.content.toString());
                io.sockets.emit('update', newState);
            } catch (e) {}
        }, { consumerTag });
        socket.emit('start', []);
        socket.on('move', direction => {
            ch.sendToQueue('move', Buffer.from(JSON.stringify({ userId, direction })));
        });
        socket.on('disconnect', () => {
            ch.sendToQueue('logoutUser', Buffer.from(userId));
            ch.cancel(consumerTag);
        });
    }).catch(console.warn);
});
