// DM2008 — Activity 2b
// (Pattern Making, 40 min)

function setup() {
  createCanvas(400, 400);
}

function keyPressed (){
    if (key === "s"){
      saveCanvas();
    }
}
  
function draw() {
  background(240);

  for (let y = 0; y < 3; y++) {
    let yrectHeight = ((y + 1) * height) / 4; //generate 3 rows of rectangles

    // Horizontal row of shapes
    for (let i = 0; i < width; i += 50) {
      // Alternate colors using % (modulo)
      if (mouseIsPressed) {
        //alternate red too
        if (i % 100 == 0) {
          fill(255, 0, 0); //red
        } else {
          fill(255, 150, 80); //orange
        }
      } else if (i % 100 == 0) {
        //alternate blue and dark blue
        fill(10, 50, 100); // dark blue
      } else {
        fill(150, 150, 200); // light blue
      }

      let rectHeight;
      if (mouseIsPressed) {
        if (i % 100 == 0) {
          rectHeight = 80;
        } else {
          rectHeight = 60;
        }
      } else if (i % 100 == 0) {
        rectHeight = 60;
      } else {
        rectHeight = 80;
      }
      noStroke();
      rect(i + 25, yrectHeight, 40, rectHeight);
    }
  }
}
// TODO: change ellipse to rect, triangle, or something else
// TODO: try varying size instead of color

// TODO: add one interaction (mouse or key) to change the rule
// Example: if (mouseIsPressed) { fill(255, 0, 0); }
