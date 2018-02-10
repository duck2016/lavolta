const amqp = require('amqplib');
const Loki = require('lokijs');

const db = new Loki('db.json');
const users = db.addCollection('users');
const mqReady = amqp.connect(process.env.AMQP_HOST);

const computeState = function() {
    return Buffer.from(JSON.stringify(
        users.find({ online: true }).map(({ x, y, userId }) => ({ x, y, userId }))
    ));
};

mqReady.then(conn => {
    return conn.createChannel().then(ch => {
        return Promise.all([
            ch.assertQueue('loginUser', { durable: false }),
            ch.assertQueue('logoutUser', { durable: false }),
            ch.assertQueue('update', { durable: false }),
            ch.assertQueue('move', { durable: false }),
            ch.consume('loginUser', message => {
                const userId = message.content.toString();
                const user = users.findOne({ userId }) || users.insert({ userId, x: 30, y: 30 });
                console.log('[v] loginUser %s', JSON.stringify(user));
                user.online = true;
                users.update(user);
                console.log('offline %s, online %s',
                    users.find({ online: false }).length,
                    users.find({ online: true }).length
                );
                ch.sendToQueue('update', computeState());
            }, { noAck: true }),
            ch.consume('logoutUser', message => {
                const userId = message.content.toString();
                const user = users.findOne({ userId });
                user.online = false;
                users.update(user);
                console.log('[v] logoutUser %s', JSON.stringify(user));
                console.log('offline %s, online %s',
                    users.find({ online: false }).length,
                    users.find({ online: true }).length
                );
                ch.sendToQueue('update', computeState());
            }, { noAck: true }),
            ch.consume('move', message => {
                const { userId, direction } = JSON.parse(message.content.toString());
                const user = users.findOne({ userId });
                if (direction === 'up') user.y -= 1;
                if (direction === 'down') user.y += 1;
                if (direction === 'left') user.x -= 1;
                if (direction === 'right') user.x += 1;
                users.update(user);
                ch.sendToQueue('update', computeState());
            }, { noAck: true })
        ]);
    });
}).catch(() => process.exit(1));
