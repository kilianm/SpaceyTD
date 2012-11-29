var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');

var PlaySurface = exports.PlaySurface = function(rectSize,path) {
    this.rect = new gamejs.Rect([0,0], rectSize);
    this.path = path;

    this.game_money = 0;
    this.game_lives = 10;

    var font = new gamejs.font.Font('20px monospace');

    this.draw = function(mainSurface) {
        draw.lines(mainSurface, "#F78181", false, this.path, 10);

        mainSurface.blit(font.render('$ ' + this.game_money, '#fff'), [700, 10]);
        mainSurface.blit(font.render('L ' + this.game_lives, '#fff'), [700, 40]);
    };
    this.handleMainEvents = function() {
        var events = gamejs.event.get();
        var self = this;
        events.forEach(function(event) {
            if (event.type === gamejs.event.USEREVENT) {
                if (event.data.type == 'enemy-killed') {
                    self.game_money += event.data.reward;
                } else if (event.data.type == 'enemy-escaped') {
                    self.game_lives--;
                }
            }
        });
    };

    return this;
};
