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
        [70, 60],
        [300, 60],
        [300, 100],
        [600, 100],
        [600, 300],
        [400, 300],
        [400, 250],
        [200, 250],
        [200, 500],
        [500, 500],
        [500, 580]
    ]);

    playSurface.nextWavePending = true;
    setTimeout(function() {
        playSurface.spawnWave();
    }, 5000);

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
        //playSurface.handleGameControlEvents();

        // game loop
        if (playSurface.paused) {
            return;
        }
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
                'images/enemy-pink.png',
                'images/icon-cash.png',
                'images/icon-life.png',
                'images/icon-wave.png',
                'images/laser-tower.png',
                'images/target.png',
                'images/mask.png']);

gamejs.ready(main);