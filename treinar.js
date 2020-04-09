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

var wandColor = "26231f";

var wandPos = {
    x: 1742,
    y: 747
};

var trainerPos = {
    x: 1895,
    y: 206
};

setTimeout(function () {
    //start();

    getAutomaticPositions(startOnlyMakeSD);
}, 5000);

function startOnlyMakeSD() {
    currentRunes = 0;
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
    getWandPosition(function () {
        getTrainerPosition(function () {
            console.log("jogando pra você!");
            callback();
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

        robot.moveMouse(playerPosition.x + 60, playerPosition.y);
        robot.mouseClick("left");
        setTimeout(function () {
            robot.moveMouse(playerPosition.x - 60, playerPosition.y);
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

        var fishingSpot = {
            x: getRandomNumberInRange(waterLimits.x.start, waterLimits.x.end),
            y: getRandomNumberInRange(waterLimits.y.start, waterLimits.y.end)
        }

        console.log("fishing..", fishingSpot);
        robot.moveMouse(fishingRodPos.x, fishingRodPos.y);
        robot.mouseClick("right");
        robot.moveMouse(fishingSpot.x, fishingSpot.y);
        robot.mouseClick("left");
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

        if (currentRunes < maxRunes) {

            //moveFromSecondBackpackToLeftHand();
            setTimeout(function () {
                console.log("do adura vita");

                newRobot
                    .press("enter")
                    .release("enter")
                    .go(function () {
                        setTimeout(function () {
                            newRobot
                                .typeString("adura vita")
                                .press("enter")
                                .release("enter")
                                .go(function () {
                                    isMakingRune = false;
                                    currentRunes += 1;
                                });
                        }, 1000);
                    });
            }, 1000);

        } else {
            console.log("do exura");

            setTimeout(function () {
                console.log("do exura gran");

                newRobot
                    .press("enter")
                    .release("enter")
                    .go(function () {
                        setTimeout(function () {
                            newRobot
                                .typeString("exura vita")
                                .press("enter")
                                .release("enter")
                                .go(function () {
                                    isMakingRune = false;
                                    //currentRunes += 1;
                                });
                        }, 1000);
                    });
            }, 1000);
        }
    }
}

function hasBlankRune() {
    var pixelColor = robot.getPixelColor(secondBackpackPos.x, secondBackpackPos.y);
    return pixelColor == blankRuneColor;
}

function isManaFull() {
    var currentManaColor = robot.getPixelColor(posFullMana.x, posFullMana.y);
    console.log("mana fuul? ", manaColor == currentManaColor);
    return manaColor == currentManaColor;
}