let timer = 30
let round = 0;
let oldMouseX = 0
let oldMouseY = 0
let curMouseX = 0
let curMouseY = 0
let backgroundColour = 230
function setup() {
  let canvas = createCanvas(screen.height*.8, screen.height*.8); // Set canvas size
  canvas.parent("canvas-container"); // Attach to div in HTML
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

  function canvasTo64(){
    let base64canvas = canvas.toDataURL()
    console.log(base64canvas)
    return base64canvas
  }

  function countdownTimer(sec){
    if(sec == 0){

    }
    else{
      setTimeout(countdownTimer, sec * 1000)
    }
  }



