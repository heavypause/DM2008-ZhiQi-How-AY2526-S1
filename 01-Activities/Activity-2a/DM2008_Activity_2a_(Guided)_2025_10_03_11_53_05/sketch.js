// DM2008 — Activity 2a
// (Mode Switch, 20 min)

let x = 0; // ellipse x-position
let size = 50; // ellipse size (you can change this in your if/else)
let bgColor; // background color set by switch(key)

function setup() {
  createCanvas(400, 400);
  bgColor = color(220);
}

function draw() {
  background(bgColor);
  // Wrap around when it exits the right edge
  if (x > width + size / 2) {
    x = 0;
  }

  //Change speed using mouse position (THEN comment out x += 2; above)
  if (mouseX > width / 2) {
    x += 4; // faster on right
  } else {
    x += 2; // slower on left
  }

  fill("#E65555");
  noStroke(); // i wanted to make 10 ellipse but don't want to write it 10 times
  for (let i = 0; i < 10; i++) {
    let heightEllipse = ((i + 1) * height) / 11;
    ellipse(x, heightEllipse, 30);
  }

  // Stretch (optional, if you finish early):
  // - Draw a rect instead of an ellipse when mouseIsPressed.
}

// --- Mode switching with number keys: 1, 2, 3 ---
function keyPressed() {
  switch (key) {
    case "1":
      bgColor = color(200, 100, 100); // red
      break;
    case "2":
      bgColor = color(150, 200, 100); // greem
      break;
    case "3":
      bgColor = color(100, 100, 200); // blue
      break;
    default:
      bgColor = color(220); // grey
    case "s":
      saveCanvas();
  }
}
