var loader =  new Loader();

var playerImageNames = [];
playerImageNames[Game.Direction.UpperLeft]  = 'player_upper_left';
playerImageNames[Game.Direction.UpperRight] = 'player_upper_right';
playerImageNames[Game.Direction.LowerLeft]  = 'player_lower_left';
playerImageNames[Game.Direction.LowerRight] = 'player_lower_right';

var upperLeftRailPos =  new Array([140, 100],  [155, 102],  [170, 103], [185, 104], [197, 133]);
var upperRightRailPos = new Array([360, 102],  [345, 102],  [330, 103], [315, 105], [302, 133]);
var lowerLeftRailPos =  new Array([140, 164], [155, 166], [170, 167], [185, 169], [200, 180]);
var lowerRightRailPos = new Array([360, 165], [345, 166], [330, 167], [315, 169], [300, 183]);

var upperLeftRailAngle =  new Array(0.0, 0.0, 0.0, 5.0, 30.0);
var upperRightRailAngle = new Array(0.0, 0.0, 0.0, -5.0, -30.0);
var lowerLeftRailAngle =  new Array(0.0, 0.0, 0.0, 5.0, 30.0);
var lowerRightRailAngle = new Array(0.0, 0.0, 0.0, -5.0, -20.0);

var upperLeftRailScale =  new Array(0.6, 0.7, 0.8, 0.9, 1.0);
var upperRightRailScale = new Array(0.6, 0.7, 0.8, 0.9, 1.0);
var lowerLeftRailScale =  new Array(0.6, 0.7, 0.8, 0.9, 1.0);
var lowerRightRailScale = new Array(0.6, 0.7, 0.8, 0.9, 1.0);

var leftEscapePos =     new Array([190, 210], [180, 210], [170, 210], [155, 210], [140, 210]);
var rightEscapePos =    new Array([305, 210], [325, 210], [335, 210], [348, 210], [360, 210]);

var leftEscapeAngle =     new Array(-20, 16, -6, 20, -13);
var rightEscapeAngle =    new Array(18, -14, 8, 16, 5);

var leftEscapeScale =     new Array(0.6, 0.6, 0.6, 0.6, 0.6);
var rightEscapeScale =    new Array(0.6, 0.6, 0.6, 0.6, 0.6);

var playerPos =      new Array([195, 126], [183, 126], [183, 126], [195, 126]);


function deg2rad(degrees)
{
    return degrees * Math.PI / 180;
}


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
    context.fillStyle    = '#444444';
    context.fillText(zeroFill(score, 4), 220, 98);
    var lemonImage = loader.getImage('lemon');
    var lemons = Math.abs(3-fails);
    for(var i=0;i<lemons;i++){
	var x = 245 - i * 15;
	context.drawImage(lemonImage, x, 115);
    }
}


function drawGameType(gameType, context)
{
    if (gameType == 'A')
        context.drawImage(loader.getImage('game_type_a'), 265, 104);
    else if (gameType = 'B')
        context.drawImage(loader.getImage('game_type_b'), 265, 113);
}


function drawSprite(context, sprite, x, y, scale, angle)
{
    scale = scale || 1.0;
    angle = angle || 0.0;
    context.save();
    context.translate(x, y);
    context.rotate(deg2rad(angle));
    context.scale(scale, scale);
    context.drawImage(sprite, 0, 0);
    context.restore();
}


function update(state){

    var surface = document.getElementById("game");
    var context = surface.getContext("2d");
    var bottle = loader.getImage('bottle');

    context.drawImage(loader.getImage('game'), 0, 0);

    if (state.running) {
        drawPlayer(state.playerDirection, context);
        drawScore(state.caughtCount, state.droppedCount, context);
        drawGameType(state.gameType, context);
    }

    for(var i=0; i<5; i++) {
	
	if (state.upperLeftRail[i]) {
	    drawSprite(context, bottle,
                   upperLeftRailPos[i][0], upperLeftRailPos[i][1],
                   upperLeftRailScale[i], upperLeftRailAngle[i]);
	}
	if (state.lowerLeftRail[i]) {
	    drawSprite(context, bottle,
                   lowerLeftRailPos[i][0], lowerLeftRailPos[i][1],
                   lowerLeftRailScale[i], lowerLeftRailAngle[i]);
	}
	if (state.upperRightRail[i]) {
	    drawSprite(context, bottle,
                   upperRightRailPos[i][0], upperRightRailPos[i][1],
                   upperRightRailScale[i], upperRightRailAngle[i]);
	}
	if (state.lowerRightRail[i]) {
	    drawSprite(context, bottle,
                   lowerRightRailPos[i][0], lowerRightRailPos[i][1],
                   lowerRightRailScale[i], lowerRightRailAngle[i]);
	}
	if (state.leftEscape[i]) {
	    drawSprite(context, bottle,
                   leftEscapePos[i][0], leftEscapePos[i][1],
                   leftEscapeScale[i], leftEscapeAngle[i]);
	}
	if (state.rightEscape[i]) {
	    drawSprite(context, bottle,
                   rightEscapePos[i][0], rightEscapePos[i][1],
                   leftEscapeScale[i], leftEscapeAngle[i]);
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


function gameOnClick(event) {
    Number.prototype.between = function(first,last){
	return (first < last ? this >= first && this <= last : this >= last && this <= first);
    };

    function isinsideCircle(mx, my, cx, cy, radius){
	var distance = Math.sqrt((mx - cx) * (mx - cx) + (my - cy) * (my - cy));
	if(distance < radius) return true;
	return false;
    };
    var surface = document.getElementById("game");
    var coords = surface.relMouseCoords(event);

    var x = coords.x;
    var y = coords.y;
    if(x.between(437, 456) && y.between(32, 51)) {
        Game.startGameA();
    }
    if(x.between(437, 456) && y.between(79, 87)) {
        Game.startGameB();
    }
    if(x.between(437, 456) && y.between(113, 121)) {
	console.log('czas');
    }
    if(isinsideCircle(x, y, 61, 206, 10)) {
        Game.setPlayerDirection(Game.Direction.UpperLeft);
    }
    if(isinsideCircle(x, y, 61, 260, 10)) {
        Game.setPlayerDirection(Game.Direction.LowerLeft);
    }
    if(isinsideCircle(x, y, 454, 206, 10)) {
        Game.setPlayerDirection(Game.Direction.UpperRight);
    }
    if(isinsideCircle(x, y, 454, 260, 10)) {
        Game.setPlayerDirection(Game.Direction.LowerRight);
    }
}

function registerMouseClick() {
    var surface = document.getElementById("game");
    surface.addEventListener("click", gameOnClick, false);    
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
    registerMouseClick();
    Game.onStateChange(update);
    Game.onItemRolling(function() { playSound('roll'); });
    Game.onItemCaught(function() { playSound('catch'); });
    Game.onItemDropped(function() { playSound('drop'); });
}

function displayUnsupportedBrowser()
{
    // hide loader div
    var loaderDiv = document.getElementById('loader');
    loaderDiv.style.display = 'none';

    // display unsupported div
    var unsupportedDiv = document.getElementById('unsupported');
    unsupportedDiv.style.display = 'block';
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
        .addImage('game_type_a', 'assets/game_type_a.png')
        .addImage('game_type_b', 'assets/game_type_b.png')
    // sounds
        .addSound('roll', ['assets/egg.mp3', 'assets/egg.wav'])
        .addSound('catch', ['assets/catch.mp3', 'assets/catch.wav'])
        .addSound('drop', ['assets/drop.mp3', 'assets/drop.wav'])
        .finish();
}

function init()
{
    if (Modernizr.canvas && Modernizr.audio &&
        (Modernizr.audio.ogg || Modernizr.audio.wav))
    {
        initAssets();
    }
    else
        displayUnsupportedBrowser();
}


function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;
    
    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)
    
    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    
    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
