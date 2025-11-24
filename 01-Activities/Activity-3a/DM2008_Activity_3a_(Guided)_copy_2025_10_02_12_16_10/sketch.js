// DM2008 — Activity 3a
// (Array Sampler, 25 min)

// 1. Create an array of colors (or other values)
//    You can make more than one array if you'd like
let palette = ["#F049E8", "#57D7C9", "#3c78d8", "#F8CB4E", "#FA8B8B"];

// 2. A variable to track the current index
let currentIndex = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(220);

  // 3. Use the array value at currentIndex

  const spacing = width / (palette.length + 1);
  // Draw one circle for each palette color
  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]); // use the i-th color
    const x = (i + 1) * spacing; // position from the loop index
    ellipse(x, height / 2, 60);
  }
}

// 4. Change the index when a mouse is pressed
function mousePressed() {
  for (let i = 0; i < palette.length; i++) {
    palette[i] = color(random(255), random(255), random(255));
  }
}

function keyPressed() {
  if (key == "a" || key == "A") {
    palette.push(color(random(255), random(255), random(255)));
  }
  if (key == "r" || key == "R") {
    if (palette.length > 0) {
      palette.splice(palette.length - 1, 1);
    }a
  }
}

/* 
TODOs for students:
1. Replace colors with your own data (positions, text, sizes, etc).
2. Try mousePressed() instead of keyPressed().
3. Use push() to add new items, or splice() to remove them, then check how the sketch adapts.
4. Try looping through an array to visualize all the items within it instead of accessing one item at a time.
*/
