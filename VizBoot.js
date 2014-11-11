var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var viz = new Viz(ctx);

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var start = window.mozAnimationStartTime;  // Only supported in FF. Other browsers can use something like Date.now().

var printDelaySum = 0;

viz.init();

function step() {

	if(!viz.lastTime) {
		viz.lastTime = new Date().getTime;
		viz.fps = 0;
		viz.ticks = 0;
		step();
	}
	var now = new Date().getTime();
	viz.ticks = (now - viz.lastTime)/1000;
  	viz.lastTime = now;
  	viz.fps = 1/viz.ticks;

	/*printDelaySum += viz.ticks;
	if(printDelaySum >= 2000){
		printDelaySum = 0;
		//wdswviz.debugOutput();
	}*/		

    viz.draw();
    viz.update();
    requestAnimationFrame(step);
}

$(document).bind('keydown keyup', function (event) {
    viz.input(event);
});

requestAnimationFrame(step);