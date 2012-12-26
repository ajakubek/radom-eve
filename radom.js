var loader =  new Loader();

var playerImageNames = [];
playerImageNames[Game.Direction.UpperLeft]  = 'player_upper_left';
playerImageNames[Game.Direction.UpperRight] = 'player_upper_right';
playerImageNames[Game.Direction.LowerLeft]  = 'player_lower_left';
playerImageNames[Game.Direction.LowerRight] = 'player_lower_right';

var upperLeftRail =  new Array([140, 90],  [155, 95],  [170, 100], [185, 105], [200, 130]);
var upperRightRail = new Array([360, 90],  [345, 95],  [330, 100], [315, 105], [300, 130]);
var lowerLeftRail =  new Array([140, 155], [155, 160], [170, 165], [185, 170], [200, 175]);
var lowerRightRail = new Array([360, 155], [345, 160], [330, 165], [315, 170], [300, 175]);

var leftEscape =     new Array([200, 205], [185, 205], [170, 205], [155, 205], [140, 205]);
var rightEscape =    new Array([300, 205], [315, 205], [330, 205], [345, 205], [360, 205]);

var playerPos =      new Array([195, 137], [183, 137], [183, 137], [195, 137]);

function zeroFill(number, width) {
    width -= (number.toString().length - /\./.test(number));
    if (width > 0) {
        return new Array(width + 1).join('0') + number;
    }
    return number + ""; // always return a string
}


function drawPlayer(position, context) {
    var playerImage = loader.getImage(playerImageNames[position]);
    context.drawImage(playerImage, playerPos[position][0], playerPos[position][1]);
    
}


function drawScore(score, fails, context) {
    context.textBaseline = 'top';
    context.font         = '18px lcd';
    context.fillStyle    = '#3e3e3e';
    context.fillText(zeroFill(score, 4), 220, 98);
    var lemonImage = loader.getImage('lemon');
    var lemons = Math.abs(3-fails);
    for(var i=0;i<lemons;i++){
	var x = 245 - i * 15;
	context.drawImage(lemonImage, x, 115);
    }
}


function update(state){

    var surface = document.querySelector("#game");
    var context = surface.getContext("2d");
    var bottle = loader.getImage('bottle');

    context.drawImage(loader.getImage('game'), 0, 0);
    if (state.running) {
	drawPlayer(state.playerDirection, context);
	drawScore(state.caughtCount, state.droppedCount, context);	
    }

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

    context.drawImage(loader.getImage('background'), 135, 78);

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
    else if (keyCode == 65) // 'A' or 'a'
    {
        Game.startGameA();
    }
    else if (keyCode == 66) // 'B' or 'b'
    {
        Game.startGameB();
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

function playSound(soundName)
{
    var sound = loader.getSound(soundName);
    if (sound)
        sound.play();
}

function displayGame()
{
    // hide loader div
    var loaderDiv = document.getElementById('loader');
    loaderDiv.style.display = 'none';

    // display game canvas
    var surface = document.getElementById('game');
    surface.style.display = 'block';

    registerKeyHandler();
    Game.onStateChange(update);
    Game.onItemRolling(function() { playSound('roll'); });
    Game.onItemCaught(function() { playSound('catch'); });
    Game.onItemDropped(function() { playSound('drop'); });
}

function initAssets()
{
    loader.onAllLoaded(displayGame);
    loader
    // images
        .addImage('game', 'assets/game.png')
        .addImage('background', 'assets/bg.png')
        .addImage('bottle', 'assets/butelka0.png')
        .addImage('player_upper_left', 'assets/baba2.png')
        .addImage('player_upper_right', 'assets/baba3.png')
        .addImage('player_lower_left', 'assets/baba0.png')
        .addImage('player_lower_right', 'assets/baba1.png')
        .addImage('lemon', 'assets/lemon2.png')
    // sounds
        .addSound('roll', 'assets/egg.wav')
        .addSound('catch', 'assets/catch.wav')
        .addSound('drop', 'assets/drop.wav')
        .finish();
}

function init()
{
    initAssets();
}
