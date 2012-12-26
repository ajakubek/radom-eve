if (typeof(Game) == 'undefined')
{

(function() {

// Namespace

var Game = window.Game = {};


// Constants

var MaxDrops = Game.MaxDrops = 3;


// Public type definitions

var Direction = Game.Direction =
{
    UpperLeft:  0,
    UpperRight: 1,
    LowerLeft:  2,
    LowerRight: 3
};

function State(type)
{
    // 'A', 'B', or null (no game)
    this.gameType        = type;
    this.running         = false;
    this.playerDirection = Direction.UpperLeft;
    this.step            = 0;
    this.lastNewItemStep = -1;
    this.caughtCount     = 0;
    this.droppedCount    = 0;
    this.upperLeftRail   = [false, false, false, false, false];
    this.upperRightRail  = [false, false, false, false, false];
    this.lowerLeftRail   = [false, false, false, false, false];
    this.lowerRightRail  = [false, false, false, false, false];
    this.leftEscape      = [false, false, false, false, false];
    this.rightEscape     = [false, false, false, false, false];
};
Game.State = new State(null);


// Private type definitions

function Ramp(initialValue)
{
    this.initialValue = initialValue;
    this.steps = [];

    // note that steps must be added in order
    this.addStep = function(level, value)
    {
        this.steps.push([level, value]);
        return this;
    };

    this.interpolate = function(level)
    {
        var value = this.initialValue;
        for (i = 0; i < this.steps.length; ++i)
        {
            if (this.steps[i][0] > level)
                break;
            value = this.steps[i][1];
        }
        return value;
    };
};

function Options(stepIntervalRamp,
                 newItemDelayRamp)
{

    this.stepIntervalRamp = stepIntervalRamp || new Ramp(0);
    this.newItemDelayRamp = newItemDelayRamp || new Ramp(0);
}

function Timer()
{
    this.lastTime = (new Date()).getTime();

    this.reset = function()
    {
        this.lastTime = (new Date()).getTime();
    };

    this.elapsed = function()
    {
        return (new Date()).getTime() - this.lastTime;
    };
};



// Private variables

var GameAOptions = new Options(
    new Ramp(1000)
        .addStep(250,   750)
        .addStep(500,   500)
        .addStep(750,   250)
        .addStep(1000,  100),
    new Ramp(6)
        .addStep(40,  5)
        .addStep(80,  4)
        .addStep(120, 3)
        .addStep(160, 2)
        .addStep(200, 1));
var GameBOptions = new Options(
    new Ramp(750)
        .addStep(50,  500)
        .addStep(100, 250)
        .addStep(150, 100),
    new Ramp(6)
        .addStep(20,  5)
        .addStep(40,  4)
        .addStep(60,  3)
        .addStep(80,  2)
        .addStep(100, 1));

var stateChangeCallback = null;
var tickCallback = null;
var dropCallback = null;
var stepTimer = new Timer();
var options = null;


// Public methods

Game.onStateChange = function(callback)
{
    stateChangeCallback = callback;
    stateChanged(Game.State);
};

Game.onTick = function(callback)
{
    tickCallback = callback;
};

Game.onItemCaught = function(callback)
{
    itemCaughtCallback = callback;
};

Game.onItemDropped = function(callback)
{
    itemDroppedCallback = callback;
};

Game.startGameA = function()
{
    options = GameAOptions;

    Game.State = new State('A');
    Game.State.running = true;

    stepTimer.reset();
};

Game.startGameB = function()
{
    options = GameBOptions;

    Game.State = new State('B');
    Game.State.running = true;

    stepTimer.reset();
};

Game.setPlayerDirection = function(direction)
{
    Game.State.playerDirection = direction;
    stateChanged();
};


// Private methods

function timerTick()
{
    if (!Game.State.running)
        return;

    var currentStepInterval =
        options.stepIntervalRamp.interpolate(Game.State.step);
    if (stepTimer.elapsed() > currentStepInterval)
    {
        // new game step
        stepTimer.reset();

        runGameStep();
        stateChanged();
    }
}

function runGameStep()
{
    // note that newItemDirection might be null (no new items)
    var newItemDirection = generateNewItem();

    var leftDropped = false;
    if (updateRail(Game.State.upperLeftRail,
                   Direction.UpperLeft,
                   newItemDirection === Direction.UpperLeft) ||
        updateRail(Game.State.lowerLeftRail,
                   Direction.LowerLeft,
                   newItemDirection === Direction.LowerLeft))
        leftDropped = true;

    var rightDropped = false;
    if (updateRail(Game.State.upperRightRail,
                   Direction.UpperRight,
                   newItemDirection === Direction.UpperRight) ||
        updateRail(Game.State.lowerRightRail,
                   Direction.LowerRight,
                   newItemDirection === Direction.LowerRight))
        rightDropped = true;

    shiftQueue(Game.State.leftEscape, leftDropped);
    shiftQueue(Game.State.rightEscape, rightDropped);

    Game.State.step += 1;
}

function generateNewItem()
{
    var targetItemDelay =
        options.newItemDelayRamp.interpolate(Game.State.step);
    var currentItemDelay = Game.State.step - Game.State.lastNewItemStep;

    if (Game.State.lastNewItemStep < 0 ||
        currentItemDelay >= targetItemDelay)
    {
        // generate new item
        Game.State.lastNewItemStep = Game.State.step;
        return Math.floor(Math.random() * 4);
    }
    else
    {
        // no new items
        return null;
    }
}

function updateRail(railQueue, railDirection, newItem)
{
    var itemFalling = shiftQueue(railQueue, newItem);
    if (itemFalling)
    {
        if (Game.State.playerDirection !== railDirection)
        {
            itemDropped();
            return true;
        }
        else
            itemCaught();
    }
    return false;
}

function shiftQueue(queue, newItem)
{
    queue.unshift(!!newItem);
    return queue.pop();
}

function stateChanged()
{
    if (typeof stateChangeCallback == 'function')
        stateChangeCallback(Game.State);
}

function itemCaught()
{
    Game.State.caughtCount += 1;

    if (typeof itemCaughtCallback == 'function')
        itemCaughtCallback();
}

function itemDropped()
{
    Game.State.droppedCount += 1;

    if (typeof itemDroppedCallback == 'function')
        itemDroppedCallback();

    if (Game.State.droppedCount > MaxDrops)
        Game.State.running = false;
}


// Game init

window.setInterval(timerTick, 100);

})();

}
