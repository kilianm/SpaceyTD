var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');
var enemies = require('./enemies');
var towers = require('./towers');

var PlaySurface = exports.PlaySurface = function(rectSize, path) {
        this.gEnemies = new gamejs.sprite.Group();
        this.gTowers = new gamejs.sprite.Group();
        this.gProjectiles = new gamejs.sprite.Group();
        this.particles = [];
        this.maxParticles = 500;
        this.gOverlay = new gamejs.sprite.Group();

        this.rect = new gamejs.Rect([0, 0], rectSize);
        this.path = path;
        this.pathThickness = 10;

        this.game_money = 200;
        this.high_score = 0;
        this.game_lives = 10;
        this.game_wave = 0;

        this.scoreAlreadyPublished = false;

        this.paused = false;

        this.hudGameOver = false;

        var font = new gamejs.font.Font('20px monospace');

        //convert path to Rects
        this.pathRects = [];
        var lastNode = null;
        for (x in this.path) {
            var pathNode = this.path[x];
            if (lastNode != null) {
                var nodeLT = null;
                var nodeRB = null;
                if (lastNode[0] == pathNode[0]) {
                    if (lastNode[1] > pathNode[1]) {
                        nodeLT = pathNode;
                        nodeRB = lastNode;
                    } else {
                        nodeLT = lastNode;
                        nodeRB = pathNode;
                    }
                } else if (lastNode[1] == pathNode[1]) {
                    if (lastNode[0] > pathNode[0]) {
                        nodeLT = pathNode;
                        nodeRB = lastNode;
                    } else {
                        nodeLT = lastNode;
                        nodeRB = pathNode;
                    }
                } else {
                    throw new Exception('Path is inballanced!');
                }
                var x = nodeLT[0] - this.pathThickness;
                var y = nodeLT[1] - this.pathThickness;
                var width = (nodeRB[0] - nodeLT[0]) + this.pathThickness*2;
                var height= (nodeRB[1] - nodeLT[1]) + this.pathThickness*2;

                var pathSegment = new gamejs.Rect([x, y], [width, height]);
                this.pathRects.push(pathSegment);
            }
            lastNode = pathNode;
        }

        this.spawnEnemy = function(enemy) {
            this.gEnemies.add(new enemy(this));
        };

        this.waves = [
          [enemies.BasicEnemy,
           enemies.VariatingSpeedEnemy,
           enemies.BasicEnemy,
           enemies.BasicEnemy],

          [enemies.FastEnemy,
           enemies.FastEnemy,
           enemies.VariatingSpeedEnemy,
           enemies.SlowFatEnemy,
           enemies.BasicEnemy,
           enemies.VariatingSpeedEnemy],

           [enemies.FastEnemy,
           enemies.BasicEnemy,
           enemies.FastEnemy,
           enemies.FastEnemy,
           enemies.SlowFatEnemy],

           [enemies.SlowFatEnemy,
            enemies.SlowFatEnemy,
            enemies.FastEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.SlowFatEnemy],

           [enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy,
            enemies.VariatingSpeedEnemy],

            [enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy,
             enemies.VariatingSpeedEnemy],

             [enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy,
              enemies.VariatingSpeedEnemy],

              [enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy,
               enemies.VariatingSpeedEnemy],

               [enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy,
                enemies.VariatingSpeedEnemy],

                [enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy,
                 enemies.VariatingSpeedEnemy],

                 [enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy,
                  enemies.VariatingSpeedEnemy],

                  [enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy,
                   enemies.VariatingSpeedEnemy],

                   [enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy,
                    enemies.VariatingSpeedEnemy],

                    [enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy,
                     enemies.VariatingSpeedEnemy],

                     [enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy,
                      enemies.VariatingSpeedEnemy],
        ];

        // before we have a nice list of waves, we now just construct some more waves based on previously defined waves
        var more_waves = Array();
        for(var i=0; i < this.waves.length; i++) {
            var new_wave = Array();
            for(var j=0; j < i+1;j++) {
                new_wave = new_wave.concat(this.waves[j]);
            }
            more_waves.push(new_wave);
        }
        this.waves = this.waves.concat(more_waves);

        this.spawnWave = function() {

            var self = this;
            var current_wave = this.waves[this.game_wave];
            // enemies
            var msBetweenEnemy = 500;
            var enemyCounter = 0;
            current_wave.forEach(function(enemy) {
                setTimeout(function() {
                    self.spawnEnemy(enemy);

                    self.nextWavePending = false;
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
        };

        this.addOverlay = function(overlay) {
            this.gOverlay.add(overlay);
        };

        this.update = function(msDuration) {
            if (this.game_lives == 0) {
                this.hudGameOver = true;
                this.game_money = 0; //keep resetting.. (hack)
            }

            this.gEnemies.update(msDuration);
            this.gTowers.update(msDuration);
            this.gProjectiles.update(msDuration);
            for (var i in this.particles) {
                this.particles[i].update(msDuration);
            }
            this.gOverlay.update(msDuration);
        };

        this.onEnemyEscaped = function(event) {
            if (this.game_lives > 0) {
                this.game_lives--;
            }
            if (this.game_lives == 0) {
                //update scores if the gameover api is loaded.
                if (GameOver && this.scoreAlreadyPublished == false) {
                    this.scoreAlreadyPublished = true;
                    GameOver.init({
                        appId      : '14' // App ID
                    });
                    GameOver.api("/me/score", "POST", {"score": this.high_score}, function(response) {
                        if (response && response.errorCode == 0) {
                            console.log('Score was published.');
                        } else {
                            console.log('Score was not published.');
                        }
                    });
                }
            }
        };

        this.drawHud = function(mainSurface) {
            mainSurface.blit(gamejs.image.load("images/icon-cash.png"), [700, 10]);
            mainSurface.blit(font.render(this.game_money, '#fff'), [735, 15]);

            mainSurface.blit(gamejs.image.load("images/icon-life.png"), [700, 40]);
            mainSurface.blit(font.render(this.game_lives, '#fff'), [735, 45]);

            mainSurface.blit(gamejs.image.load("images/icon-wave.png"), [700, 70]);
            mainSurface.blit(font.render((this.game_wave + 1), '#fff'), [735, 75]);

            if (this.hudGameOver) {
                mainSurface.blit(font.render("GAME OVER", '#fff'), [300, 160]);
                mainSurface.blit(font.render("Score: " + this.high_score, '#fff'), [300, 185]);
            }
        };

        this.draw = function(mainSurface) {
            for (var x in this.pathRects) {
                var pathSegment = this.pathRects[x];
                draw.rect(mainSurface, "rgba(255, 255, 255, 0.4)", pathSegment);
            }

            mainSurface.blit(gamejs.image.load("images/mask.png"), [20, 20]);
            mainSurface.blit(gamejs.image.load("images/target.png"), [470, 560]);

            this.gEnemies.draw(mainSurface);
            this.gTowers.draw(mainSurface);
            this.gProjectiles.draw(mainSurface);
            for (var i in this.particles) {
                this.particles[i].draw(mainSurface);
            }
            this.gOverlay.draw(mainSurface);

            //clean up particles
            while(this.particles.length > this.maxParticles) {
                this.particles.shift();
            }

            this.drawHud(mainSurface);
        };

        this.handleMainEvents = function() {
            var events = gamejs.event.get();
            var self = this;
            events.forEach(function(event) {
                if(event.type === gamejs.event.USEREVENT) {
                    if(event.data.type == 'enemy-killed') {
                        self.game_money += event.data.reward;
                        self.high_score += event.data.reward;
                    } else if(event.data.type == 'enemy-escaped') {
                        self.onEnemyEscaped(event);
                    }
                }
                if (event.type === gamejs.event.MOUSE_MOTION) {
                    // if mouse is over display surface
                    if (self.rect.collidePoint(event.pos)) {
                        self.buildOverlay.updateMouseLocation(event.pos);
                    }
                }

                if (event.type === gamejs.event.MOUSE_UP) {
                    self.buildOverlay.onMouseClick(event.pos);
                }
                if (event.type === gamejs.event.KEY_UP) {
                    if (event.key === gamejs.event.K_1) {
                        self.buildOverlay.setBuildTower(new towers.LaserTower(self));
                    }
                    if (event.key === gamejs.event.K_2) {
                        self.buildOverlay.setBuildTower(new towers.ProjectileTower(self));
                    }
                    if (event.key === gamejs.event.K_3) {
                        self.buildOverlay.setBuildTower(new towers.BurningTower(self));
                    }
                    if (event.key === gamejs.event.K_ESC) {
                        self.buildOverlay.setBuildTower(null);
                    }
                }
            });
        };
        this.handleGameControlEvents = function() {
            var events = gamejs.event.get();
            var self = this;
            events.forEach(function(event) {
                if (event.type === gamejs.event.USEREVENT && event.data.type == 'pause') {
                    self.paused = !self.paused;
                }
            });
        };

        this.buildOverlay = new BuildOverlay(this);
        this.addOverlay(this.buildOverlay);

        this.buy = function(amount) {
            if (this.canAfford) {
                this.game_money -= amount;
                return true;
            }
            return false;
        };

        this.canAfford = function(amount) {
            return (this.game_money - amount >= 0);
        };

        return this;
    };


var BuildOverlay = function(playSurface) {
    BuildOverlay.superConstructor.apply(this, arguments);
    this.playSurface = playSurface;

    this.visible = true;
    this.blocked = false;

    this.towerToBuild = null;

    this.rect = new gamejs.Rect([0,0], [0,0]);

    this.calculateSnapPosition = function(position) {
        var x = Math.round(position[0] / 10)*10;
        var y = Math.round(position[1] / 10)*10;
        return [x,y];
    };

    this.updateMouseLocation = function(position) {
        position = this.calculateSnapPosition(position);
        if (this.rect.center[0] != position[0] || this.rect.center[1] != position[1]) {
            //it actually moved.
            this.rect.center = position;
        }
    };

    this.onMouseClick = function(position) {
        if (this.towerToBuild && !this.blocked) {
            if (this.playSurface.canAfford(this.towerToBuild.price)) {
                console.log('building tower');
                this.towerToBuild.setLocation(this.rect.topleft);
                this.playSurface.addTower(this.towerToBuild);
                this.playSurface.buy(this.towerToBuild.price);
                this.setBuildTower(null);
            } else {
                console.log('cant afford');
            }
        }
    };

    this.setBuildTower = function(tower) {
        this.towerToBuild = tower;
        if (this.towerToBuild) {
            this.rect = new gamejs.Rect([this.rect.x, this.rect.y], tower.dims);
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    this.update = function(msDuration) {
        var self = this;
        if (this.visible) {
            self.blocked = false;
            this.playSurface.gTowers.forEach(function(tower) {
                var clipRect = self.rect.clip(tower.rect);
                if (clipRect.width !== 0 && clipRect.height !== 0) {
                    self.blocked = true;
                }
            });
            for (x in this.playSurface.pathRects) {
                var pathSegment = this.playSurface.pathRects[x];
                var clipRect = self.rect.clip(pathSegment);
                if (clipRect.width !== 0 && clipRect.height !== 0) {
                    self.blocked = true;
                }
            }
            if (this.towerToBuild && !this.playSurface.canAfford(this.towerToBuild.price)) {
                self.blocked = true;
            }
        }
//        if (!this.playSurface.canAfford(this.towerToBuild.price)) {
//            this.blocked = true;
//        }
    };

    this.draw = function(surface) {
        if (this.visible) {
            if (this.blocked) {
                draw.rect(surface, 'rgba(255, 0, 0, 0.4)', this.rect);
            } else {
                draw.rect(surface, 'rgba(0, 255, 0, 0.4)', this.rect);
            }
            if (this.towerToBuild) {
                draw.circle(surface, "rgba(255, 255, 255, 1)", this.rect.center, this.towerToBuild.shootRange, 2);
                draw.circle(surface, "rgba(255, 255, 255, 0.2)", this.rect.center, this.towerToBuild.shootRange);
            }
        }
    };
    return this;
};
gamejs.utils.objects.extend(BuildOverlay, gamejs.sprite.Sprite);
