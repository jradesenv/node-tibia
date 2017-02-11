var robot = require("robotjs");
var path = require("path");
var fs = require("fs");
var lame = require("lame");
var Speaker = require("speaker");
var newRobot = require("kbm-robot");
newRobot.startJar("7");

var ON_DEATH = require('death'); //this is intentionally ugly

ON_DEATH(function(signal, err) {
    console.log("stop!");
    newRobot.stopJar();
});

var playerOnScreenSoundFile = path.join("sounds", "playerOnTheScreen.mp3");

var emptyManaColor = "26231f";
var fullManaColor = "7260ff";
var blankRuneColor = "8b847b";
var emptyBattleColor = "201e1a";

var battlePos = {
    x: 1742,
    y: 747
};

var posFullMana = {
    x: 1823,
    y: 210
};

var leftHandPos = {
    x: 1751,
    y: 356
};

var firstBackpackPos = {
    x: 1745,
    y: 602
};

var secondBackpackPos = {
    x: 1743,
    y: 659
};

var fishingRodPos = {
    x: 1828,
    y: 393
};

var foodPos = {
    x: 1344,
    y: 485
};

var arrFishingSpots = [
    {x: 1570, y: 470},
    {x: 1570, y: 637},
    {x: 1220, y: 670},
    {x: 1340, y: 610},
    {x: 1470, y: 470},
    {x: 1608, y: 670},
    {x: 1296, y: 723},
    {x: 1256, y: 696},
    {x: 1472, y: 398}
]

var playerPosition = {
    x: 1340,
    y: 484
}

setTimeout(function() {
    start();
}, 5000);

var wasAlone = false;
var runeOnlyAlone = true;
var shouldPlaySoundPlayerOnScreen = true;
function start() {
    setInterval(function() {
        //learnPositions();

        if (isAlone() || !runeOnlyAlone) {
            if(!wasAlone) {
                wasAlone = true;
                console.log("[" + new Date().toLocaleTimeString() + "] playing for you again!")
            }

            if (isManaFull()) {
                makeRune();
            }
            else {
                if(fishingCount > 5) {
                    if(eatFoodCount > 5) {
                        doTheHalemShake();
                        eatFoodCount = 0;
                    } else {
                        eatFood();
                    }

                    fishingCount = 0;
                } else {
                    doFish();
                }
            }

        } else {
            if(wasAlone) {
                wasAlone = false;
                console.log("[" + new Date().toLocaleTimeString() + "] not alone!")
            }
            playPlayerOnScreenSound();
        }

    }, 2000);
}

var isPlayingSound = false;
function playPlayerOnScreenSound() {
    if(!isPlayingSound && shouldPlaySoundPlayerOnScreen) {
        isPlayingSound = true;

        stream = fs.createReadStream(playerOnScreenSoundFile);
        var decoder = new lame.Decoder();
        var spkr = new Speaker();
        decoder.pipe(spkr);
        stream.pipe(decoder);

        
        setTimeout(function(){
            stream.unpipe();
            stream.destroy();
            spkr.end();
            isPlayingSound = false;
        }, 1000);
    }
}

function isDoingAnything() {
    return isMakingRune || isFishing || isEating || isShaking;
}

var isEating = false;
var eatFoodCount = 0;
function eatFood() {
    if(!isDoingAnything()) {
        isEating = true;
        console.log("eating...");
        robot.moveMouse(foodPos.x, foodPos.y);
        robot.mouseClick("right");
        setTimeout(function() {
            eatFoodCount += 1;
            isEating = false;
        }, 1000);
    }
}

var isShaking = false;
function doTheHalemShake() {
    if(!isDoingAnything()) {
        isShaking = true;
        console.log("shaking...");
        robot.moveMouse(playerPosition.x, playerPosition.y -60);
        robot.mouseClick("left");
        setTimeout(function() {
            robot.moveMouse(playerPosition.x, playerPosition.y +60);
            robot.mouseClick("left");
            setTimeout(function() {
                isShaking = false;
            }, 1000);
        },1000);
    }
}

function learnPositions() {
    var mouse = robot.getMousePos();
    console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y + " color: " + robot.getPixelColor(mouse.x, mouse.y));  
}

var isFishing = false;
var fishingCount = 0;
function doFish() {
    if (!isDoingAnything()) {
        isFishing = true;
        var fishingSpot = arrFishingSpots[Math.floor(Math.random() * arrFishingSpots.length) + 0];
        console.log("fishing..", fishingSpot);
        robot.moveMouse(fishingRodPos.x, fishingRodPos.y);
        robot.mouseClick("right");
        robot.moveMouse(fishingSpot.x, fishingSpot.y);
        robot.mouseClick("left");
        setTimeout(function() {
            fishingCount += 1;
            isFishing = false;
        }, 1000);
    }
}

var isMakingRune = false;
function makeRune() {
    if (!isDoingAnything()) {
        console.log("make rune!!!")
        isMakingRune = true;

        if(hasBlankRune()) {

            moveFromSecondBackpackToLeftHand();
            setTimeout(function() {
                console.log("do adori gran");

                newRobot
                    .typeString("adori gran")
                    .press("enter")
                    .release("enter")
                    .go(function() {
                        setTimeout(function() {
                            moveFromLeftHandToFirstBackpack();
                            setTimeout(function() {
                                moveFromSecondBackpackToLeftHand();
                                setTimeout(function() {
                                    isMakingRune = false;
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    });
            }, 1000);

        } else {
            console.log("do exura gran");

            newRobot
                    .typeString("exura gran")
                    .press("enter")
                    .release("enter")
                    .go(function() {
                        setTimeout(function() {
                            isMakingRune = false;
                        },1000);
                    });
        }
    }
}

function hasBlankRune() {
    var pixelColor = robot.getPixelColor(secondBackpackPos.x, secondBackpackPos.y);
    return pixelColor == blankRuneColor;
}

function isManaFull() {
    var manaColor = robot.getPixelColor(posFullMana.x, posFullMana.y);
    return manaColor == fullManaColor;
}

function isAlone() {
    var battleColor = robot.getPixelColor(battlePos.x, battlePos.y);
    return battleColor == emptyBattleColor;
}

function moveFromLeftHandToFirstBackpack() { //take the HMM
    console.log("moveFromLeftHandToFirstBackpack");
    robot.moveMouse(leftHandPos.x, leftHandPos.y);
    robot.mouseToggle("down");
    robot.dragMouse(firstBackpackPos.x, firstBackpackPos.y);
    robot.mouseToggle("up");
}

function moveFromSecondBackpackToLeftHand() { //take blank rune
    console.log("moveFromSecondBackpackToLeftHand");
    robot.moveMouse(secondBackpackPos.x, secondBackpackPos.y);
    robot.mouseToggle("down");
    robot.dragMouse(leftHandPos.x, leftHandPos.y);
    robot.mouseToggle("up");
}

function moveFromFirstBackpackToLeftHand() { //take back the weapon
    console.log("moveFromFirstBackpackToLeftHand");
    robot.moveMouse(firstBackpackPos.x, firstBackpackPos.y);
    robot.mouseToggle("down");
    robot.dragMouse(leftHandPos.x, leftHandPos.y);
    robot.mouseToggle("up");
}