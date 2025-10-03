// DM2008 – Activity 4a
// Bake a Cookie (30 min)

let cookie;

function setup() {
  createCanvas(400, 400);
  noStroke();
  cookie = new Cookie("redvelvet", 80, width / 2, height / 2);
  // Step 3: make one cookie object
  // cookie = new Cookie("chocolate", 80, width/2, height/2);
}

function draw() {
  background(300);
  cookie.show();
  // Step 4: call the cookie’s show() method
  // cookie.show();
}

// Step 1: define the Cookie class
class Cookie {
  constructor(flavor, sz, x, y) {
    // set up required properties
    this.flavor = flavor;
    this.sz = sz;
    this.x = x;
    this.y = y;
  }

  // Step 2: display the cookie
  show() {
    fill(209, 46, 97);
    ellipse(this.x, this.y, this.sz + 8);
    if (this.flavor == "redvelvet") {
      fill(43, 140, 48);
    } else if (this.flavor === "matcha") {
      fill(235, 47, 106);
    }
    ellipse(this.x, this.y, this.sz);

    fill(156, 6, 31);
    ellipse(this.x - 20, this.y - 10, this.sz - 100);
    ellipse(this.x + 10, this.y + 18, this.sz - 50);
    ellipse(this.x + 20, this.y - 10, this.sz - 70);
    ellipse(this.x - 25, this.y + 10, this.sz - 70);
    ellipse(this.x + 5, this.y - 20, this.sz - 65);
  }
}

// Steps 5 & 6: Implement additional methods here
function keyPressed() {
  if (keyCode === UP_ARROW) {
    cookie.y = cookie.y - 10;
  } else if (keyCode === DOWN_ARROW) cookie.y = cookie.y + 10;
  if (keyCode === LEFT_ARROW) {
    cookie.x = cookie.x - 10;
  } else if (keyCode === RIGHT_ARROW) {
    cookie.x = cookie.x + 10;
  }
}

function mousePressed(){
  if(cookie.flavor === "redvelvet"){
    cookie.flavor = "matcha";
  }
  else {
    cookie.flavor = "redvelvet";
  }
}

// Step 5: add movement (keyboard arrows)
// function keyPressed() {}

// Step 6: add flavor randomizer (mouse click)
// function mousePressed() {}
