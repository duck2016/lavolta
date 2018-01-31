window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const io = require('socket.io-client');
const { pathname } = window.location;

class Game extends Phaser.Game {
    constructor() {
        super(320, 240, Phaser.WEBGL, 'game', null);
    };
}

window.addEventListener('DOMContentLoaded', () => {
    if (pathname === '/') {}
    if (pathname === '/game') {
        const options = { query: `userId=${window.__userId}` };
        const socket = io.connect('http://localhost:3020', options);
        const game = new Game();
        socket.on('start', initialState => {
            let circles = initialState.map(({ x, y }) => new Phaser.Circle(x, y, 8));
            let cursors;
            socket.on('update', newState => {
                circles = newState.map(({ x, y }) => new Phaser.Circle(x, y, 8));
            });
            game.state.add('intro', {
                preload() {
                    game.load.image('bg', '/assets/img/bg.jpg');
                },
                create() {
                    game.stage.backgroundColor = '#2d2d2d';
                    game.add.image(0, 0, 'bg');
                    cursors = game.input.keyboard.createCursorKeys();
                },
                update() {
                    if (cursors.up.isDown) socket.emit('move', 'up');
                    else if (cursors.down.isDown) socket.emit('move', 'down');
                    if (cursors.left.isDown) socket.emit('move', 'left');
                    else if (cursors.right.isDown) socket.emit('move', 'right');
                },
                render() {
                    circles.forEach(circle => game.debug.geom(circle, '#00ff00'));
                }
            });
            game.state.start('intro');
        });
    }
});
