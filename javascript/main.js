

var playsurface = require('./playsurface');
var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var $v = require('gamejs/utils/vectors');

var Enemy = function(playSurface) {
    console.log(playSurface);
    // call superconstructor
    Enemy.superConstructor.apply(this, arguments);

    this.speed = 100; // pixels per second?
    this.destination_reached = false;

    this.originalImage = gamejs.image.load("images/enemy.png");
    var dims = this.originalImage.getSize();

    // determine target location
    this.rotation = 0;
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // determine start location
    this.path = playSurface.path;
    this.path_index = 1; // start moving
    this.path_target = function() {
        return this.path[this.path_index];
    };

    this.rect = new gamejs.Rect(this.path[0], dims);
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
         // move to right
         // Math.min is used to never exceed the target location and start
         // bouncing back and forth in corners.
         this.rect.moveIp(Math.min(pixel_speed, target[x] - current[x]), 0);
         moved = true;
     }
     if (target[x] < current[x]) {
         // move to left
         this.rect.moveIp(-Math.min(pixel_speed, current[x] - target[x]), 0);
         moved = true;
     }
     if (target[y] > current[y]) {
         // move to bottom
         this.rect.moveIp(0, Math.min(pixel_speed, target[y] - current[y]));
         moved = true;
     }
     if (target[y] < current[y]) {
         // move to top (not used yet in path)
         this.rect.moveIp(0, -Math.min(pixel_speed, current[y] - target[y]));
         moved = true;
     }

     if (!moved) {
         // if we didn't move, it means we reached the target destination
         // so we set new path destination for next tick.
         this.path_index++;
         if (this.path.length == this.path_index) {
             this.destination_reached = true;
             return;
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
         if (new_target[y] < target[y]) {
             this.rotation = -90;
         }
         this.image = gamejs.transform.rotate(this.originalImage, this.rotation);
     }
 };

 var Tower = function(playSurface, location) {
     Tower.superConstructor.apply(this, arguments);

     this.originalImage = gamejs.image.load("images/enemy.png");
     var dims = this.originalImage.getSize();

     // determine target location
     this.rotation = 0;
     this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

     this.shootRange = 120;
     this.rect = new gamejs.Rect(location, dims);
     return this;
  };
  // inherit (actually: set prototype)
  gamejs.utils.objects.extend(Tower, gamejs.sprite.Sprite);
  Tower.prototype.update = function(msDuration, gEnemies, mainSurface) {
      var self = this;
      gEnemies.forEach(function(enemy){
          distance = $v.distance(self.rect.center, enemy.rect.center);
          if (distance < self.shootRange) {
              //var unitPos =
              console.log('Nearby! '+distance);
              var dx = enemy.rect.center[0] - self.rect.center[0];
              var dy = enemy.rect.center[1] - self.rect.center[1];
              var theta = Math.atan2(dy, dx);
              var degrees = theta * 180/Math.PI; // rads to degs
              self.rotation = degrees;
              self.image = gamejs.transform.rotate(self.originalImage, self.rotation);
              //draw.circle(mainSurface, "#BBBBBB", self.rect.center, degrees);
          }
      });
  };


function main() {
    // screen setup
    gamejs.display.setMode([800, 600]);
    gamejs.display.setCaption("Spacey Tower Defense");

    // game loop
    var mainSurface = gamejs.display.getSurface();
    var playSurface = new playsurface.PlaySurface([800, 600], [[0,30], [300,30], [300,100], [600,100], [600,300], [200,300], [200,400], [400,400], [400,600]]);

    var gEnemies= new gamejs.sprite.Group();
    for (var i=0;i<5;i++) {
        setTimeout(function() {
            gEnemies.add(new Enemy(playSurface));
        }, i * 500);
    }
    console.log(gEnemies);

    var tower = new Tower(playSurface, [250, 50]);

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
        mainSurface.fill("#DFDFDF");
        playSurface.draw(mainSurface);

        gEnemies.update(msDuration);
        gEnemies.draw(mainSurface);

        tower.update(msDuration, gEnemies, mainSurface);
        tower.draw(mainSurface);
    };
    gamejs.time.fpsCallback(tick, this, 60);
 }

gamejs.preload(['images/enemy.png', 'images/enemy-1.png']);

gamejs.ready(main);