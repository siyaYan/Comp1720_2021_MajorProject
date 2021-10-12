function preload() {
  // load any assets (images, sounds, etc.) here
}

function setup() {
  // add your setup code here
  createCanvas(windowWidth,windowHeight)
}

function draw() {
  // add your draw code here
  background(0)
  fill(250)
  ellipse(mouseX, mouseY, 100, 100)
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
