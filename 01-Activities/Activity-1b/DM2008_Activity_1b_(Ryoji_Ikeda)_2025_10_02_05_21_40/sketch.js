// DM2008
// Activity 1b (Ryoji Ikeda)

let x;
let w;
let c = [];

function setup() {
  createCanvas(800, 800);
  background(0);
  noStroke();
  fill(0);
  c = ["#6BC475","#579660","#005A47","#005357","#0B1C63"]
  frameRate(40);
  
}

function draw() {
  background(255, 5);
  
  push();
  fill(random(c));
  x = random(width);
  w = random(1, 40);
  
  rect(x, 0, w, height/10); 
   x = random(width);
  rect(x,  height/10, w, height/10);
  x = random(width);
  rect(x, 2 * height/10, w, height/10);
  x = random(width);
  rect(x, 3 * height/10, w, height/10);
    x = random(width);
  rect(x, 4 * height/10, w, height/10);
    x = random(width);
  rect(x, 5 * height/10, w, height/10);
    x = random(width);
  rect(x, 6 * height/10, w, height/10);
    x = random(width);
  rect(x, 7 * height/10, w, height/10);
    x = random(width);
  rect(x, 8 * height/10, w, height/10);
    x = random(width);
  rect(x, 9 * height/10, w, height/10);
  pop();
  
  push();
  noStroke();
  fill(255);
  blendMode(DIFFERENCE);
  ellipse(mouseX, mouseY, 200);
  pop();
}

function keyPressed() {
  
}