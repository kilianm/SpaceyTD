var gamejs = require('gamejs');
var draw = require('gamejs/draw');

var PlaySurface = exports.PlaySurface = function(rectSize,path) {
    this.rect = new gamejs.Rect([0,0], rectSize);
    this.path = path;

    this.draw = function(mainSurface) {
        draw.lines(mainSurface, "#FFAAEE", false, this.path, 4);
    };

    return this;
};

