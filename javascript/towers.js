var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var $v = require('gamejs/utils/vectors');


//LASER TOWER
var LaserTower = exports.LaserTower = function(playSurface, location) {
     LaserTower.superConstructor.apply(this, arguments);

     this.originalImage = gamejs.image.load("images/enemy.png");
     var dims = [40,40];//this.originalImage.getSize();

     // determine target location
     this.rotation = 0;
     this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

     this.shootRange = 150;
     this.shootDamage = 3;

     this.currentTargetEnemy = null;

     this.rect = new gamejs.Rect(location, dims);
     return this;
  };
  // inherit (actually: set prototype)
  gamejs.utils.objects.extend(LaserTower, gamejs.sprite.Sprite);
  LaserTower.prototype.update = function(msDuration, gEnemies) {
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
  LaserTower.prototype.draw = function(surface) {
      surface.blit(this.image, this.rect);
      if (this.currentTargetEnemy != null) {
          draw.line(surface, '#FF0000', this.rect.center, this.currentTargetEnemy.rect.center);
      }
      return;

  };



  // BURNING TOWER
  var BurningTower = exports.BurningTower = function(playSurface, location) {
      BurningTower.superConstructor.apply(this, arguments);

      this.originalImage = gamejs.image.load("images/enemy-1.png");
      var dims = [40,40];//this.originalImage.getSize();

      // determine target location
      this.rotation = 0;
      this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

      this.shootRange = 80;
      this.shootDamage = 3;

      this.shooting = false;
      this.shootingAnimation = 0;

      this.rect = new gamejs.Rect(location, dims);
      return this;
   };
   // inherit (actually: set prototype)
   gamejs.utils.objects.extend(BurningTower, gamejs.sprite.Sprite);
   BurningTower.prototype.update = function(msDuration, gEnemies) {
       var self = this;
       var enemiesInRange = [];
       gEnemies.forEach(function(enemy){
           distance = $v.distance(self.rect.center, enemy.rect.center);
           if (distance < self.shootRange) {
               enemiesInRange.push(enemy);
           }
       });
       if (enemiesInRange.length > 0) {
           for (var k in enemiesInRange) {
               var enemy = enemiesInRange[k];
               enemy.doDamage(self.shootDamage);
           }
           self.shooting = true;
       } else {
           self.shooting = false;
           this.shootingAnimation = 0;
       }
   };
   BurningTower.prototype.draw = function(surface) {
       surface.blit(this.image, this.rect);
       if (this.shooting == true) {
           if (this.shootingAnimation >= this.shootRange) {
               this.shootingAnimation = 5;
           }
           if (this.shootingAnimation < this.shootRange) {
               this.shootingAnimation += 5;
           }
           if (this.shootingAnimation > this.shootRange) {
               this.shootingAnimation = this.shootRange;
           }
           draw.circle(surface, 'rgba(255, 0, 0, 0.25)', this.rect.center, this.shootingAnimation);
       }
       return;

   };

