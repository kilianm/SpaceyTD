var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');
var enemies = require('./enemies');

var PlaySurface = exports.PlaySurface = function(rectSize, path) {
        this.gEnemies = new gamejs.sprite.Group();
        this.gTowers = new gamejs.sprite.Group();
        this.gProjectiles = new gamejs.sprite.Group();
        this.gParticles = new gamejs.sprite.Group();
        this.gOverlay = new gamejs.sprite.Group();

        this.rect = new gamejs.Rect([0, 0], rectSize);
        this.path = path;

        this.game_money = 0;
        this.game_lives = 10;
        this.game_wave = 0;

        var font = new gamejs.font.Font('20px monospace');

        this.spawnEnemy = function(enemy) {
            this.gEnemies.add(new enemy(this));
        };

        this.waves = [[enemies.BasicEnemy,
                       enemies.SlowFatEnemy,
                       enemies.FastEnemy],

                      [enemies.FastEnemy,
                       enemies.FastEnemy,
                       enemies.SlowFatEnemy,
                       enemies.BasicEnemy],

                       enemies.BasicEnemy,
                       enemies.BasicEnemy,
                       enemies.BasicEnemy,
                       enemies.BasicEnemy];

        this.spawnWave = function() {
            var self = this;
            var current_wave = this.waves[this.game_wave];
            // enemies
            var msBetweenEnemy = 500;
            var enemyCounter = 0;
            current_wave.forEach(function(enemy) {
                setTimeout(function() {
                    self.spawnEnemy(enemy);
                }, enemyCounter * msBetweenEnemy);
                enemyCounter++;
            });
        };

        this.nextWavePending = false;

        this.nextWave = function() {
            this.game_wave++;
            this.spawnWave();
        };

        this.hasWaves = function() {
            return (this.game_wave != this.waves.length - 1);
        };

        this.handleWaves = function() {
            var secBetweenWaves = 3;
            if (this.gEnemies.sprites().length == 0) {
                if (this.nextWavePending || !this.hasWaves()) {
                    return;
                }
                this.nextWavePending = true;
                // set timer, show message that next wave will begin in....
                var self = this;

                //this.buildOverlay.blit(font.render('Next wave starting in ' + secBetweenWaves), [700, 10]);
                setTimeout(function() {
                    self.nextWave();
                }, secBetweenWaves * 1000);
            }
        };

        this.addTower = function(tower) {
            this.gTowers.add(tower);
        };

        this.addProjectile = function(projectile) {
            this.gProjectiles.add(projectile);
        }

        this.addParticle = function(particle) {
            this.gParticles.add(particle);
        }

        this.addOverlay = function(overlay) {
            this.gOverlay.add(overlay);
        }

        this.update = function(msDuration) {
            this.gEnemies.update(msDuration);
            this.gTowers.update(msDuration);
            this.gProjectiles.update(msDuration);
            this.gParticles.update(msDuration);
            this.gOverlay.update(msDuration);
        };

        this.draw = function(mainSurface) {
            draw.lines(mainSurface, "#F78181", false, this.path, 10);

            mainSurface.blit(font.render('$ ' + this.game_money, '#fff'), [700, 10]);
            mainSurface.blit(font.render('L ' + this.game_lives, '#fff'), [700, 40]);
            this.gEnemies.draw(mainSurface);
            this.gTowers.draw(mainSurface);
            this.gProjectiles.draw(mainSurface);
            this.gParticles.draw(mainSurface);
            this.gOverlay.draw(mainSurface);
        };

        this.handleMainEvents = function() {
            var events = gamejs.event.get();
            var self = this;
            events.forEach(function(event) {
                if(event.type === gamejs.event.USEREVENT) {
                    if(event.data.type == 'enemy-killed') {
                        self.game_money += event.data.reward;
                    } else if(event.data.type == 'enemy-escaped') {
                        self.game_lives--;
                    }
                }
                if (event.type === gamejs.event.MOUSE_MOTION) {
                    // if mouse is over display surface
                    if (self.rect.collidePoint(event.pos)) {
                        self.buildOverlay.updateMouseLocation(event.pos);
                    }
                }
            });
        };

        this.buildOverlay = new BuildOverlay(this);
        this.addOverlay(this.buildOverlay);


        return this;
    };


var BuildOverlay = function(playSurface) {
    BuildOverlay.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    this.visible = true;

    this.rect = new gamejs.Rect([0,0], [50, 50]);

    this.updateMouseLocation = function(position) {
        var x = Math.round(position[0] / 10)*10;
        var y = Math.round(position[1] / 10)*10;
        this.rect.center = [x, y];
        //this.rect = new gamejs.Rect(position, [50, 50]);
        //this.rect.moveIp([position[0], position[1]]);
    }

    this.update = function(msDuration) {

    };

    this.draw = function(surface) {
        draw.rect(surface, 'rgba(0, 255, 0, 0.4)', this.rect);

    };
    return this;
};
gamejs.utils.objects.extend(BuildOverlay, gamejs.sprite.Sprite);
