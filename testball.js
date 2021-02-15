class testballClass {
  xPos = 0;
  yPos = 100;
  movStep = 10;
  vxPosStart = 100;
  vyPosStart = 100;
  testball;
  vFactor = 10;
  angle = 0;
  v;
  constructor() {
    this.v = createVector(this.vxPosStart - this.xPos, this.vyPosStart - this.yPos);
  }
  update() {
    let base = createVector(this.xPos, this.yPos);
    drawArrow(base, this.v, "black");
    circle(this.xPos, this.yPos, diameter * M);

    if (this.testball != undefined) this.testball.moveBall();
  }
  move(key) {
    switch (key) {
      case "ArrowLeft":
        this.xPos -= this.movStep;
        break;
      case "ArrowRight":
        this.xPos += this.movStep;
        break;
      case "ArrowUp":
        this.yPos += this.movStep;
        break;
      case "ArrowDown":
        this.yPos -= this.movStep;
        break;
      case "w":
        this.v.mult(1.1);
        break;
      case "a":
        this.v.rotate(0.05);
        break;
      case "s":
        this.v.mult(0.9);
        break;
      case "d":
        this.v.rotate(-0.05);
        break;
      case "Enter":
        this.testball = new ball();
        this.testball.movStatus = 1;
        this.testball.vx = this.v.x / (M / this.vFactor);
        this.testball.vy = this.v.y / (M / this.vFactor);
        this.testball.x = this.xPos / M;
        this.testball.y = this.yPos / M;
        break;
    }
  }
  reset() {
    this.testball = null;
  }
}

function move(e) {
  testBall.move(e.key);
}
document.addEventListener("keydown", move);
