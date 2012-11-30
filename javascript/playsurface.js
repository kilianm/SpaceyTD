var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');
var enemies = require('./enemies');

var PlaySurface = exports.PlaySurface = function(rectSize, path) {
        this.gEnemies = new gamejs.sprite.Group();
        this.gTowers = new gamejs.sprite.Group();
        this.gProjectiles = new gamejs.sprite.Group();

        this.rect = new gamejs.Rect([0, 0], rectSize);
        this.path = path;

        this.game_money = 0;
        this.game_lives = 10;

        var font = new gamejs.font.Font('20px monospace');

        this.spawnEnemy = function() {
            this.gEnemies.add(new enemies.Enemy(this));
        };

        this.addTower = function(tower) {
            this.gTowers.add(tower);
        };

        this.addProjectile = function(projectile) {
            this.gProjectiles.add(projectile);
        }

        this.update = function(msDuration) {
            this.gEnemies.update(msDuration);
            this.gTowers.update(msDuration);
            this.gProjectiles.update(msDuration);
        };

        this.draw = function(mainSurface) {
            draw.lines(mainSurface, "#F78181", false, this.path, 10);

            mainSurface.blit(font.render('$ ' + this.game_money, '#fff'), [700, 10]);
            mainSurface.blit(font.render('L ' + this.game_lives, '#fff'), [700, 40]);
            this.gEnemies.draw(mainSurface);
            this.gTowers.draw(mainSurface);
            this.gProjectiles.draw(mainSurface);
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
            });
        };

        return this;
    };