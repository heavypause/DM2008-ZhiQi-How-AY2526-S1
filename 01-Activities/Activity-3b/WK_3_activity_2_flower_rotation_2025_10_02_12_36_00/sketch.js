let angle = 0;

function setup() {
  createCanvas(400, 400);
 
}

function draw() {
  background(220);
  myFlower(width/2, height/2, 100, 100, angle);
  myFlower(width/2, height/2, 100, 100, angle + 30);
  myFlower(width/2, height/2, 100, 100, angle + 60);
  
  angle += 2;
  
  
}

function myFlower(x, y, w, h, r) {
  push();
  translate(x, y);
  rotate(radians(r))
  stroke("#F3A81B");
  fill("#E2FF6C");
  ellipse(0, -h, w / 2, h * 1.5);
  ellipse(0, h, w / 2, h * 1.5);
  ellipse(-w, 0, w * 1.5, h / 2);
  ellipse(w, 0, w * 1.5, h / 2);
  fill("#905616");
  ellipse(0, 0, w, h);
  fill("#5A360E");
  ellipse(0, 0, w/2, h/2);
  
  pop();

}
