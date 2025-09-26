// DM2008 — Mini Project
// FLAPPY BIRDIE

// Notes for students:
// 1) Add flap control in handleInput() (space / ↑ to jump)
// 2) Detect collisions between the bird and pipes → game over
// 3) Add scoring when you pass a pipe
// 4) (Stretch) Add start/pause/game-over states

let started = false;
let score = 0;
let scoreFont, scoreNumber;
let flapSound, hitSound, plusSound;
let bgm;
//bgm;

/* ----------------- Globals ----------------- */
let bird, birdIdle, birdFlap, underWater, seaweed, gameOver;
let pipes = [];
 
let spawnCounter = 0; // timer
const SPAWN_RATE = 90; // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 3;
let PIPE_GAP = 180; // gap height (try 100–160)
const PIPE_W = 60;

/* ----------------- Setup & Draw ----------------- */
function preload() {
  birdIdle = loadImage("bloop1.png"); // idle state
  birdFlap = loadImage("bloop2.png"); // flapping state
  underWater = loadImage("FLAPPYbg.png");
  seaweed = loadImage("FLAPPYseaweed.png");
  scoreFont = loadFont("RUSHDAFunky.ttf");
  scoreNumber = loadFont("BoldPixels.ttf");
  flapSound = loadSound("./sound/flapboing.mp3");
  hitSound = loadSound("./sound/boinghit.mp3");
  bgm = loadSound("./sound/littlemermaid.mp3")
  gameOver = loadImage("gameover.png");
  plusSound = loadSound("./sound/bell.wav");
}

function setup() {
  createCanvas(480, 640);
  noStroke();
  imageMode(CENTER);

  bird = new Bird(120, height / 2);
  pipes = [];
  spawnCounter = 0;
  score = 0;
}

function draw() {
  image(underWater, width / 2, height / 2);

  if (!started) {
    // Waiting screen
    fill("#51e2f5");
    textAlign(CENTER);
    textFont(scoreNumber);
    textSize(55);
    text("Press SPACE", width / 2, height / 4 - 5);
    text("to Start", width / 2, height / 4 + 45);
    fill(0);
    textAlign(CENTER);
    textFont(scoreNumber);
    textSize(55);
    text("Press SPACE", width / 2, height / 4);
    text("to Start", width / 2, height / 4 + 50);
  
   bgm.loop();
   bgm.setVolume(2);

    // Draw bird idle
    bird.show();
    return; // stop here until started = true
  }

  handleInput();
  bird.update();

  // Spawn pipes on a timer
  spawnCounter++;
  if (spawnCounter >= SPAWN_RATE) {
    pipes.push(new Pipe(width + 40));
    spawnCounter = 0;
  }

  // Update + draw pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    // Collision check
    if (pipes[i].hits(bird)) {
      noLoop();
      fill(255);
      textFont(scoreFont);
      textSize(80);
      console.log("Game Over");
      image(gameOver, width / 2, height / 2.5, 400, 400);
      //text("GAME OVER", width / 2, height / 2);
      hitSound.play();
    }

    // Score: check if bird has passed pipe
    if (!pipes[i].passed && pipes[i].x + pipes[i].w < bird.pos.x) {
      pipes[i].passed = true;
      score++;
      plusSound.play();
    }

    // Remove pipes off screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // touch the ground
  if (bird.pos.y >= height - bird.r) {
    noLoop();
    fill(255);
    console.log("Game Over");
    textFont(scoreFont);
    textSize(80);
    image(gameOver, width / 2, height / 2.5, 400, 400);
    //text("GAME OVER", width / 2, height / 2);
    hitSound.play();
  }

  // randomize pipe gap
  if (frameCount % 270 == 0) {
    PIPE_GAP = random(160, 180);
  }

  // Draw bird on top
  bird.show();

  // Draw score
  fill("#51e2f5");
  textAlign(CENTER, CENTER);
  textFont(scoreNumber);
  textSize(60);
  text(score, width / 2, height / 6 - 5);
  fill(0);
  textAlign(CENTER, CENTER);
  textFont(scoreNumber);
  textSize(60);
  text(score, width / 2, height / 6);
}

/* ----------------- Input ----------------- */
function handleInput() {
  // Optional: continuous flap if holding key
  // if (keyIsDown(32)) bird.flap();
}

function keyPressed() {
  if (key === " " || keyCode === UP_ARROW) {
    if (!started) {
      started = true; // start the game
    }
    bird.flap();
    flapSound.play();
  }
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 26; // radius
    this.hitR = 18;
    this.gravity = 0.5; // downward force
    this.flapStrength = -9.0; // upward kick

    this.currentImg = birdIdle; // start with idle image
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    this.vel.y = this.flapStrength;
    this.currentImg = birdFlap; // show flap image

    // reset to idle after short delay
    setTimeout(() => {
      this.currentImg = birdIdle;
    }, 150);
  }

  update() {
    // gravity
    this.applyForce(this.gravity);

    // integrate
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // stay inside canvas vertically
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
    }
  }

  show() {
    image(
      this.currentImg,
      this.pos.x,
      this.pos.y - this.r / 5,
      this.r * 2.5,
      this.r * 2.5
    );
  }
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;

    // randomize gap position
    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);

    this.top = gapY; // bottom of top pipe
    this.bottom = gapY + PIPE_GAP; // top of bottom pipe

    this.passed = false; // for scoring
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    let pipeHeight = height - this.bottom;
    fill(120, 200, 160);
    //rect(this.x, 0, this.w, this.top); // top pipe
    // Top pipe flipped

    push();
    translate(this.x + this.w, this.top); // move origin to bottom of the top pipe
    scale(1, -1); // flip vertically
    image(seaweed, 0, 0, this.w * 4.5, this.top * 2);
    //image(seaweed, this.x + this.w, 0, this.w * 4.5, this.top * 2); // same scaling
    pop();

    image(seaweed, this.x + this.w, this.bottom, this.w * 4.5, pipeHeight * 2);
    //rect(this.x, this.bottom, this.w, height - this.bottom); // bottom pipe
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  hits(bird) {
    const withinX =
      bird.pos.x + bird.hitR > this.x &&
      bird.pos.x - bird.hitR < this.x + this.w;

    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;

    return withinX && (aboveGap || belowGap);
  }
}

// TODO (students): circle-rect collision (simple)
// 1) Check if bird within pipe's x range.
// 2) If yes, check if bird.y is outside the gap (above top OR below bottom).
//    Then it’s a hit.
//
// hits(bird) {
//   const withinX = (bird.pos.x + bird.r > this.x) && (bird.pos.x - bird.r < this.x + this.w);
//   const aboveGap = bird.pos.y - bird.r < this.top;
//   const belowGap = bird.pos.y + bird.r > this.bottom;
//   return withinX && (aboveGap || belowGap);
// }
