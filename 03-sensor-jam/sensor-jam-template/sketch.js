let port; // Serial Communication port
let connectBtn;

let sensorVal;
let circleSize = 20;
let targetSize = 20; // used for Option 2
let gridColumn = 5;  // how many circles vertically (rows)
let gridRow = 6;     // how many circles horizontally (cols)
let margin = 60;

function setup() {
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port

  // Connection helpers
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background("#a934b6ff");

  const gridH = height - margin * 2;
  const stepY = gridColumn > 1 ? gridH / (gridColumn - 1) : 0;

  const gridW = width - margin * 2;                 // <-- width, not height
  const stepX = gridRow > 1 ? gridW / (gridRow - 1) : 0;

  fill(255, 230);
  noStroke();
  for (let r = 0; r < gridColumn; r++) {
    for (let c = 0; c < gridRow; c++) {             // <-- add 'for'
      const y = margin + r * stepY;
      const x = margin + c * stepX;
      ellipse(x, y, circleSize);                    // <-- use x, y
    }
  }

  // Receive data from Arduino
  if (port.opened()) {
    sensorVal = port.readUntil("\n");
    if (sensorVal && sensorVal[0]) {
      console.log(sensorVal);
      targetSize = float(sensorVal);
      circleSize = lerp(circleSize, targetSize, 0.1);
    }
  }
}

// DO NOT REMOVE THIS FUNCTION
function connectBtnClick(e) {
  // If port is not already open, open on click,
  // otherwise close the port
  if (!port.opened()) {
    port.open(9600); // opens port with Baud Rate of 9600
    e.target.innerHTML = "Disconnect Arduino";
    e.target.classList.add("connected");
  } else {
    port.close();
    e.target.innerHTML = "Connect to Arduino";
    e.target.classList.remove("connected");
  }
}
