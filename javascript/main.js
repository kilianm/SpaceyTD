/**
 * A bare bones Sprite and sprite Group example.
 *
 * We move a lot of Ship sprites across the screen with varying speed. The sprites
 * rotate themselves randomly. The sprites bounce back from the bottom of the
 * screen.
 */

var playsurface = require('./playsurface');
var gamejs = require('gamejs');

function main() {
   // screen setup
   gamejs.display.setMode([800, 600]);
   // game loop
   var mainSurface = gamejs.display.getSurface();
   mainSurface.fill("#DFDFDF");

   playSurface = new playsurface.PlaySurface([800, 600], [[0,10], [300,10], [300,100], [600,100], [600,300], [200,300], [200,400], [400,400], [400,600]]);
   playSurface.draw(mainSurface);

   // msDuration = time since last tick() call
   var tick = function(msDuration) {
         // update and draw the ships
   };
   gamejs.time.fpsCallback(tick, this, 60);
}

/**
 * M A I N
 */
gamejs.ready(main);