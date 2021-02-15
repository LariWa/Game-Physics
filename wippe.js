class wippeClass {
  mouseCirclePos;
  posXTriangleStopper;
  posWippeX;
  direction;
  mouseCircleStartPosRot;
  //movement
  rotation;
  wippeIsPressed = false;
  rotateWippeReleased = false;
  v0;
  vWippe;
  ballV0;
  rotationReleased;
  ball;
  t;
  firstClick = false;
  interactable = false;
  constructor(direction, posWippeX, interactable) {
    this.direction = direction;
    this.posWippeX = posWippeX;
    this.rotation = this.direction * rot;
    this.mouseCircleStartPosRot = rotatePoint(mouseCircleStartPos, rot);
    this.mouseCircleStartPosRot = this.mouseCirclePos = [this.mouseCircleStartPosRot[0] * this.direction, this.mouseCircleStartPosRot[1]];
    this.ball = new ball(this);
    this.interactable = interactable;
  }

  drawWippe() {
    this.t += dt;

    if (this.interactable) fill(0, 0, 255);
    else fill(150, 150, 150);
    triangle(this.posWippeX - (triangleWippeSize * M) / 2, 0, this.posWippeX, triangleWippeHeight * M, this.posWippeX + (triangleWippeSize * M) / 2, 0); //base triangle

    push();
    translate(this.posWippeX, triangleWippeHeight * M + (wippbrettHeight * M) / 2); //Koordinatenursprung Mitte des Wippbrettes
    this.posXTriangleStopper = this.direction * triangleStopperPos * M;
    this.rotateWippeWithMouse();

    if (this.rotateWippeReleased) this.rotateWippeOnRelease();

    rect(0, 0, wippbrettWidth * M, wippbrettHeight * M); //wippbrett

    triangle(
      //stopper triangle
      this.posXTriangleStopper + (this.direction * triangleStopperSize * M) / 2,
      (wippbrettHeight * M) / 2,
      this.posXTriangleStopper,
      triangleStopperHeight * M + (wippbrettHeight * M) / 2,
      this.posXTriangleStopper - (this.direction * triangleStopperSize * M) / 2,
      (wippbrettHeight * M) / 2
    );
    fill(0, 200, 0);
    pop();

    //target
    fill(255, 0, 0);
    rect(this.posWippeX - this.direction * targetPosX * M, 0 + targetPosY * M, targetWidth * M, targetHeight * M);
  }

  rotateWippeWithMouse() {
    var circlePoint = [
      this.posXTriangleStopper + (this.direction * triangleStopperSize * M) / 2 + (this.direction * (diameter * M)) / 2,
      (wippbrettHeight * M) / 2 + (diameter * M) / 2,
    ];
    var xPos, rotCurrent;
    // circle(this.mouseCirclePos[0], this.mouseCirclePos[1], mouseCircleSize * M); //mouseCircle
    if (this.interactable && mouseIsPressed) {
      // if (!this.firstClick) {
      //   this.firstClick = true;
      //   wippeL.reset();
      //   wippeR.reset();
      // }
      var mousePosX = mouseX - xi0 - this.posWippeX;
      var mousePosY = -1 * (mouseY - yi0 + (triangleWippeHeight * M + (wippbrettHeight * M) / 2));
      //circle(this.mouseCirclePos[0], this.mouseCirclePos[1], mouseCircleSize * M);
      let d = dist(mousePosX, mousePosY, this.mouseCirclePos[0], this.mouseCirclePos[1]);
      if (d < (mouseCircleSize / 2) * M) {
        this.wippeIsPressed = true;
        xPos = this.direction * sqrt(pow((wippbrettWidth * M) / 2, 2) - pow(mousePosY, 2));
        var distMouse = dist(xPos, mousePosY, this.direction * mouseCircleStartPos[0], mouseCircleStartPos[1]);
        rotCurrent = (distMouse / 2 / ((wippbrettWidth * M) / 2)) * 2; //Linearisierung von arcsin(x) für kleine x
        if (rotCurrent > rot) {
          //if on floor don't rotate further
          xPos = undefined;
          rotCurrent = rot;
        }
        if (mousePosY - mouseCircleStartPos[1] < 0) rotCurrent = rotCurrent * -1;
        this.rotation = this.direction * rotCurrent;
        if (xPos != undefined) this.mouseCirclePos = [xPos, mousePosY];
      }
    }

    if (this.ball.movStatus == 0) {
      circlePoint = rotatePoint(circlePoint, this.rotation);
      push();
      if (this.direction == 1) fill("rgba(100%,0%,100%,0.5)");
      else if (this.direction == -1) fill("rgb(0,255,0)");
      circle(circlePoint[0], circlePoint[1], diameter * M);
      pop();
    }
    rotate(this.rotation);
  }

  rotateWippeOnRelease() {
    this.interactable = false;
    this.firstClick = false;
    this.rotation += this.direction * this.vWippe;
    if (abs(this.rotation) >= rot) {
      this.rotation = rot * this.direction;
      this.setBallMovementValues();
    }
  }
  releaseWippe() {
    this.wippeIsPressed = false;
    this.rotateWippeReleased = true;
    this.calculateNormalizedValue();
    this.vWippe = this.v0 / 15;
    this.rotationReleased = this.rotation;
  }

  setBallMovementValues() {
    this.rotateWippeReleased = false;
    this.t = 0;
    this.ball.setUpForThrowing(this.direction);
  }
  resetMouseCircle() {
    this.mouseCirclePos = this.mouseCircleStartPosRot;
  }
  calculateNormalizedValue() {
    var max = -1 * this.direction * (rot + 0.1);
    var min = max * -1;
    this.v0 = (this.rotation - min) / (max - min);
  }
  reset() {
    this.resetMouseCircle();
    this.rotCurrent = this.direction * rot;
    this.ball.reset();
  }
}
