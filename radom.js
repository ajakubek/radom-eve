var bottle = new Image();
bottle.src = 'assets/butelka0.png';


var upperLeftRail =  new Array([140, 90],  [155, 95],  [170, 100], [185, 105], [200, 130]);
var upperRightRail = new Array([360, 90],  [345, 95],  [330, 100], [315, 105], [300, 130]);
var lowerLeftRail =  new Array([140, 155], [155, 160], [170, 165], [185, 170], [200, 175]);
var lowerRightRail = new Array([360, 155], [345, 160], [330, 165], [315, 170], [300, 175]);

var leftEscape =     new Array([200, 205], [185, 205], [170, 205], [155, 205], [140, 205]);
var rightEscape =    new Array([300, 205], [315, 205], [330, 205], [345, 205], [360, 205]);
var playerPos =      new Array([183, 137], [195, 137], [195, 137], [183, 137]);

function drawPlayer(position, context) {
    var img_src = 'assets/baba' + position + '.png';
    var playerImg = new Image();
    playerImg.src = img_src;
    context.drawImage(playerImg, playerPos[position][0], playerPos[position][1]);
    
}

function drawScore(score, context) {
    context.textBaseline = 'top';
    context.font         = '12px lcd';
    context.fillText(score, 220, 110);
}


function update(state){

    var surface = document.querySelector("#game");
    var context = surface.getContext("2d");
    context.clearRect(0, 0, surface.width, surface.height);

    drawPlayer(state.playerDirection, context);
    drawScore(state.caughtCount, context);

    for(var i=0; i<5; i++) {
	
	if (state.upperLeftRail[i]) {
	    context.drawImage(bottle, upperLeftRail[i][0], upperLeftRail[i][1]);
	}
	if (state.lowerLeftRail[i]) {
	    context.drawImage(bottle, lowerLeftRail[i][0], lowerLeftRail[i][1]);
	}
	if (state.upperRightRail[i]) {
	    context.drawImage(bottle, upperRightRail[i][0], upperRightRail[i][1]);
	}
	if (state.lowerRightRail[i]) {
	    context.drawImage(bottle, lowerRightRail[i][0], lowerRightRail[i][1]);
	}
	if (state.leftEscape[i]) {
	    context.drawImage(bottle, leftEscape[i][0], leftEscape[i][1]);
	}
	if (state.rightEscape[i]) {
	    context.drawImage(bottle, rightEscape[i][0], rightEscape[i][1]);
	}
    }

    var decoration = new Image(); decoration.src = 'assets/bg.png';
    context.drawImage(decoration, 135, 78);

}

function handleKey(keyCode)
{
    var playerDir = Game.State.playerDirection;

    if (keyCode == 37)  // cursor left
    {
        if (playerDir == Game.Direction.UpperRight)
            Game.setPlayerDirection(Game.Direction.UpperLeft);
        else if (playerDir == Game.Direction.LowerRight)
            Game.setPlayerDirection(Game.Direction.LowerLeft);

    }
    else if (keyCode == 38) // cursor up
    {
        if (playerDir == Game.Direction.LowerLeft)
            Game.setPlayerDirection(Game.Direction.UpperLeft);
        else if (playerDir == Game.Direction.LowerRight)
            Game.setPlayerDirection(Game.Direction.UpperRight);
    }
    else if (keyCode == 39) // cursor right
    {
        if (playerDir == Game.Direction.UpperLeft)
            Game.setPlayerDirection(Game.Direction.UpperRight);
        else if (playerDir == Game.Direction.LowerLeft)
            Game.setPlayerDirection(Game.Direction.LowerRight);
    }
    else if (keyCode == 40) // cursor down
    {
        if (playerDir == Game.Direction.UpperLeft)
            Game.setPlayerDirection(Game.Direction.LowerLeft);
        else if (playerDir == Game.Direction.UpperRight)
            Game.setPlayerDirection(Game.Direction.LowerRight);
    }
}

function registerKeyHandler()
{
    document.onkeydown = function(e)
    {
        if (!e)
            var e = window.event;
        if (e)
        {
            e.cancelBubble = true;
            if (e.stopPropagation)
                e.stopPropagation();

            var keyCode = e.charCode ? e.charCode : e.keyCode;
            handleKey(keyCode);
        }
    };
}

function init()
{
    registerKeyHandler();
    Game.onStateChange(update);
}
