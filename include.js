function multiplyMatrixAndPoint(matrix, point) {
  var x = matrix[0] * point[0] + matrix[1] * point[1];
  var y = matrix[2] * point[0] + matrix[3] * point[1];
  return [x, y];
}
function rotatePoint(point, angle) {
  var rot = [Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle)];
  return multiplyMatrixAndPoint(rot, point);
}

function startReset() {
  // if (button.html() == "Start") button.html("Reset");
  // else {
  wippeL.reset();
  wippeR.reset();
  // testBall.reset();
  targetBall.targetBallReset();
  turnPlayer = "Player 1's Turn";
  scoreLeft = scoreRight = 0;
  wippeL.interactable = true;
  wippeR.interactable = false;
  rounds = numOfRounds;
  // button.html("Start");
  // }
}
function mouseReleased() {
  var mousePosX = mouseX - xi0;
  if (mousePosX > 0 && wippeR.wippeIsPressed) wippeR.releaseWippe();
  else if (mousePosX < 0 && wippeL.wippeIsPressed) wippeL.releaseWippe();
}
function setWind() {
  if (windToggle.checked()) vWind = getWind();
  else vWind = 0;
  setTimeout(setWind, 5000);
}
function getWind() {
  return Math.random() * (windMax + windMax) - windMax;
}
function changeWind() {
  if (windToggle.checked()) vWind = getWind();
  else vWind = 0;
}
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
function rotateVector(x, y, angle) {
  return [x * cos(angle) + y * sin(angle), -x * sin(angle) + y * cos(angle)];
}
