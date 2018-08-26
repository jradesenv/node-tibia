var robot = require("robotjs");
var path = require("path");
var fs = require("fs");
var lame = require("lame");
var Speaker = require("speaker");
var newRobot = require("kbm-robot");
newRobot.startJar("7");

var ON_DEATH = require('death'); //this is intentionally ugly

ON_DEATH(function (signal, err) {
    console.log("stop!");
    newRobot.stopJar();
});

var playerOnScreenSoundFile = path.join("sounds", "playerOnTheScreen.mp3");

var emptyManaColor = "26231f";
var fullManaColor = "7260ff";
var blankRuneColor = "9e978e";
var emptyBattleColor = "201e1a";

var battlePos = {
    x: 1742,
    y: 747
};

var posFullMana = {
    x: 1895,
    y: 206
};

var leftHandPos = {
    x: 1751,
    y: 356
};

var firstBackpackPos = {
    x: 1742,
    y: 472
};

var secondBackpackPos = {
    x: 1743,
    y: 533
};

var fishingRodPos = {
    x: 1828,
    y: 469
};

var foodPos = {
    x: 1827,
    y: 392
};

var arrFishingSpots = [
    { x: 1570, y: 470 },
    { x: 1570, y: 637 },
    { x: 1220, y: 670 },
    { x: 1340, y: 610 },
    { x: 1470, y: 470 },
    { x: 1608, y: 670 },
    { x: 1296, y: 723 },
    { x: 1256, y: 696 },
    { x: 1472, y: 398 }
]

var waterLimits = {
    x: {
        start: 1475,
        end: 1674
    },
    y: {
        start: 343,
        end: 744
    }
}

var playerPosition = {
    x: 1343,
    y: 505
}

setTimeout(function () {
    //start();

    getAutomaticPositions(start);
}, 5000);

var onlyLearnPositions = false;
var wasAlone = false;
var runeOnlyAlone = false;
var shouldPlaySoundPlayerOnScreen = false;
function start() {
    setInterval(function () {
        if (onlyLearnPositions) {
            learnPositions();
        } else {

            if (isAlone() || !runeOnlyAlone) {
                if (!wasAlone) {
                    wasAlone = true;
                    console.log("[" + new Date().toLocaleTimeString() + "] playing for you again!")
                }

                if (!isDoingAnything()) {
                    if (isManaFull()) {
                        makeRune();
                    }
                    else {
                        if (fishingCount > 10) {
                            if (eatFoodCount > 5) {
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
                }

            } else {
                if (wasAlone) {
                    wasAlone = false;
                    console.log("[" + new Date().toLocaleTimeString() + "] not alone!")
                }
                playPlayerOnScreenSound();
            }
        }

    }, 1000);
}

function getAutomaticPositions(callback) {
    getBlankRunePosition(function () {
        getEmptyContainerPosition(function () {
            getLeftHandPosition(function () {
                getFoodPosition(function () {
                    getFullManaPosition(function () {
                        getManaColor(function() {
                            getPlayerPosition(function() {
                                console.log("jogando pra você!");
                                callback();
                            });
                        });
                    });
                });
            });
        });
    });
}

function getBlankRunePosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse sobre a BLANK RUNE.");
    } else {
        console.log("continue parado na blank rune...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getBlankRunePosition(callback, mouse);
        } else {
            secondBackpackPos = mouse;
            blankRuneColor = color;

            console.log("blank rune confirmada em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getLeftHandPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse sobre a MÃO de botar blank rune.");
    } else {
        console.log("continue parado na mão da blank rune...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getLeftHandPosition(callback, mouse);
        } else {
            leftHandPos = mouse;

            console.log("mão confirmada em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getFullManaPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse o local com mana cheia para fazer runa.");
    } else {
        console.log("continue parado no local de mana cheia...");
    }
    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getFullManaPosition(callback, mouse);
        } else {
            posFullMana = mouse;
            manaColor = color;

            console.log("mana cheia confirmada em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getManaColor(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse na cor de mana azul.");
    } else {
        console.log("continue parado no local de mana azul...");
    }
    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getManaColor(callback, mouse);
        } else {
            manaColor = color;

            console.log("cor da mana confirmada: " + color);
            callback();
        }
    }, 3000);
}

function getEmptyContainerPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local vazio para guardar runas.");
    } else {
        console.log("continue parado no local vazio de guardar runas...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getEmptyContainerPosition(callback, mouse);
        } else {
            firstBackpackPos = mouse;

            console.log("local vazio confirmado em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getFoodPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local de COMER FOOD.");
    } else {
        console.log("continue parado no local de comer food...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getFoodPosition(callback, mouse);
        } else {
            foodPos = mouse;

            console.log("local de food confirmado em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getPlayerPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no Personagem.");
    } else {
        console.log("continue parado no local do personagem...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getPlayerPosition(callback, mouse);
        } else {
            playerPosition = mouse;

            console.log("local do personagem confirmado em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

var isPlayingSound = false;
function playPlayerOnScreenSound() {
    if (!isPlayingSound && shouldPlaySoundPlayerOnScreen) {
        isPlayingSound = true;

        stream = fs.createReadStream(playerOnScreenSoundFile);
        var decoder = new lame.Decoder();
        var spkr = new Speaker();
        decoder.pipe(spkr);
        stream.pipe(decoder);


        setTimeout(function () {
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
    if (!isDoingAnything()) {
        isEating = true;
        console.log("eating...");
        robot.moveMouse(foodPos.x, foodPos.y);
        robot.mouseClick("right");
        setTimeout(function () {
            eatFoodCount += 1;
            isEating = false;
        }, 1000);
    }
}

var isShaking = false;
function doTheHalemShake() {
    if (!isDoingAnything()) {
        isShaking = true;
        console.log("shaking...");
        
        robot.moveMouse(playerPosition.x, playerPosition.y - 60);
        robot.mouseClick("left");
        setTimeout(function () {
            robot.moveMouse(playerPosition.x, playerPosition.y + 60);
            robot.mouseClick("left");
            setTimeout(function () {
                isShaking = false;
            }, 2000);
        }, 2000);
    }
}

function learnPositions() {
    var mouse = robot.getMousePos();
    console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y + " color: " + robot.getPixelColor(mouse.x, mouse.y));
}

function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var isFishing = false;
var fishingCount = 0;
function doFish() {
    if (!isDoingAnything()) {
        isFishing = true;

        // var fishingSpot = {
        //     x: getRandomNumberInRange(waterLimits.x.start, waterLimits.x.end),
        //     y: getRandomNumberInRange(waterLimits.y.start, waterLimits.y.end)
        // }

        // console.log("fishing..", fishingSpot);
        // robot.moveMouse(fishingRodPos.x, fishingRodPos.y);
        // robot.mouseClick("right");
        // robot.moveMouse(fishingSpot.x, fishingSpot.y);
        // robot.mouseClick("left");
        setTimeout(function () {
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

        if (hasBlankRune()) {

            moveFromSecondBackpackToLeftHand();
            setTimeout(function () {
                console.log("do adori gran");

                newRobot
                    .typeString("adori gran")
                    .press("enter")
                    .release("enter")
                    .go(function () {
                        setTimeout(function () {
                            moveFromLeftHandToFirstBackpack();
                            setTimeout(function () {
                                //moveFromSecondBackpackToLeftHand();
                                setTimeout(function () {
                                    isMakingRune = false;
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    });
            }, 1000);

        } else {
            console.log("do exura");

            newRobot
                .typeString("exura")
                .press("enter")
                .release("enter")
                .go(function () {
                    setTimeout(function () {
                        isMakingRune = false;
                    }, 1000);
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