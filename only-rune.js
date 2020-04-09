var robot = require("robotjs");
var path = require("path");
var fs = require("fs");
var lame = require("lame");
var Speaker = require("speaker");
var newRobot = require("kbm-robot");
newRobot.startJar("7");

var ON_DEATH = require('death'); //this is intentionally ugly

ON_DEATH(function (signal, err) {
    console.log(new Date().toLocaleString() + " stop!");
    newRobot.stopJar();
});

var playerOnScreenSoundFile = path.join("sounds", "playerOnTheScreen.mp3");

var emptyManaColor = "26231f";
var fullManaColor = "7260ff";
var blankRuneColor = "9e978e";
var emptyBattleColor = "1a1b1b";

var battlePos = {
    x: 1738,
    y: 124
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

var waterLimits = {
    start: {

    },
    end: {

    }
}

var playerPosition = {
    x: 1343,
    y: 505
}

setTimeout(function () {
    if (onlyLearnPositions) {
        setInterval(function () {
            learnPositions();
        }, 3000);
    } else {
        getAutomaticPositions(start);
    }
}, 5000);

var onlyLearnPositions = false;
var wasAlone = false;
var runeOnlyAlone = false;
var shouldPlaySoundPlayerOnScreen = false;
var shouldLogoutWhenNotAlone = true;

var maxRunes = 220;
var countUntilExevoPan = 0;
var maxCountUntilExevoPan = 3;
var alternateExevoPan = true;
function start() {
    currentRunes = 0;

    if (shouldLogoutWhenNotAlone) {
        console.log(new Date().toLocaleString() + " will logout when not alone");
        setInterval(function () {
            if (!isAlone()) {
                doLogout();
            }
        }, 10);
    }

    setInterval(function () {
        if (onlyLearnPositions) {
            learnPositions();
        } else {

            if (!isDoingAnything()) {
                if (isManaFull()) {
                    makeRune();
                }
                else {
                    if (eatFoodCount > 10) {
                        doTheHalemShake();
                        eatFoodCount = 0;
                    } else {
                        eatFood();
                    }
                }
            }
        }

    }, 5000);
}

function getAutomaticPositions(callback) {
    getBattlePosition(function () {
        getPlayerPosition(function () {
            getFoodPosition(function () {
                getFullManaPosition(function () {
                    console.log(new Date().toLocaleString() + " jogando pra você!");
                    callback();
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

function getLogoutConfirmPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local de LogoutConfirm.");
    } else {
        console.log("continue parado no local de LogoutConfirm...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getLogoutConfirmPosition(callback, mouse);
        } else {
            logoutConfirmPosition = mouse;

            console.log("local de LogoutConfirm confirmado em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getLogoutPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local de Logout.");
    } else {
        console.log("continue parado no local de Logout...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getLogoutPosition(callback, mouse);
        } else {
            logoutPosition = mouse;

            console.log("local de Logout confirmado em: x " + mouse.x + ", y " + mouse.y);
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

function getBattlePosition(callback, lastPos) {
    console.log("!!!!O BATTLE DEVE ESTAR NO CANTO SUPERIOR DIREITO!!!!!!")
    callback();
    // if (lastPos == null) {
    //     console.log("posicione o mouse no centro das Espadas do battle.");
    // } else {
    //     console.log("continue parado no local do centro das Espadas do battle...");
    // }

    // setTimeout(function () {
    //     var mouse = robot.getMousePos();
    //     var color = robot.getPixelColor(mouse.x, mouse.y);

    //     if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
    //         getBattlePosition(callback, mouse);
    //     } else {
    //         mouse.y = mouse.y + 50;
    //         color = robot.getPixelColor(mouse.x, mouse.y);

    //         battlePos = mouse;
    //         emptyBattleColor = color;

    //         console.log("local do battle em: x " + mouse.x + ", y " + mouse.y);
    //         callback();
    //     }
    // }, 3000);
}

function getFishingStartPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local de FISHING Start.");
    } else {
        console.log("continue parado no local de fishing Start...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getFishingStartPosition(callback, mouse);
        } else {
            waterLimits.start = mouse;

            console.log("local de fishing Start confirmado em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getFishingEndPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local de FISHING End.");
    } else {
        console.log("continue parado no local de fishing End...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getFishingEndPosition(callback, mouse);
        } else {
            waterLimits.end = mouse;

            console.log("local de fishing End confirmado em: x " + mouse.x + ", y " + mouse.y);
            callback();
        }
    }, 3000);
}

function getFishingRodPosition(callback, lastPos) {
    if (lastPos == null) {
        console.log("posicione o mouse no local de FISHING ROD.");
    } else {
        console.log("continue parado no local de fishing rod...");
    }

    setTimeout(function () {
        var mouse = robot.getMousePos();
        var color = robot.getPixelColor(mouse.x, mouse.y);

        if (lastPos == null || lastPos.x != mouse.x || lastPos.y != mouse.y) {
            getFishingRodPosition(callback, mouse);
        } else {
            fishingRodPos = mouse;

            console.log("local de fishing rod confirmado em: x " + mouse.x + ", y " + mouse.y);
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
    return isMakingRune || isFishing || isEating || isShaking || isLoggingOut;
}

var isLoggingOut = false;
function doLogout() {
    isLoggingOut = true;
    console.log(new Date().toLocaleString() +  " logging out...");
    newRobot
        .press("ctrl")
        .go(function () {
            setTimeout(function () {
                newRobot
                    .press("l")
                    .go(function () {
                         isLoggingOut = false;
                        console.log(new Date().toLocaleString() +  " logged out!");
                        process.exit();
                    });
            }, 10);
        });
}

var isEating = false;
var eatFoodCount = 0;
function eatFood() {
    if (!isDoingAnything()) {
        isEating = true;
        //console.log("eating...");
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

        robot.moveMouse(playerPosition.x, playerPosition.y + 50);
        robot.mouseClick("left");
        setTimeout(function () {
            robot.moveMouse(playerPosition.x, playerPosition.y - 50);
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
            x: getRandomNumberInRange(waterLimits.start.x, waterLimits.end.x),
            y: getRandomNumberInRange(waterLimits.start.y, waterLimits.end.y)
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
        console.log(new Date().toLocaleString() + " make rune!");
        isMakingRune = true;

        if (alternateExevoPan) {
            countUntilExevoPan += 1;
            console.log("countUntilExevoPan ", countUntilExevoPan, " maxCountUntilExevoPan ", maxCountUntilExevoPan);
        }
        if (currentRunes < maxRunes && (!alternateExevoPan || countUntilExevoPan % maxCountUntilExevoPan != 0)) {
            
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
                                    console.log("currentRunes " + currentRunes + " | maxRunes " + maxRunes);
                                });
                        }, 1000);
                    });
            }, 1000);

        } else {
            countUntilExevoPan = 0;
            setTimeout(function () {
                console.log("do exevo pan");

                newRobot
                    .press("enter")
                    .release("enter")
                    .go(function () {
                        setTimeout(function () {
                            newRobot
                                .typeString("exevo pan")
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
//    console.log("mana full? ", manaColor == currentManaColor);
    return manaColor == currentManaColor;
}

function isAlone() {
    var battleColor = robot.getPixelColor(battlePos.x, battlePos.y);
    var _isAlone = battleColor == emptyBattleColor;
    //    console.log("_isAlone ", _isAlone);
    return _isAlone;
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