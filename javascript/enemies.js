var gamejs = require('gamejs');
var draw = require('gamejs/draw');

var Enemy = exports.Enemy = function(playSurface) {
    // call superconstructor
    Enemy.superConstructor.apply(this, arguments);
    this.playSurface = playSurface

    // config
    this.rotateCorners = false;
    // subclasses need to set:
    // - reward
    // - speed
    // - health (start_health)

    // dynamic
    this.destination_reached = false;
    this.distance_traveled = 0;

    // determine start location
    this.path = playSurface.path;
    this.path_index = 1; // 0 = starting location
    this.path_target = function() {
        return this.path[this.path_index];
    };

    this.loadImage = function(image) {
        this.originalImage = gamejs.image.load(image);
        this.rotation = 0;
        this.image = gamejs.transform.rotate(this.originalImage, this.rotation);

        var dims = this.originalImage.getSize();
        this.rect = new gamejs.Rect(this.path[0], dims);
    };

    // variable per enemy
    this.setHealth = function(health) {
        this.start_health = health;
        this.health = this.start_health;
    };
    this.setSpeed = function(speed) {
        this.speed = speed;
    };
    this.setRotateCorners = function(bool) {
        this.rotateCorners = bool;
    };
    this.setReward = function(reward) {
        this.reward = reward;
    };

    this.doDamage = function(damage) {
        if (this.isDead()) {
            return;
        }
        this.health -= damage;
        if(this.health <= 0) {
            gamejs.event.post({
                type: gamejs.event.USEREVENT,
                data: {
                    'type': 'enemy-killed',
                    'reward': this.reward
                }
            });

            var particleCount = 20;
            for(var i=0; i<particleCount;i++)
            {
                var particle = new ExplosionParticle(this.playSurface, this.rect.center);
                this.playSurface.particles.push(particle);
                var particle = new ExplosionPartParticle(this.playSurface, this.rect.center);
                this.playSurface.particles.push(particle);
            }

            this.kill();
        }
    };

    return this;
};

// inherit (actually: set prototype)
gamejs.utils.objects.extend(Enemy, gamejs.sprite.Sprite);
Enemy.prototype.update = function(msDuration) {
    if(this.destination_reached) {
        return;
    }
    var x = 0;
    var y = 1;
    var target = this.path_target();
    var current = this.rect.center;

    var pixel_speed = this.speed * (msDuration / 1000);
    var distance = 0;
    var moved = false;

    if(target[x] > current[x]) {
        // move to right
        // Math.min is used to never exceed the target location and start
        // bouncing back and forth in corners.
        distance = Math.min(pixel_speed, target[x] - current[x]);
        this.rect.moveIp(distance, 0);
        moved = true;
    }
    if(target[x] < current[x]) {
        // move to left
        distance = -Math.min(pixel_speed, current[x] - target[x]);
        this.rect.moveIp(distance, 0);
        moved = true;
    }
    if(target[y] > current[y]) {
        // move to bottom
        distance = Math.min(pixel_speed, target[y] - current[y]);
        this.rect.moveIp(0, distance);
        moved = true;
    }
    if(target[y] < current[y]) {
        // move to top (not used yet in path)
        distance = -Math.min(pixel_speed, current[y] - target[y]);
        this.rect.moveIp(0, distance);
        moved = true;
    }

    this.distance_traveled += Math.abs(distance);

    if(!moved) {
        // if we didn't move, it means we reached the target destination
        // so we set new path destination for next tick.
        this.path_index++;
        if(this.path.length == this.path_index) {
            gamejs.event.post({
                type: gamejs.event.USEREVENT,
                data: {
                    'type': 'enemy-escaped'
                }
            });
            this.kill();
            return;
        }

        // rotate
        if (this.rotateCorners) {
            var new_target = this.path_target();
            if(new_target[x] > target[x]) {
                this.rotation = 0;
            }
            if(new_target[x] < target[x]) {
                this.rotation = -180;
            }
            if(new_target[y] > target[y]) {
                this.rotation = 90;
            }
            if(new_target[y] < target[y]) {
                this.rotation = -90;
            }
            this.image = gamejs.transform.rotate(this.originalImage, this.rotation);
        }
    }
};
Enemy.prototype.draw = function(surface) {
    surface.blit(this.image, this.rect);

    // health bar
    var healthRatio = (this.health / this.start_health);
    var healthbarHeight = 3;
    var healthbarWidth = Math.floor(this.rect.width * healthRatio);
    draw.rect(surface, 'green', new gamejs.Rect([this.rect.left, this.rect.top - healthbarHeight], [this.rect.width, healthbarHeight]), 1);
    draw.rect(surface, 'green', new gamejs.Rect([this.rect.left, this.rect.top - healthbarHeight], [healthbarWidth, healthbarHeight]), 0);
};


var BasicEnemy = exports.BasicEnemy = function(playSurface) {
    BasicEnemy.superConstructor.apply(this, arguments);

    this.loadImage("images/enemy-blue.png");

    this.setReward(100);
    this.setHealth(1800);
    this.setSpeed(100);

    return this;
};
gamejs.utils.objects.extend(BasicEnemy, Enemy);

var SlowFatEnemy = exports.SlowFatEnemy = function(playSurface) {
    SlowFatEnemy.superConstructor.apply(this, arguments);

    this.loadImage("images/enemy-green.png");

    this.setReward(50);
    this.setHealth(3000);
    this.setSpeed(50);

    return this;
};
gamejs.utils.objects.extend(SlowFatEnemy, Enemy);

var FastEnemy = exports.FastEnemy = function(playSurface) {
    FastEnemy.superConstructor.apply(this, arguments);

    this.loadImage("images/enemy.png");

    this.setReward(10);
    this.setHealth(1800);
    this.setSpeed(200);
    this.setRotateCorners(true);

    return this;
};
gamejs.utils.objects.extend(FastEnemy, Enemy);

var ExplosionParticle = function(playSurface, location) {
    ExplosionParticle.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    this.posX = location[0];
    this.posY = location[1];

    this.velX = (Math.random()*2)-1;
    this.velY = (Math.random()*2)-1;
    this.drag = 0.96;

    this.shrink = 1;
    this.size = Math.round(Math.random()*15);

    // current transparency of the image
    this.alpha = 1;
    // subtracted from the alpha every frame to make it fade out
    this.fade = 0.03;

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
gamejs.utils.objects.extend(ExplosionParticle, gamejs.sprite.Sprite);

var ExplosionPartParticle = function(playSurface, location) {
    ExplosionPartParticle.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    this.posX = location[0];
    this.posY = location[1];

    this.velX = (Math.random()*50)-25;
    this.velY = (Math.random()*50)-25;
    this.drag = 0.90;

    this.shrink = 1;
    this.size = Math.round(Math.random()*15);

    // current transparency of the image
    this.alpha = 1;
    // subtracted from the alpha every frame to make it fade out
    this.fade = 0.10;

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
        c.fillStyle = "rgba(255,255,255,"+this.alpha+")";

        // draw a circle of the required size
        c.beginPath();
        c.arc(this.posX, this.posY, this.size, 0, Math.PI*2, true);
        c.closePath();

        // and fill it
        c.fill();
    };
    return this;
};
gamejs.utils.objects.extend(ExplosionPartParticle, gamejs.sprite.Sprite);
