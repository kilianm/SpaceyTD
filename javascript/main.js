

var playsurface = require('./playsurface');
var gamejs = require('gamejs');

var Enemy = function(playSurface) {
    console.log(playSurface);
    // call superconstructor
    Enemy.superConstructor.apply(this, arguments);

    this.speed = 80; // pixels per second?

    this.originalImage = gamejs.image.load("images/enemy.png");
    var dims = this.originalImage.getSize();

    // determine target location
    this.rotation = 0;
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // determine start location
    this.path = playSurface.path;
    this.path_index = 1; // start moving
    this.path_target = this.path[this.path_index];

    this.rect = new gamejs.Rect(this.path[0], dims);
    return this;
 };
 // inherit (actually: set prototype)
 gamejs.utils.objects.extend(Enemy, gamejs.sprite.Sprite);
 Enemy.prototype.update = function(msDuration) {
     if (this.rect.collidePoint(this.path_target)) {
         console.log(this.rect.collidePoint(this.path_target));
         //console.log(this.rect.left);
         this.path_index++;
     }
     //this.rect.moveIp(this.speed * (msDuration/1000), 0);
    // - check if current position collides with target position
    // - if so, determine if we need to move to X or Y, and change
    // direction accordingly
    // - change rotation so to point to correct target coordinates



//     if (target.x > current.x) {
//         this.rect.moveIp(this.speed * (msDuration/1000), 0);
//     }
//     if (target.x < current.x) {
//         this.rect.moveIp(-this.speed * (msDuration/1000), 0);
//     }
//     if (target.y > current.y) {
//         this.rect.moveIp(0, this.speed * (msDuration/1000));
//     }
//     if (target.y > current.y) {
//         this.rect.moveIp(0, -this.speed * (msDuration/1000));
//     }

    // moveIp = move in place
    this.rect.moveIp(this.speed * (msDuration/1000), 0);
    if (this.rect.right > 800) {
       this.speed *= -1;
       this.image = gamejs.transform.rotate(this.originalImage, this.rotation + 180);
    } else if (this.rect.right < 0 ) {
       this.speed *= -1;
       this.image = gamejs.transform.rotate(this.originalImage, this.rotation);
    }
 };


function main() {
    // screen setup
    gamejs.display.setMode([800, 600]);
    gamejs.display.setCaption("Spacey Tower Defense");

    // game loop
    var mainSurface = gamejs.display.getSurface();
    var playSurface = new playsurface.PlaySurface([800, 600], [[0,10], [300,10], [300,100], [600,100], [600,300], [200,300], [200,400], [400,400], [400,600]]);

    var gEnemies= new gamejs.sprite.Group();
    for (var i=0;i<1;i++) {
        gEnemies.add(new Enemy(playSurface));
    }

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
        mainSurface.fill("#DFDFDF");
        playSurface.draw(mainSurface);

        gEnemies.update(msDuration);
        gEnemies.draw(mainSurface);
    };
    gamejs.time.fpsCallback(tick, this, 60);
 }

gamejs.preload(['images/enemy.png']);

gamejs.ready(main);