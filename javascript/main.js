var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var playsurface = require('./playsurface');
var towers = require('./towers');
var enemies = require('./enemies');

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
    var gEnemies = new gamejs.sprite.Group();
    for(var i = 0; i < 5; i++) {
        setTimeout(function() {
            gEnemies.add(new enemies.Enemy(playSurface));
        }, i * 500);
    }

    // towers
    var tower1 = new towers.LaserTower(playSurface, [200, 50]);
    var tower2 = new towers.BurningTower(playSurface, [250, 50]);
    var tower3 = new towers.LaserTower(playSurface, [250, 100]);
    var tower4 = new towers.LaserTower(playSurface, [250, 150]);
    var tower5 = new towers.LaserTower(playSurface, [300, 150]);
    var tower6 = new towers.LaserTower(playSurface, [350, 150]);

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
            // game loop
            mainSurface.clear();
            playSurface.draw(mainSurface);

            gEnemies.update(msDuration);
            gEnemies.draw(mainSurface);

            tower1.update(msDuration, gEnemies, mainSurface);
            tower1.draw(mainSurface);
            tower2.update(msDuration, gEnemies, mainSurface);
            tower2.draw(mainSurface);
            tower3.update(msDuration, gEnemies, mainSurface);
            tower3.draw(mainSurface);
            tower4.update(msDuration, gEnemies, mainSurface);
            tower4.draw(mainSurface);
            tower5.update(msDuration, gEnemies, mainSurface);
            tower5.draw(mainSurface);
            tower6.update(msDuration, gEnemies, mainSurface);
            tower6.draw(mainSurface);

            playSurface.handleMainEvents();
        };
    gamejs.time.fpsCallback(tick, this, 60);
}

gamejs.preload(['images/enemy.png', 'images/enemy-1.png']);

gamejs.ready(main);