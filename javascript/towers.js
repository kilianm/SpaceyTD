var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var $v = require('gamejs/utils/vectors');


var Tower = function(playSurface) {
    Tower.superConstructor.apply(this, arguments);

    this.playSurface = playSurface;

    this.rotation = 0;
    this.currentTargetEnemy = null;

    this.dims = [40, 40];
    this.rect = new gamejs.Rect([0,0], this.dims);

    this.setLocation = function(position) {
        this.rect = new gamejs.Rect(position, this.dims);
    }
};
gamejs.utils.objects.extend(Tower, gamejs.sprite.Sprite);

//LASER TOWER
var LaserTower = exports.LaserTower = function(playSurface) {
    LaserTower.superConstructor.apply(this, arguments);

    this.originalImage = gamejs.image.load("images/laser-tower.png");
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // config
    this.rotationSpeed = 50;
    this.shootRange = 150;
    this.shootDamage = 3;

    return this;
};
// inherit (actually: set prototype)
gamejs.utils.objects.extend(LaserTower, Tower);
LaserTower.prototype.update = function(msDuration) {
    var self = this;
    var enemiesInRange = {};
    var enemyDistances = [];
    this.playSurface.gEnemies.forEach(function(enemy) {
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

        // some animation to turn the turrents ('look for targets') when
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
        var particleCount = 3;
        for(var i=0; i<particleCount;i++)
        {
            var particle = new LaserParticle(this.playSurface, this.currentTargetEnemy.rect.center);
            this.playSurface.particles.push(particle);
        }
    }
    return;
};


// BURNING TOWER
var BurningTower = exports.BurningTower = function(playSurface) {
    BurningTower.superConstructor.apply(this, arguments);

    this.originalImage = gamejs.image.load("images/pulse-tower.png");
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // config
    this.shootRange = 80;
    this.shootDamage = 3;

    // dynamic
    this.shooting = false;
    this.shootingAnimation = 0;

    return this;
};
// inherit (actually: set prototype)
gamejs.utils.objects.extend(BurningTower, Tower);
BurningTower.prototype.update = function(msDuration) {
    var self = this;
    var enemiesInRange = [];
    this.playSurface.gEnemies.forEach(function(enemy) {
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


//PROJECTILE TOWER
var ProjectileTower = exports.ProjectileTower = function(playSurface) {
    ProjectileTower.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    this.originalImage = gamejs.image.load("images/enemy-1.png");
    this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

    // config
    this.rotationSpeed = 50;
    this.shootRange = 250;
    this.shootDamage = 100;
    this.projectileSpeed = 250;
    this.msShootRatio = 200;

    // dynamic
    this.msSinceLastShot = 0;

    return this;
};
// inherit (actually: set prototype)
gamejs.utils.objects.extend(ProjectileTower, Tower);
ProjectileTower.prototype.update = function(msDuration) {
    this.msSinceLastShot += msDuration;

    var self = this;
    var enemiesInRange = {};
    var enemyDistances = [];
    this.playSurface.gEnemies.forEach(function(enemy) {
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

        if(this.msSinceLastShot >= this.msShootRatio) {
            var projectile = new Projectile(self.playSurface, self.rect.center, enemy, self.projectileSpeed, self.shootDamage);
            self.playSurface.addProjectile(projectile);

            this.msSinceLastShot = 0;
        }

        self.rotation = calculateDegreeByPoints(self.rect.center, enemy.rect.center);
        self.image = gamejs.transform.rotate(self.originalImage, self.rotation);
    } else {
        self.currentTargetEnemy = null;

        // some animation to turn the turrents ('look for targets') when
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
ProjectileTower.prototype.draw = function(surface) {
    surface.blit(this.image, this.rect);
};

var calculateDegreeByPoints = function(pointLooking, pointLooked) {
    var dx = pointLooked[0] - pointLooking[0];
    var dy = pointLooked[1] - pointLooking[1];
    var theta = Math.atan2(dy, dx);
    var degrees = theta * 180 / Math.PI; // rads to degs
    return degrees;
};

var Projectile = function(playSurface, location, enemy, speed, damage) {
    Projectile.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    // determine target location
    this.rotation = 0;

    this.speed = speed;
    this.damage = damage;

    this.enemy = enemy;

    this.rect = new gamejs.Rect(location, [1, 1]);

    this.update = function(msDuration) {

        var target = this.enemy.rect.center;
        var current = this.rect.center;

        var dx = target[0] - current[0];
        var dy = target[1] - current[1];

        var theta = Math.atan2(dy, dx);

        var pixel_speed = this.speed * (msDuration / 1000);

        var distance = $v.distance(current, target);

        var x = Math.cos(theta) * Math.min(distance, pixel_speed);
        var y = Math.sin(theta) * Math.min(distance, pixel_speed);

        this.rect.moveIp([x,y]);

        // hit!
        if (distance < 3) { // some acceptable hit range
            enemy.doDamage(damage);
            this.kill();
        }
    };

    this.draw = function(surface) {
        draw.circle(surface, 'rgba(255, 255, 0, 0.7)', this.rect.center, 2);

    };
    return this;
};
gamejs.utils.objects.extend(Projectile, gamejs.sprite.Sprite);


var LaserParticle = function(playSurface, location) {
    LaserParticle.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    this.posX = location[0];
    this.posY = location[1];

    this.velX = (Math.random()*2)-1;
    this.velY = (Math.random()*2)-1;
    this.drag = 0.96;

    this.shrink = 1;
    this.size = 1.5;

    // current transparency of the image
    this.alpha = 1;
    // subtracted from the alpha every frame to make it fade out
    this.fade = 0.08;

    this.rect = new gamejs.Rect(location, [1, 1]);

    this.update = function(msDuration) {
        // simulate drag
        this.velX *= this.drag;
        this.velY *= this.drag;

        // and the velocity to the position
        this.posX += this.velX;
        this.posY += this.velY;

        // shrink the particle
        //this.size *= this.shrink;

        // and fade it out
        this.alpha -= this.fade;
    };

    this.draw = function(surface) {
        var c = surface.context;
        // set the fill style to have the right alpha
        var greenC = Math.round(Math.random()*255);
        c.fillStyle = "rgba(255,"+greenC+",0,"+this.alpha+")";

        // draw a circle of the required size
        c.beginPath();
        c.arc(this.posX, this.posY, this.size, 0, Math.PI*2, true);
        c.closePath();

        // and fill it
        c.fill();
    };
    return this;
};
gamejs.utils.objects.extend(LaserParticle, gamejs.sprite.Sprite);
