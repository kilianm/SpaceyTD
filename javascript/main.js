

var playsurface = require('./playsurface');
var gamejs = require('gamejs');

var Enemy = function(playSurface) {
    console.log(playSurface);
    // call superconstructor
    Enemy.superConstructor.apply(this, arguments);

    this.speed = 80; // pixels per second?
    this.destination_reached = false;

    this.originalImage = gamejs.image.load("images/enemy.png");

    // determine target location
    this.rotation = 0;
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // determine start location
    this.path = playSurface.path;
    this.path_index = 1; // start moving
    this.path_target = function() {
        return this.path[this.path_index];
    };

    var dims = this.originalImage.getSize();
    var start_x = this.path[0][0] - dims[0] / 2;
    var start_y = this.path[0][1] - dims[1] / 2;
    this.rect = new gamejs.Rect([start_x, start_y], dims);
    return this;
 };
 // inherit (actually: set prototype)
 gamejs.utils.objects.extend(Enemy, gamejs.sprite.Sprite);
 Enemy.prototype.update = function(msDuration) {
     if (this.destination_reached) {
         return;
     }
     var x = 0;
     var y = 1;
     var target = this.path_target();
     var current = this.rect.center;

     var pixel_speed = this.speed * (msDuration/1000);
     var moved = false;

     if (target[x] > current[x]) {
         this.rect.moveIp(pixel_speed, 0);
         moved = true;
     }
     if (target[x] < current[x]) {
         this.rect.moveIp(-pixel_speed, 0);
         moved = true;
     }
     if (target[y] > current[y]) {
         this.rect.moveIp(0, pixel_speed);
         moved = true;
     }
//     if (target[y] < current[y]) {
//         this.rect.moveIp(0, -pixel_speed);
//         moved = true;
//     }

     if (!moved) {
         this.path_index++;
         if (this.path.length == this.path_index) {
             this.destination_reached = true;
         }

         // rotate
         var new_target = this.path_target();
         if (new_target[x] > target[x]) {
             this.rotation = 0;
         }
         if (new_target[x] < target[x]) {
             this.rotation = -180;
         }
         if (new_target[y] > target[y]) {
             this.rotation = 90;
         }
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