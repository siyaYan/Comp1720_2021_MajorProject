let object={
  x:0,
  y:0,
}
let speed={
  x:10,
  y:10,
}
let i=0
function preload() {
  // load any assets (images, sounds, etc.) here
}

function setup() {
  // add your setup code here
  createCanvas(windowWidth,windowHeight)
  object.x=windowWidth/2
  object.y=windowHeight/2
}

function draw() {
  // add your draw code here
  background(0)
  i=random(4)
  bounce()
  fill(250)
  ellipse(mouseX, mouseY, 100, 100)
  cube()
}
function bounce(){
  if(object.x>=windowWidth||object.x<=0){
    speed.x*=-1
  }
  object.x+=speed.x
  if(object.y>=windowHeight||object.y<=0){
    speed.y*=-1    
  }
    object.y+=speed.y
  
}
function cube(){
  if(i<=1){
    fill(200)
  }
  else if(i<=2){
    fill(150)
  }
  else if(i<=3){
    fill(50)
  }
  ellipse(object.x, object.y, 100, 100)
}

// when you hit the spacebar, what's currently on the canvas will be saved (as
// a "thumbnail.png" file) to your downloads folder. this is a good starting
// point for the final thumbnail of your project (this allows us to make a
// showcase of everyone's work like we did for the nametag assignment).
//
// remember that you need to resize the file to 1280x720, and you will probably
// want to delete this bit for your final submission.
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}
