//The images in the game are provided at the end of the program code.
//This declares and initializes variables pertaining to the spaceship. I wrote this code.
var xSpaceShip = getXPosition("spaceShip");
var ySpaceShip = getYPosition("spaceShip");
var spaceShipHeight = getProperty("spaceShip", "height");
var spaceShipWidth = getProperty("spaceShip", "width");
var xSpaceShipSpeed = 0;
var ySpaceShipSpeed = 0;
var xIsSpaceShipMoving = false;
var yIsSpaceShipMoving = false;
var theSpaceShipSpeed = 7;
var spaceShipHP = 3;

//This declares and initializes variables pertaining to the game state. I wrote this code.
var isGameOn = false;
var round = 1;
var points = 0;

//This declares and initializes variables pertaining to the pellets. I wrote this code.
var numPellets = 15;
var deadPellets = 0;
var canPelletsConnect = [];
var xPellets = [];
var yPellets = [];
var pelletHeight = 20;
var pelletWidth = 20;
var pelletsSpeed = [];
var pelletsIndex = 0;
var pelletsIdentification = [];
for (var i = 0; i < 15; i++) {
  appendItem(pelletsIdentification, "pellet"+i);
  image(pelletsIdentification[i], "8TGboEqGc.png");
  hideElement("pellet"+i);
}

//This declares and initializes variables pertaining to the enemy spaceships. I wrote this code.
var xEnemySpaceShips = [];
for (var i = 0; i < 10; i++) {
  appendItem(xEnemySpaceShips, randomNumber(0, 260));
}
var yEnemySpaceShips = [-35, -35, -35, -35, -35, -35, -35, -35, -35, -35];
var enemySpaceShipHeight = 30;
var enemySpaceShipWidth = 30;
var xEnemySpaceShipsSpeed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var yEnemySpaceShipsSpeed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var enemySpaceShipsSpeedMultiplier;
var areEnemySpaceShipsMoving = [false,false,false,false,false,false,false,false,false,false];
var enemySpaceShipsIdentification = ["enemySpaceShip0","enemySpaceShip1","enemySpaceShip2","enemySpaceShip3","enemySpaceShip4","enemySpaceShip5","enemySpaceShip6","enemySpaceShip7","enemySpaceShip8", "enemySpaceShip9"];
var canEnemySpaceShipsBeHit = [true, true, true, true, true, true, true, true, true, true];
var canEnemySpaceShipsDamage = [true, true, true, true, true, true, true, true, true, true];
for (var i = 0; i < enemySpaceShipsIdentification.length; i++) {
  image(enemySpaceShipsIdentification[i], "ship6.png");
  setProperty(enemySpaceShipsIdentification[i], "height", 30);
  setProperty(enemySpaceShipsIdentification[i], "width", 30);
  setPosition(enemySpaceShipsIdentification[i], xEnemySpaceShips[i], yEnemySpaceShips[i]);
}
//This actually begins the game. I wrote this code.
function startGame() {
  isGameOn = true;
  for (var i = 0; i < enemySpaceShipsIdentification.length; i++) {
    startMovingEnemySpaceShips(i);
  }
  startAnimation();
  playSound("sound://category_loops/vibrant_game_somethings_out_there_loop_1.mp3", true);
}
//This updates the positions of all of the game objects and does all the collision detection every 33 milliseconds. I wrote this code.
function startAnimation() {
  timedLoop(33, function() {
    if (xIsSpaceShipMoving) {
      xSpaceShip = xSpaceShip + xSpaceShipSpeed;
      xSpaceShip = limit(0, 280, xSpaceShip);
    }
    if (yIsSpaceShipMoving) {
      ySpaceShip = ySpaceShip + ySpaceShipSpeed;
      ySpaceShip = limit(0, 410, ySpaceShip); 
    }
    setPosition("spaceShip", xSpaceShip, ySpaceShip);
    for (var i = 0; i < enemySpaceShipsIdentification.length; i++) {
      if (areEnemySpaceShipsMoving[i]) {
        xEnemySpaceShips[i] = xEnemySpaceShips[i] + xEnemySpaceShipsSpeed[i];
        yEnemySpaceShips[i] = yEnemySpaceShips[i] + yEnemySpaceShipsSpeed[i];
        setPosition(enemySpaceShipsIdentification[i], xEnemySpaceShips[i], yEnemySpaceShips[i]);
        checkEnemySpaceShipCollision(i);
        resetEnemySpaceShips(i);
      }
    }
    for (var j = 0; j < pelletsIndex; j++) {
      if (canPelletsConnect[j] == true) {
        yPellets[j] = yPellets[j] + pelletsSpeed[j];
        setPosition(pelletsIdentification[j], xPellets[j], yPellets[j]);
        checkPelletCollision(j);
        if (yPellets[j] < -30) {
          deadPellets++;
          pelletsSpeed[j] = 0;
          yPellets[j] = -25;
          canPelletsConnect[j] = false;
        }
      }
    }
    checkWin();
    checkLose();
    checkPellets();
  });
}
//This limits a number so that it does not go past certain values. I found this code on the Internet.
function limit(lowerBound,upperBound, input) {
  var output;
  if (input < lowerBound) {
    output = lowerBound;
  } else if (input > upperBound) {
    output = upperBound;
  } else {
    output = input;
  }
  return output;
}
// This checks whether or not two objects are colliding. My partner wrote this code.
function checkCollision(x1, y1, h1, w1, x2, y2, h2, w2) {
  return x1<x2+w2 && x1+w1>x2 && y1<y2+h2 && y1+h1>y2;
}
//This generates a pellet. I wrote this code.
function generatePellet() {
  if (numPellets > 0) {
    appendItem(pelletsSpeed, -3);
    setProperty(pelletsIdentification[pelletsIndex], "height", pelletHeight);
    setProperty(pelletsIdentification[pelletsIndex], "width", pelletWidth);
    xPellets[pelletsIndex] = xSpaceShip + 11;
    yPellets[pelletsIndex] = ySpaceShip - 10;
    appendItem(canPelletsConnect, true);
    setPosition(pelletsIdentification[pelletsIndex], xPellets[pelletsIndex], yPellets[pelletsIndex]);
    showElement("pellet"+pelletsIndex);
    pelletsIndex++;
    numPellets--;
    setText("pelletsLabel", "Pellets: " + numPellets);
  }
}
// This checks if any of the pellets are colliding with any of the enemy spaceships. I wrote this code.
function checkPelletCollision(j) {
  for (var i = 0; i < enemySpaceShipsIdentification.length; i++) {
    if (checkCollision(xPellets[j], yPellets[j], pelletHeight, pelletWidth, xEnemySpaceShips[i], yEnemySpaceShips[i], enemySpaceShipHeight, enemySpaceShipWidth) && canEnemySpaceShipsBeHit[i] == true && canPelletsConnect[j] == true) {
      areEnemySpaceShipsMoving[i] = false;
      canEnemySpaceShipsBeHit[i] = false;
      canEnemySpaceShipsDamage[i] = false;
      hideElement("enemySpaceShip"+i);
      hideElement("pellet"+j);
      points++;
      pelletsSpeed[j] = 0;
      canPelletsConnect[j] = false;
      deadPellets++;
      setText("pointsLabel", "Points: "+points);
    }
  }
}
// This checks whether or not the pellets should reset. I wrote this code.
function checkPellets() {
  if (pelletsIndex >= 15 && deadPellets >= 15) {
    resetPellets();
  }
}
// This resets all important properties of the pellets. I wrote this code.
function resetPellets() {
  numPellets = 15;
  deadPellets = 0;
  pelletsIndex = 0;
  setText("pelletsLabel", "Pellets: "+numPellets);
  canPelletsConnect = [];
  xPellets = [];
  yPellets = [];
  pelletsSpeed = [];
}
// This function starts moving the enemy spaceships.
function startMovingEnemySpaceShips(i) {
  enemySpaceShipsSpeedMultiplier = randomNumber(0,1);
  if (enemySpaceShipsSpeedMultiplier == 0) {
    xEnemySpaceShipsSpeed[i] = randomNumber(1, 4)+round;
  } else if (enemySpaceShipsSpeedMultiplier == 1) {
    xEnemySpaceShipsSpeed[i] = randomNumber(-1, -4)-round;
  }
  yEnemySpaceShipsSpeed[i] = randomNumber(1, 6)+round;
  areEnemySpaceShipsMoving[i]=true;
}
// This checks if an enemy spaceship is colliding with the spaceship and updates the spaceship's health if it is. I wrote this code.
function checkEnemySpaceShipCollision(i) {
    if (checkCollision(xSpaceShip, ySpaceShip, spaceShipHeight, spaceShipWidth, xEnemySpaceShips[i], yEnemySpaceShips[i], enemySpaceShipHeight, enemySpaceShipWidth) && canEnemySpaceShipsDamage[i] == true) {
      spaceShipHP--;
      canEnemySpaceShipsDamage[i]=false;
      setText("hpLabel", "HP: "+spaceShipHP);
      playSound("sound://category_explosion/retro_game_classic_explosion_10.mp3", false);
    }
}
//This checks whether or not to reset the position of an enemy spaceship. It also checks whether or not to rebound the enemy spaceship off of the game screen. I wrote this code.
function resetEnemySpaceShips(i) {
  if (yEnemySpaceShips[i] > 500) {
    xEnemySpaceShips[i] = randomNumber(0, 260);
    yEnemySpaceShips[i] = -15;
    xEnemySpaceShipsSpeed[i]=randomNumber(1,4)+round;
    yEnemySpaceShipsSpeed[i]=randomNumber(1,6)+round;
    canEnemySpaceShipsDamage[i]=true;
  }
  if (xEnemySpaceShips[i] < 0 || xEnemySpaceShips[i] > 290) {
    xEnemySpaceShipsSpeed[i] = xEnemySpaceShipsSpeed[i] * -1;
  }
}
//This checks if the win condition has been reached. I wrote this code.
function checkWin() {
  if (points >= 10) {
    stopSound("sound://category_explosion/retro_game_classic_explosion_10.mp3");
    playSound("sound://category_achievements/vibrate_success_1_up.mp3", false);
    setScreen("winScreen");
    stopTimedLoop();
    resetAll();
    round+=1;
    if (round > 5) {
      setScreen("finalWinScreen");
      resetAll();
      round=1;
    }
  }
}
//This checks if the lose condition has been reached. I wrote this code.
function checkLose() {
  if (spaceShipHP <= 0) {
    setScreen("loseScreen");
    stopTimedLoop();
    resetAll();
    round=1;
  }
}
// This resets the everything about the game. I wrote this code.
function resetAll() {
  stopSound("sound://category_loops/vibrant_game_somethings_out_there_loop_1.mp3");

  xSpaceShip = 140;
  ySpaceShip = 185;
  setPosition("spaceShip", xSpaceShip, ySpaceShip);
  xSpaceShipSpeed = 0;
  ySpaceShipSpeed = 0;
  xIsSpaceShipMoving = false;
  yIsSpaceShipMoving = false;
  spaceShipHP = 3;
  setText("hpLabel", "HP: "+spaceShipHP);
  
  isGameOn = false;
  points = 0;
  setText("pointsLabel", "Points: "+points);
  
  resetPellets();
  for (var j = 0; j < 15; j++) {
    hideElement("pellet"+j);
  }
  
  yEnemySpaceShips = [-35, -35, -35, -35, -35, -35, -35, -35, -35, -35];
  xEnemySpaceShipsSpeed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  yEnemySpaceShipsSpeed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  areEnemySpaceShipsMoving = [false,false,false,false,false,false,false,false,false,false];
  canEnemySpaceShipsBeHit = [true, true, true, true, true, true, true, true, true, true];
  canEnemySpaceShipsDamage = [true, true, true, true, true, true, true, true, true, true];
  for (var i = 0; i < enemySpaceShipsIdentification.length; i++) {
    xEnemySpaceShips[i]=randomNumber(0,260);
    setPosition("enemySpaceShip"+i, xEnemySpaceShips[i], yEnemySpaceShips[i]);
    showElement("enemySpaceShip"+i);
  }
}
//This event handler starts the game when the "b" key is pressed, and it also handles the movement of the spaceship and the firing of pellets from the spaceship. I wrote this code.
onEvent("gameScreen", "keydown", function(event) {
  if (event.key=="b" && isGameOn == false) {
    hideElement("instructionsLabel");
    startGame();
  }
  if (isGameOn == true) {
    if (event.key == "Left" || event.key == "a") {
      xIsSpaceShipMoving = true;
      xSpaceShipSpeed = -1*theSpaceShipSpeed;
    }
    if (event.key == "Right" || event.key == "d") {
      xIsSpaceShipMoving = true;
      xSpaceShipSpeed = theSpaceShipSpeed;
    }
    if (event.key == "Up" || event.key == "w") {
      yIsSpaceShipMoving = true;
      ySpaceShipSpeed = -1*theSpaceShipSpeed;
    }
    if (event.key == "Down" || event.key == "s") {
      yIsSpaceShipMoving = true;
      ySpaceShipSpeed = theSpaceShipSpeed;
    }
    if (event.key == "r") {
      generatePellet();
    }
  }
});
// This stops the spaceship after the key is no longer being pressed. I wrote this code.
onEvent("gameScreen", "keyup", function(event) {
  if (event.key=="Left" || event.key =="a" || event.key=="Right" || event.key == "d") {
    xIsSpaceShipMoving = false;
  }
  if (event.key=="Up" || event.key =="w" || event.key=="Down" || event.key == "s") {
    yIsSpaceShipMoving = false;
  }
});
//This changes the screen and the round label when the "LosePlayAgainButton" is pressed. I wrote this code.
onEvent("LosePlayAgainButton", "click", function() {
  setText("roundLabel", "Round: "+round);
  setScreen("gameScreen");
});
//This changes the screen and the round label when the "nextRoundButton" is pressed. I wrote this code.
onEvent("nextRoundButton", "click", function() {
  setText("roundLabel", "Round: "+round);
  setScreen("gameScreen");
});
//This changes the screen and the round label when the "WinPlayAgainButton" is pressed. I wrote this code.
onEvent("WinPlayAgainButton", "click", function() {
  setText("roundLabel", "Round: "+round);
  setScreen("gameScreen");
});
/*
Image Sources:
Pellet: http://clipart-library.com/images/8TGboEqGc.png
Final Win Background: https://i2.wp.com/www.123freevectors.com/wp-content/original/132488-abstract-geometric-cool-purple-background.jpg
Win Background: https://i.ytimg.com/vi/b4eN4mNStN0/maxresdefault.jpg
Lose Background: https://ak1.picdn.net/shutterstock/videos/25360751/thumb/1.jpg
Game Screen Background: https://thewellredmage.files.wordpress.com/2016/06/background.gif?w=364&h=542
Spaceship: https://opengameart.org/sites/default/files/cartoonship%20blue.png
Enemy Spaceship: https://opengameart.org/sites/default/files/ship5.png
*/