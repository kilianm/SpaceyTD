var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var $v = require('gamejs/utils/vectors');


//LASER TOWER
var LaserTower = exports.LaserTower = function(playSurface, location) {
        LaserTower.superConstructor.apply(this, arguments);

        this.originalImage = gamejs.image.load("images/enemy.png");
        var dims = [40, 40]; //this.originalImage.getSize();
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
    this.rotationSpeed = 50;

    var self = this;
    var enemiesInRange = {};
    var enemyDistances = [];
    gEnemies.forEach(function(enemy) {
        var distance = $v.distance(self.rect.center, enemy.rect.center);
        if(distance < self.shootRange) {
            enemiesInRange[enemy.distance_traveled] = enemy;
            enemyDistances.push(enemy.distance_traveled);
        }
    });
    if(enemyDistances.length > 0) {
        enemyDistances.sort(function(a, b) {
            return a - b;
        });
        enemy = enemiesInRange[enemyDistances.pop()];
        enemy.doDamage(self.shootDamage);
        self.currentTargetEnemy = enemy;
        self.rotation = calculateDegreeByPoints(self.rect.center, enemy.rect.center);
        self.image = gamejs.transform.rotate(self.originalImage, self.rotation);
    } else {
        self.currentTargetEnemy = null;

        // some anymation to turn the turrents ('look for targest') when
        // turret is idle
        if(self.target_rotation == null) {
            self.target_rotation = Math.random() * 180;
            if(Math.random() > 0.5) {
                self.target_rotation_direction = 1;
            } else {
                self.target_rotation += 180;
                self.target_rotation_direction = -1;
            }
        }
        self.rotation += (msDuration / 1000) * self.rotationSpeed * self.target_rotation_direction;
        if(Math.abs(self.rotation) > 300) {
            self.target_rotation = Math.random() * 180;
            self.target_rotation_direction *= -1;
        }
        self.image = gamejs.transform.rotate(self.originalImage, self.rotation);
    }
};
LaserTower.prototype.draw = function(surface) {
    surface.blit(this.image, this.rect);
    if(this.currentTargetEnemy != null) {
        draw.line(surface, '#FF0000', this.rect.center, this.currentTargetEnemy.rect.center);
    }
    return;

};


// BURNING TOWER
var BurningTower = exports.BurningTower = function(playSurface, location) {
        BurningTower.superConstructor.apply(this, arguments);

        this.originalImage = gamejs.image.load("images/enemy-1.png");
        var dims = [40, 40]; //this.originalImage.getSize();
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
    gEnemies.forEach(function(enemy) {
        distance = $v.distance(self.rect.center, enemy.rect.center);
        if(distance < self.shootRange) {
            enemiesInRange.push(enemy);
        }
    });
    if(enemiesInRange.length > 0) {
        for(var k in enemiesInRange) {
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
    if(this.shooting == true) {
        if(this.shootingAnimation >= this.shootRange) {
            this.shootingAnimation = 5;
        }
        if(this.shootingAnimation < this.shootRange) {
            this.shootingAnimation += 5;
        }
        if(this.shootingAnimation > this.shootRange) {
            this.shootingAnimation = this.shootRange;
        }
        draw.circle(surface, 'rgba(255, 0, 0, 0.25)', this.rect.center, this.shootingAnimation);
    }
    return;

};


var calculateDegreeByPoints = function(pointLooking, pointLooked) {
    var dx = pointLooked[0] - pointLooking[0];
    var dy = pointLooked[1] - pointLooking[1];
    var theta = Math.atan2(dy, dx);
    var degrees = theta * 180 / Math.PI; // rads to degs
    return degrees;
};
