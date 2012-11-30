var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var playsurface = require('./playsurface');
var towers = require('./towers');

function main() {
    // screen setup
    gamejs.display.setMode([800, 600]);
    gamejs.display.setCaption("Spacey Tower Defense");

    var mainSurface = gamejs.display.getSurface();
    var playSurface = new playsurface.PlaySurface([800, 600], [
        [0, 30],
        [300, 30],
        [300, 100],
        [600, 100],
        [600, 300],
        [400, 300],
        [400, 250],
        [200, 250],
        [200, 500],
        [500, 500],
        [500, 600]
    ]);

    playSurface.spawnWave();

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
            // game loop
            mainSurface.clear();
            playSurface.update(msDuration);
            playSurface.draw(mainSurface);
            playSurface.handleMainEvents();
            playSurface.handleWaves();
        };
    gamejs.time.fpsCallback(tick, this, 60);
}

gamejs.preload(['images/enemy.png',
                'images/enemy-1.png',
                'images/pulse-tower.png',
                'images/enemy-green.png',
                'images/enemy-blue.png',
                'images/icon-cash.png',
                'images/icon-life.png',
                'images/icon-wave.png',
                'images/laser-tower.png']);

gamejs.ready(main);