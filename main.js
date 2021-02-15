/**********************************************************************/
/* GTAT2 Game Technology & Interactive Systems: Game Physics Übung 7  */
/* Autor:  Larissa Wagnerberger                                       */
/* Matricle Number: s0562854                                          */
/* Stand: 30.11.2020                                                  */
/**********************************************************************/
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var gameWidth = 1.6;
var M = canvasWidth / gameWidth; //Maßstab

//Objektgroessen und -positionen in Metern------------
var groundHeight = 0.05;
var diameter = 0.032; //Durchmesser der Kugeln
//wippe
var wippePosX = 0.6;
var triangleWippeSize = 0.075;
var wippbrettHeight = 0.01;
var wippbrettWidth = 0.25;
var triangleStopperSize = 0.03;
var triangleStopperPos = 0.08;

var targetPosX = 0.2;
var targetPosY = -0.005;
var targetWidth = 0.04;
var targetHeight = 0.01;
var triangleStopperHeight = (Math.sqrt(3) * triangleStopperSize) / 2;
var triangleWippeHeight = (Math.sqrt(3) * triangleWippeSize) / 2;

// kartesischer Mittelpunkt im internen Koordinatensystem
var xi0 = canvasWidth / 2;
var yi0 = canvasHeight - groundHeight * M;

let button;

//mouse interaction
var mouseCircleStartPosX = (wippbrettWidth / 2) * M;
var mouseCircleStartPosY = Math.sqrt(Math.pow((wippbrettWidth * M) / 2, 2) - Math.pow(mouseCircleStartPosX, 2));
var mouseCircleStartPos = [mouseCircleStartPosX, mouseCircleStartPosY];
var mouseCircleSize = 0.05;

var rot = 0.62;

timeMultiplier = 1 / 3; //langsamerer Wurf
var dt = (1 / 60) * timeMultiplier;
var g = 9.81;
var ballPoint = [(wippbrettWidth * M) / 2 - (diameter / 2) * M, 0 + (diameter / 2) * M];
ballPoint = rotatePoint(ballPoint, rot);
ballPoint[1] += triangleWippeHeight * M + (wippbrettHeight * M) / 2;
var y0Ball = -ballPoint[1] / M - triangleWippeHeight + diameter / 2 - wippbrettHeight / 2;

var wippeR;
var wippeL;

var windMax = 1;
var vWind = 0;
var windToggle;
var testballToggle;

var testBall;
var testButton;
var helptext = "change position of testball with arrow keys \nrotate speed vector position with ad \nchange length of speed vector with ws \nstart with Enter ";
var help;
var targetBall;
var scored = false;
var scoreLeft = 0;
var scoreRight = 0;
var turnPlayer = "Player 1's Turn";
var numOfRounds = 5;
var rounds = numOfRounds;

function setup() {
  createCanvas(windowWidth, windowHeight);
  /*Adminteil-----------------------------*/
  frameRate(60);
  button = createButton("");
  button.html("Reset Game");
  button.position(20, 20);
  button.mousePressed(startReset);
  windToggle = createCheckbox("Wind on/off", true);
  windToggle.position(canvasWidth / 2 - 50, 80);
  // testballToggle = createCheckbox("testball on/off", true);
  // testballToggle.position(canvasWidth / 2 - 50, 100);
  // help = createDiv("?");
  // help.position(canvasWidth / 2 + 70, 95);
  // help.attribute("title", helptext);
  // help.style("border", "solid");
  // help.style("border-radius", "25px");
  // help.style("padding", "3px");
  // help.style("border-width", "1.5px");
  wippeL = new wippeClass(-1, -wippePosX * M, true);
  wippeR = new wippeClass(1, wippePosX * M, false);
  targetBall = new ball(undefined, true);
  setWind();
  windToggle.changed(changeWind);
  //testBall = new testballClass();
}
function preload() {}
function draw() {
  background(200, 200, 200);

  fill(0);
  textSize(40);
  textAlign(CENTER, TOP);
  text(turnPlayer, 0, 10, canvasWidth);
  textSize(16);
  text("Treffer " + scoreLeft + ":" + scoreRight, 0, 60, canvasWidth);
  textSize(16);
  text("Wind: " + round(vWind, 2) + " m/s", 0, 120, canvasWidth);
  text(rounds + " rounds left", 0, 140, canvasWidth);

  /*--------------------------------------*/

  push();
  translate(xi0, yi0);
  scale(1, -1);
  noStroke();
  fill(200, 200, 0);
  rectMode(CENTER);
  rect(0, -(groundHeight * M) / 2, canvasWidth, groundHeight * M);
  wippeL.drawWippe();
  wippeR.drawWippe();
  wippeL.ball.moveBall();
  wippeR.ball.moveBall();
  targetBall.moveBall();
  //testBall.update();
  fill(255, 0, 0);
  pop();
  if (windToggle.checked()) drawArrow(createVector(canvasWidth / 2, 110), createVector(vWind * 50, 0), "black");
}

function nextTurn(wippe) {
  if (wippe == -1) {
    wippeR.reset();
    wippeR.interactable = true;
    turnPlayer = "Player 2's Turn";
  } else {
    wippeL.reset();
    wippeL.interactable = true;
    turnPlayer = "Player 1's Turn";
    rounds--;
  }
  if (rounds == 0) {
    if (scoreLeft > scoreRight) turnPlayer = "Player 1 won!!";
    else if (scoreLeft < scoreRight) turnPlayer = "Player 2 won!!";
    else turnPlayer = "draw";
    wippeL.interactable = false;
  }
}
