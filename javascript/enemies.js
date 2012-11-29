var gamejs = require('gamejs');

var Enemy = exports.Enemy = function(playSurface) {
    // call superconstructor
    Enemy.superConstructor.apply(this, arguments);

    this.health = 1200;

    this.speed = 100; // pixels per second?
    this.destination_reached = false;
    this.distance_traveled = 0;

    this.originalImage = gamejs.image.load("images/enemy.png");
    var dims = this.originalImage.getSize();

    // determine target location
    this.rotation = 0;
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // determine start location
    this.path = playSurface.path;
    this.path_index = 1; // 0 = starting location
    this.path_target = function() {
        return this.path[this.path_index];
    };

    this.rect = new gamejs.Rect(this.path[0], dims);

    this.doDamage = function(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.kill();
        }
    };

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
     var distance = 0;
     var moved = false;

     if (target[x] > current[x]) {
         // move to right

         // Math.min is used to never exceed the target location and start
         // bouncing back and forth in corners.
         distance = Math.min(pixel_speed, target[x] - current[x]);
         this.rect.moveIp(distance, 0);
         moved = true;
     }
     if (target[x] < current[x]) {
         // move to left
         distance = -Math.min(pixel_speed, current[x] - target[x]);
         this.rect.moveIp(distance, 0);
         moved = true;
     }
     if (target[y] > current[y]) {
         // move to bottom
         distance = Math.min(pixel_speed, target[y] - current[y]);
         this.rect.moveIp(0, distance);
         moved = true;
     }
     if (target[y] < current[y]) {
         // move to top (not used yet in path)
         distance = -Math.min(pixel_speed, current[y] - target[y]);
         this.rect.moveIp(0, distance);
         moved = true;
     }

     this.distance_traveled += Math.abs(distance);

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