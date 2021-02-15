var currentPlayer;
class ball {
  ballV0;
  wippe;
  movStatus = 0;
  wippBrettStartPos = wippePosX - cos(rot) * (wippbrettWidth / 2) - sin(rot) * (wippbrettHeight / 2);
  wippBrettEndPos = [this.wippBrettStartPos + cos(rot) * wippbrettWidth, sin(rot) * wippbrettWidth];
  y0Ball = diameter / 2;
  xMovDirection = -1;
  ballPosWippStart = this.wippBrettStartPos - (diameter / 2 / cos(rot / 2)) * sin(rot / 2);
  ballPosWippEnd;
  ballSpeedMultiplier = 5;
  vx;
  vw;
  vy;
  x = 0;
  y;
  xWippe = 0;
  reibung = 0.1 * g * dt;
  reibungWippe = this.reibung * cos(rot);
  rho = 1.3;
  cw = 0.45;
  m = 0.0025;
  bouncingFactor = 0.7;
  stroemung;
  vWind;
  testing = 1;
  targetBall = false;
  targetPos;
  resetted;
  constructor(wippe, targetBall) {
    if (targetBall) {
      this.x = 0;
      this.y = this.y0Ball;
      this.movStatus = 2;
      this.targetBall = true;
    } else {
      this.stroemung = (this.cw * this.rho * Math.PI * sq(diameter)) / (2 * this.m);
      this.wippe = wippe;
    }
    this.ballPosWippEnd = this.transformPointToSchiefeEbene(this.ballPosWippStart, 0);
    this.targetPos = wippePosX - targetPosX - targetWidth / 2;
  }

  moveBall() {
    push();
    if (this.targetBall) fill(80);
    else if (this.wippe != undefined && this.wippe.direction == 1) fill("rgba(100%,0%,100%,0.5)");
    else if (this.wippe != undefined && this.wippe.direction == -1) fill("rgb(0,255,0)");
    switch (this.movStatus) {
      case 1:
        this.throwBall();
        break;
      case 2:
        this.geradeEbene();
        break;
      case 3:
        this.schiefeEbene();
        break;
      case 4:
        this.throwFromWippe();
        break;
    }
    pop();
  }
  throwBall() {
    var vxOld = this.vx;
    this.vx = vxOld - this.stroemung * (vxOld - vWind) * sqrt(sq(vxOld - vWind) + sq(this.vy)) * dt;
    this.x += this.vx * dt;
    this.vy = this.vy - (this.stroemung * this.vy * sqrt(sq(vxOld - vWind) + sq(this.vy)) + g) * dt;

    this.y += this.vy * dt;
    if (this.y < this.y0Ball) {
      this.y = this.y0Ball;
      this.setUpForBouncing();
    }
    this.isOutsideCanvas();
    if (!this.IsOnWippeThrowBall(this.x, this.y)) {
      circle(this.x * M, this.y * M, diameter * M);
    }
    this.checkCollision();
  }

  checkCollision() {
    if (!this.targetBall) {
      if (sqrt(sq(this.x - targetBall.x) + sq(this.y - targetBall.y)) < diameter) {
        this.collide(false);
      }
    }
  }
  checkCollisionFromWippe() {
    var x, y;
    [x, y] = this.wippeToWorld(this.xWippe, this.y0Ball);

    if (!this.targetBall) {
      if (sqrt(sq(x - targetBall.x) + sq(y - targetBall.y)) < diameter) {
        this.x = x;
        this.y = y;
        //this.xMovDirection = this.xMovDirection * -1;
        this.vx = -1 * this.xMovDirection * abs(this.vw);
        this.vy = 0;
        this.collide();
      }
    }
  }
  collide() {
    var beta = atan2(this.y - targetBall.y, this.x - targetBall.x);
    var phi = beta - HALF_PI;

    var vT1, vZ1, vT2, vZ2, vx1, vx2, vy1, vy2;
    [vT1, vZ1] = rotateVector(this.vx, this.vy, phi);
    [vT2, vZ2] = rotateVector(0, 0, phi);

    var vZ1_ = ((this.m - this.m) * vZ1 + 2 * this.m * vZ2) / (this.m + this.m);
    var vZ2_ = ((this.m - this.m) * vZ2 + 2 * this.m * vZ1) / (this.m + this.m);

    [vx1, vy1] = rotateVector(vT1, vZ1_, -phi);
    [vx2, vy2] = rotateVector(vT2, vZ2_, -phi);

    vy1 = vy1 - vy2;
    vy2 = 0;
    this.vx = vx1;
    this.vy = vy1;
    targetBall.vx = vx2;
    targetBall.vy = vy2;
    if (this.vy <= 0) {
      this.movStatus = 2;
      this.y = this.y0Ball;
    } else this.movStatus = 1;
    if (this.wippe != undefined) {
      scored = false;
      currentPlayer = this.wippe.direction;
    }
  }
  checkTarget() {
    if (this.targetBall) {
      if (!scored) {
        if (this.x >= this.targetPos && currentPlayer == -1) {
          scored = true;
          scoreLeft++;
          setTimeout(() => {
            this.resetTarget(-1);
          }, 1000);
          this.resetted = true;
        } else if (this.x <= -this.targetPos && currentPlayer == 1) {
          scored = true;
          scoreRight++;
          this.resetted = true;
          setTimeout(() => {
            this.resetTarget(1);
          }, 1000);
        }
      }
    }
  }
  resetTarget(wippeDir) {
    nextTurn(currentPlayer);
    targetBall.vx = 0;
    targetBall.vy = 0;
    targetBall.x = 0;
    targetBall.movStatus = 2;
    targetBall.y = diameter / 2;
    if (wippeDir == 1) wippeR.ball.reset();
    else wippeL.ball.reset();
  }

  throwFromWippe() {
    this.x += this.vx * dt;
    this.vy = this.vy - g * dt;
    this.y += this.vy * dt;
    this.isOutsideCanvas();
    if (this.y < this.y0Ball) {
      if (this.wippe != undefined) {
        this.wippe.reset();
        nextTurn(this.wippe.direction);
      } else if (this.targetBall) {
        this.targetBallReset();
      } else testBall.reset();
    }
    circle(this.x * M, this.y * M, diameter * M);
  }
  geradeEbene() {
    var temp = Math.sign(this.vx);
    this.vx -= Math.sign(this.vx) * this.reibung;
    if (temp != Math.sign(this.vx)) this.vx = 0;
    this.x += this.vx * dt;
    this.isOutsideCanvas();
    this.checkCollision();
    this.checkTarget();
    this.isNotMoving();
    if (!this.IsOnWippeGeradeEbene(this.x)) circle(this.x * M, this.y * M, diameter * M);
  }
  schiefeEbene() {
    push();
    translate(this.xMovDirection * this.wippBrettStartPos * M, 0);
    rotate(this.xMovDirection * rot);
    scale(this.xMovDirection, 1);
    if (this.vw > 0) this.vw = this.vw - g * dt * sin(rot) - this.reibungWippe;
    else this.vw = this.vw - g * dt * sin(rot) + this.reibungWippe;
    this.xWippe = this.xWippe + this.vw * dt;
    if (this.xWippe * M <= this.ballPosWippEnd[0]) {
      //am Boden
      this.x = this.xMovDirection * this.ballPosWippStart;
      this.xMovDirection = this.xMovDirection * -1;
      this.movStatus = 2;
      this.y = this.y0Ball;
      this.vx = this.xMovDirection * abs(this.vw);
      this.geradeEbene();
    } else if (this.xWippe > wippbrettWidth) {
      //am wippende
      this.setUpForFalling();
    } else {
      circle(this.xWippe * M, this.y0Ball * M, diameter * M);
    }
    pop();
    this.checkCollisionFromWippe();

    var test = this.wippeToWorld(this.xWippe, this.y0Ball);
    //circle(test[0] * M, test[1] * M, 40);
  }
  wippeToWorld(x, y) {
    var posBall = [x, y];
    posBall = rotateVector(x, y, -rot);
    posBall[0] += this.wippBrettStartPos;
    if (this.xMovDirection < 0) posBall[0] *= -1;
    return posBall;
  }

  IsOnWippeGeradeEbene(x) {
    if (
      (x < -this.ballPosWippStart && x > -this.ballPosWippStart - wippbrettWidth / 2) ||
      (x > this.ballPosWippStart && x < this.ballPosWippStart + wippbrettWidth / 2)
    ) {
      this.movStatus = 3;
      this.vw = abs(this.vx);
      this.xWippe = 0;
      this.xMovDirection = Math.sign(this.vx);
      return true;
    }
  }
  transformPointToSchiefeEbene(x, y) {
    x = abs(x);
    x -= this.wippBrettStartPos;
    var posBall = [x, y];
    posBall = rotatePoint([x, y], -rot);
    return posBall;
  }
  IsOnWippeThrowBall(x, y) {
    var xBall = x;
    var yBall = y;
    y -= this.y0Ball;
    x = x;

    //rechte Wippe
    var wippenBrettVector = [this.wippBrettEndPos[0] - this.wippBrettStartPos, this.wippBrettEndPos[1]];
    var ballVector = [x - this.wippBrettStartPos, y];
    var leftOrRight = ballVector[1] * wippenBrettVector[0] - wippenBrettVector[1] * ballVector[0]; //y2*x1-y1*x2
    if (leftOrRight < 0 && x < this.wippBrettEndPos[0]) {
      //is on or behind wippe
      this.movStatus = 3;
      this.vw = sqrt(sq(this.vx) + sq(this.vy)) * cos(atan(abs(this.vx) / abs(this.vy)) + rot);
      this.xWippe = this.transformPointToSchiefeEbene(xBall, yBall)[0];
      this.xMovDirection = 1;
      if (this.wippe != undefined && this.wippe.direction == 1 && this.x > this.wippBrettStartPos) {
        this.vw *= -1;
        this.y = this.y0Ball;
      }
      this.vy = 0;
      return true;
    }
    //linke Wippe
    var wippenBrettVector = [-this.wippBrettEndPos[0] + this.wippBrettStartPos, this.wippBrettEndPos[1]];
    var ballVector = [x - -this.wippBrettStartPos, y];
    var leftOrRight = ballVector[1] * wippenBrettVector[0] - wippenBrettVector[1] * ballVector[0]; //y2*x1-y1*x2
    leftOrRight *= -1;
    if (leftOrRight < 0 && x > -this.wippBrettEndPos[0]) {
      //is on or behind wippe
      this.movStatus = 3;
      this.vw = sqrt(sq(this.vx) + sq(this.vy)) * cos(atan(abs(this.vx) / abs(this.vy)) + rot);
      this.xWippe = this.transformPointToSchiefeEbene(xBall, yBall)[0];
      if (this.wippe != undefined && this.wippe.direction == -1 && this.x < -1 * this.wippBrettStartPos) {
        this.vw *= -1;
        this.y = this.y0Ball;
      }
      this.vy = 0;
      return true;
    }

    //for debugging
    // push();
    // stroke(3);
    // line(this.wippe.direction * this.wippBrettStartPos * M, 0, this.wippe.direction * this.wippBrettEndPos[0] * M, this.wippBrettEndPos[1] * M);
    // line(x, y, this.wippe.direction * this.wippBrettStartPos * M, 0);
    // pop();
  }
  setUpForThrowing(direction) {
    this.movStatus = 1;
    if (direction == -1) {
      //left
      this.ballV0 = this.wippe.v0 * this.ballSpeedMultiplier;
      this.vx = this.ballV0 * cos(1.57 - rot);
      this.x = -1 * (ballPoint[0] / M + wippePosX);
    } else {
      //right
      this.ballV0 = this.wippe.v0 * this.ballSpeedMultiplier;
      this.x = ballPoint[0] / M + wippePosX;
      this.vx = -1 * this.ballV0 * cos(1.57 - rot);
    }
    this.vy = this.ballV0 * sin(1.57 - rot);
    this.y = this.wippBrettEndPos[1] + diameter / 2;
    //setWind();
  }

  setUpForFalling() {
    console.log("fall");
    this.movStatus = 4;
    this.x = Math.sign(this.vx) * this.wippBrettEndPos[0];
    this.vx = Math.sign(this.vx) * this.vw * cos(rot);
    this.vy = this.vw * sin(rot);
    this.y = this.wippBrettEndPos[1] + diameter / 2;
  }

  setUpForBouncing() {
    this.ballV0 = sqrt(sq(this.vx) + sq(this.vy));
    this.vy = -this.vy - this.bouncingFactor;
    if (this.vy <= 0) {
      this.movStatus = 2;
      this.vy = 0;
    } //gerade Ebene
  }
  isOutsideCanvas() {
    if (this.x > canvasWidth / M / 2 || this.x < -(canvasWidth / M) / 2) {
      if (this.wippe != undefined) {
        this.wippe.reset();
        nextTurn(this.wippe.direction);
      } else if (this.targetBall) {
        this.targetBallReset();
      } else testBall.reset();
    }
  }
  reset() {
    this.movStatus = 0;
    this.xWippe = 0;
    this.xMovDirection = -1;
    this.resetted = false;
  }
  targetBallReset() {
    targetBall.x = 0;
    targetBall.y = diameter / 2;
    targetBall.vx = 0;
    targetBall.vy = 0;
  }
  isNotMoving() {
    if (!this.resetted && this.vx <= 0.001 && this.vx >= -0.001 && !this.targetBall && targetBall.vx <= 0.001 && targetBall.vx >= -0.001) {
      this.reset();
      nextTurn(this.wippe.direction);
    }
  }
}
