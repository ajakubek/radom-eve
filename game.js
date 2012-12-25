if (typeof(Game) == 'undefined')
{

(function() {

// namespaces
var Game = window.Game = {};

var Direction = Game.Direction =
{
    UpperLeft:  0,
    UpperRight: 1,
    LowerLeft:  2,
    LowerRight: 3
};

Game.State = function State()
{
    this.type = 'A';
    this.playerDirection = Direction.UpperLeft;
    this.generatedCount  = 0;
    this.droppedCount    = 0;
    this.supperLeftRail = [false, false, false, false, false];
    this.upperRightRail = [false, false, false, false, false];
    this.lowerLeftRail  = [false, false, false, false, false];
    this.lowerRightRail = [false, false, false, false, false];
    this.leftEscape     = [false, false, false, false, false];
    this.rightEscape    = [false, false, false, false, false];
};

Game.onStateChange = function(callback)
{
};

Game.startGameA = function()
{
};

Game.startGameB = function()
{
};

Game.setDirection = function(dir)
{
};

})();

}
