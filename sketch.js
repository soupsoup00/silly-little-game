let oldMouseX = 0
let oldMouseY = 0
let curMouseX = 0
let curMouseY = 0

function setup() {
    createCanvas(400, 400);
    background(220);
    strokeWeight(20)
    fill("black")
  }
  function draw() {
    oldMouseX = curMouseX
    oldMouseY = curMouseY
    curMouseX = mouseX
    curMouseY = mouseY
    if(mouseIsPressed === true){
        line(oldMouseX, oldMouseY, curMouseX, curMouseY)
    }
  }