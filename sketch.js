let timer = 30
let round = 0
let oldMouseX = 0
let oldMouseY = 0
let curMouseX = 0
let curMouseY = 0
let backgroundColour = 255
function setup() {
    createCanvas(screen.width, screen.height);
    background(backgroundColour);
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
  function resetCanvas(){
    background(backgroundColour);
  }
  function eraser(){
    fill(backgroundColour)
  }
  function brush(){
    fill("white")
  }

  function done(){
    saveCanvas("image" + round + ".png")
    round++
  }

  function countdownTimer(sec){
    if(sec == 0){

    }
    else{
      setTimeout(countdownTimer, sec * 1000)
    }
  }