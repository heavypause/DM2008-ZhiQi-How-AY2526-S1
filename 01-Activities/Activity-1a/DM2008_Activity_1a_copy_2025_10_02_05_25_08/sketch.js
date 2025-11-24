// DDM2008
// Activity 1a

// Run the sketch, then click on the preview to enable keyboard
// Use the 'Option' ('Alt' on Windows) key to view or hide the grid
// Use the 'Shift' key to change overlays between black & white
// Write the code for your creature in the space provided

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(240);
  fill(0);
  rect(175, 150, 25);
  rect(125, 125, 50, 25);
  rect(100, 150, 25, 50);
  rect(125, 200, 25);
  rect(150, 225, 25);
  rect(175, 250, 25);
  rect(200, 225, 25);
  rect(225, 200, 25);
  rect(250, 150, 25, 50);
  rect(200, 125, 50, 25);

 
  noStroke(0)
  fill(255, 20, 75);
  rect(125, 150, 50);
  rect(150, 175, 75, 50);
  rect(200, 150, 50);
  rect(175, 225, 25);
  
  fill(0);
  rect(210, 175, 15);
  rect(150, 175, 15);
  rect(165, 200, 45, 15);


  
  helperGrid(); // do not edit or remove this line
}
