// DM2008 – Activity 5a
// Colliding Circles (30 min)

let balls = [];

function setup() {
  createCanvas(400, 400);

  // Step 1: create two Ball objects
balls.push(new Ball(100, 200));
balls.push(new Ball(300, 200));
balls.push(new Ball(400, 200));
balls.push(new Ball(400, 300));
balls.push(new Ball(300, 200));
balls.push(new Ball(400, 200));
balls.push(new Ball(400, 300));
balls.push(new Ball(300, 200));
balls.push(new Ball(400, 200));
balls.push(new Ball(400, 300));
}

function draw() {
  background(0);

  // Step 2: update and display each ball
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.move();
    b.show();
    b.checkCollision(balls);
  // Step 3: check collisions
  // Use dist() between ball centers
  // Trigger feedback (color, bounce, etc.)
  }
}

function setGlow(col, blur=20, alpha=0.8) {
  const c = color(col);
  c.setAlpha(alpha * 255);
  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = c.toString(); // "rgba(...)"
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
}

class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = 30;
    this.vel = createVector(random(1, 5), random(-2, 2));
  }

  move() {
    this.pos.add(this.vel);
    
  }
  
move() {
    this.pos.add(this.vel);
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
  }

    // TODO: wrap around OR bounce off edges

  show(){
    fill(100, 180, 220);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

   checkCollision(others) {
    for (let i = 0; i < others.length; i++) {
      if (others[i] !== this) {
        const other = others[i];
        const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < this.r + other.r) {
          push();
          noStroke();
          setGlow('#F1891E', 50, 1.5);
          fill(200, 60, 60);
          ellipse(this.pos.x, this.pos.y, this.r * 2);
          pop();
        }
      }
    }
   }
}