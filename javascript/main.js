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

    // enemies
    for(var i = 0; i < 5; i++) {
        setTimeout(function() {
            playSurface.spawnEnemy();
        }, i * 500);
    }

    // towers
    playSurface.addTower(new towers.LaserTower(playSurface, [200, 50]));
    playSurface.addTower(new towers.BurningTower(playSurface, [250, 50]));
    playSurface.addTower(new towers.ProjectileTower(playSurface, [250, 100]));
    playSurface.addTower(new towers.LaserTower(playSurface, [250, 150]));
    playSurface.addTower(new towers.LaserTower(playSurface, [300, 150]));
    playSurface.addTower(new towers.LaserTower(playSurface, [350, 150]));

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
            // game loop
            mainSurface.clear();
            playSurface.update(msDuration);
            playSurface.draw(mainSurface);
            playSurface.handleMainEvents();
        };
    gamejs.time.fpsCallback(tick, this, 60);
}

gamejs.preload(['images/enemy.png', 'images/enemy-1.png']);

gamejs.ready(main);