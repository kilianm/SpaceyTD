

var playsurface = require('./playsurface');
var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var $v = require('gamejs/utils/vectors');

var Enemy = function(playSurface) {
    // call superconstructor
    Enemy.superConstructor.apply(this, arguments);

    this.health = 500;

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

    this.doDamage = function(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.kill();
        }
    }

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

     this.shootRange = 150;
     this.shootDamage = 3;
     this.shootDuration = 10;
     this.shootCooldown = 10;
     this.shootCooldown = 10;

     this.currentTargetEnemy = null;

     this.rect = new gamejs.Rect(location, dims);
     return this;
  };
  // inherit (actually: set prototype)
  gamejs.utils.objects.extend(Tower, gamejs.sprite.Sprite);
  Tower.prototype.update = function(msDuration, gEnemies) {
      var self = this;
      var enemiesInRange = {};
      var enemyDistances = [];
      gEnemies.forEach(function(enemy){
          distance = $v.distance(self.rect.center, enemy.rect.center);
          if (distance < self.shootRange) {
              enemiesInRange[distance] = enemy;
              enemyDistances.push(distance);
          }
      });
      if (enemyDistances.length > 0) {
          enemyDistances.sort();
          var distance = enemyDistances[0];
          enemy = enemiesInRange[distance];
          enemy.doDamage(self.shootDamage);
          self.currentTargetEnemy = enemy;
          var dx = enemy.rect.center[0] - self.rect.center[0];
          var dy = enemy.rect.center[1] - self.rect.center[1];
          var theta = Math.atan2(dy, dx);
          var degrees = theta * 180/Math.PI; // rads to degs
          self.rotation = degrees;
          self.image = gamejs.transform.rotate(self.originalImage, self.rotation);
          console.log(enemy);
          console.log('Nearby! '+distance);
      } else {
          self.currentTargetEnemy = null;
      }
  };
  Tower.prototype.draw = function(surface) {
      surface.blit(this.image, this.rect);
      if (this.currentTargetEnemy != null) {
          draw.line(surface, '#FF0000', this.rect.center, this.currentTargetEnemy.rect.center);
      }
      return;

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

    var tower1 = new Tower(playSurface, [200, 50]);
    var tower2 = new Tower(playSurface, [250, 50]);
    var tower3 = new Tower(playSurface, [250, 100]);
    var tower4 = new Tower(playSurface, [250, 150]);
    var tower5 = new Tower(playSurface, [300, 150]);
    var tower6 = new Tower(playSurface, [350, 150]);

    // msDuration = time since last tick() call
    var tick = function(msDuration) {
        mainSurface.fill("#DFDFDF");
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
    };
    gamejs.time.fpsCallback(tick, this, 60);
 }

gamejs.preload(['images/enemy.png', 'images/enemy-1.png']);

gamejs.ready(main);