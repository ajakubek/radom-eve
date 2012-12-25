var bottle = new Image();
bottle.src = 'assets/butelka0.png';


var upperLeftRail =  new Array([140, 90],  [155, 95],  [170, 100], [185, 105], [200, 130]);
var upperRightRail = new Array([360, 90],  [345, 95],  [330, 100], [315, 105], [300, 130]);
var lowerLeftRail =  new Array([140, 155], [155, 160], [170, 165], [185, 170], [200, 175]);
var lowerRightRail = new Array([360, 155], [345, 160], [330, 165], [315, 170], [300, 175]);

var leftEscape =     new Array([200, 205], [185, 205], [170, 205], [155, 205], [140, 205]);
var rightEscape =    new Array([300, 205], [315, 205], [330, 205], [345, 205], [360, 205]);
var playerPos =      new Array([183, 138], [195, 138], [195, 138], [183, 138]);

function drawPlayer(position, context) {
    var img_src = 'assets/baba' + position + '.png';
    var playerImg = new Image();
    playerImg.src = img_src;
    context.drawImage(playerImg, playerPos[position][0], playerPos[position][1]);
    
}

function drawScore(score, context) {
    context.fillStyle = '#f00';
    context.font = '12px "LCDBOLD"';
    context.textBaseline = 'bottom';
    context.fillText(score, 210, 120);
}


function update(game){
    console.log(game);


    var surface = document.querySelector("#game");
    var context = surface.getContext("2d");

    drawPlayer(game.playerDirection, context);
    drawScore(game.generatedCount, context);

    for(var i=0; i<5; i++) {
	
	if (game.upperLeftRail[i]) {
	    context.drawImage(bottle, upperLeftRail[i][0], upperLeftRail[i][1]);
	}
	if (game.lowerLeftRail[i]) {
	    context.drawImage(bottle, lowerLeftRail[i][0], lowerLeftRail[i][1]);
	}
	if (game.upperRightRail[i]) {
	    context.drawImage(bottle, upperRightRail[i][0], upperRightRail[i][1]);
	}
	if (game.lowerRightRail[i]) {
	    context.drawImage(bottle, lowerRightRail[i][0], lowerRightRail[i][1]);
	}
	if (game.leftEscape[i]) {
	    context.drawImage(bottle, leftEscape[i][0], leftEscape[i][1]);
	}
	if (game.rightEscape[i]) {
	    context.drawImage(bottle, rightEscape[i][0], rightEscape[i][1]);
	}
    }

    var decoration = new Image(); decoration.src = 'assets/bg.png';
    context.drawImage(decoration, 135, 78);

}

function init()
{
    Game.onStateChange(update);
}

