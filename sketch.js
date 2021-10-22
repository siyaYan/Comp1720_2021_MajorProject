// let object={
//   x:0,
//   y:0,
// }
// let speed={
//   x:10,
//   y:10,
// }
// let i=0


function preload() {
  // load any assets (images, sounds, etc.) here
}

// Todo: customise the window
// function responsiveButton() {
//   if(width > 400) { // large screen breakpoint
//     rect(width*0.1, width*0.1, width*0.3,width*0.1);
//     textSize(width*0.05);
//     text("CLICK ME", width*0.13,width*0.17);
//   } else { // mobile screen breakpoint
//     rect(width*0.1, width*0.1, width*0.8,width*0.1);
//     textSize(width*0.05);
//     text("CLICK ME", width*0.36 ,width*0.17);
//   }
// }

//for space & time
var views=[30,80,0]
var sec=0

// for obit & sun
var shapeChoose=2;
var wave=0
var initObitRadius=100;
var circleSpace=50;
var circleNum=10;
var obitNum=[]

// for planets
var planetRadius=20
var planetNum=10;
var planets=[]
var planetColor=[]

//for movement
var speedInit=10
var acc=10

// for satellite
var sateRadius=50
var sateLine=65
var satePos=[]
var sateColor=[]
var sateNum=2

function setup() {
  // add your setup code here
  createCanvas(windowWidth,windowHeight,WEBGL)
  angleMode(DEGREES)
  ellipseMode(RADIUS);
  frameRate(20)
  // object.x=windowWidth/2
  // object.y=windowHeight/2
  for(let i=0;i<sateNum;i++){
    let s=createVector((random(windowWidth/2-sateLine*2-20,initObitRadius+sateLine+2))*random([-1,1]), 
    random(initObitRadius+sateLine+2, initObitRadius*1.8)*random([1,-0.5]), 
    (random(windowHeight/2-sateLine*2-20,initObitRadius+sateLine+2))*random([-1,1]))
    satePos.push(s)
    let c1=createVector(random(100,230), random(100,230), random(100,230))
    let c2=createVector(random(30,100), random(30,100), random(30,100))
    sateColor.push(c1)
    sateColor.push(c2)
  }
  print(sateColor)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// let detailY;
// // slide to see how detailY works
// function setup() {
//   createCanvas(100, 100, WEBGL);
//   detailY = createSlider(3, 16, 3);
//   detailY.position(10, height + 5);
//   detailY.style('width', '80px');
// }


function draw() {
  // add your draw code here
  sec=int(millis()/1000)//1sec
  drawBackground()
  viewMove()
  drawSun()
  updatePlanet()
  //sun is red
  if(sec>=30){
    drawSate(0)
  }
  if(sec>=33){
    drawSate(1)
  }
}

// main scence
function drawBackground(){
  background(20)
    //background little stars
    fill(255);
    noStroke();
    frameRate(60);
    for(let i=0;i<3;i++){
    ellipse(random(-windowWidth/2, -windowWidth/4), random(-windowHeight/2, windowHeight/2), random(2,4), random(2,4));
    ellipse(random(-windowWidth/4, 0), random(-initObitRadius,-windowHeight/2), random(2,5), random(2,5));
    ellipse(random(0, windowWidth/4), random(initObitRadius,windowHeight/2), random(2,4), random(2,4));
    ellipse(random(windowWidth/4, windowWidth/2), random(-windowHeight/2,windowHeight/2), random(1,4), random(1,4));
    }
}
function viewMove(){
  let moveX=map(mouseX,0,windowWidth,-windowWidth/2,windowWidth/2)
  let moveY=map(mouseY,0,windowHeight,-windowHeight/2,windowHeight/2)
  // print(moveX,moveY)
  rotateX(75+moveY/20)
  rotateY(-15+moveX/30)
  translate(-views[0], -views[1],-views[2])
  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  directionalLight(250, 250, 250, -dirX, -dirY, -1);
}
function updatePlanet(){
   //random planet color and pos and order every 10 sec
  if(sec%10==0){
    for(let i=0;i<planetNum;i++){
      obitNum[i]=(int(map(random(0,planetNum),0,planetNum,1,circleNum+1)))
      var r=map(random(0, planetNum),0,planetNum,random(30,220),random(30,220))
      var b=map(random(0, planetNum),0,planetNum,50,random(30,225))
      var g=map(random(0, planetNum),0,planetNum,random(50,225),50)
      planetColor[i]=(createVector(r, g, b))
    }
  }else{
    if(sec%10<=2){    
      speedInit+=acc
      num=1
      drawPlanet(num,speedInit)
      num=2
      drawPlanet(num,speedInit+random(20,acc/2))
    }
  else if(sec%10<=5){
      num=3
      speedInit+=acc
      drawPlanet(num,speedInit)
      num=7
      drawPlanet(num,speedInit)
      num=8
      drawPlanet(num,speedInit+random(20,acc/2))
    }
    else if(sec%10<=8){
      num=4
      speedInit+=acc
      drawPlanet(num,speedInit+random(20,acc/2))
      num=5
      drawPlanet(num,speedInit)
      num=6
      drawPlanet(num,speedInit+random(20,acc/2))
      
    }
    else{
      num=9
      speedInit+=acc
      drawPlanet(num,speedInit+random(20,acc/2))
      num=0
      drawPlanet(num,speedInit)
    }
  }
  print(sec)
  
}
function drawPlanet(num,speed) {
  push()
  fill(planetColor[num].x,planetColor[num].y,planetColor[num].z)
  noStroke()
  var radius=obitNum[num]*circleSpace+initObitRadius
  translate(radius*cos(speed),radius*sin(speed),sin(frameCount+radius/3-speed+wave)*50)
  sphere(planetRadius);
  pop()
}
function drawSun(){
  push()
  frameRate(10)
  stroke(200)
  strokeWeight(1.5)
  noFill()
  // draw obit&sun
  for(let j=1;j<=circleNum;j++){

    //random obit colors
    var r=map(sin(frameCount),-1,1,0,255)
    var g=map(cos(frameCount),-1,1,150,0)
    var b=map(j,0,circleNum,255,0)
    // var a=map(j,circleNum,0,200,0)
    stroke(r,g,b)

    //draw one obit
    var radius=circleSpace*j+initObitRadius
    beginShape()
    for(let i=0;i<360;i+=shapeChoose){
      vertex(radius*cos(i), radius*sin(i),sin(frameCount+radius/3-i+wave)*50)
    }
    endShape(CLOSE)

    push()
    // strength light
    directionalLight(250, 250, 250, 0, 0, -10);
    //draw sun
    var r1=min(255,map(sin(frameCount),-1,1,225,250)+sec)
    var g1=max(30,map(cos(frameCount),-1,1,180,150)-sec*5)
    var b1=max(0,map(j,1,circleNum,90,50)-sec*3)
    // after 30 sec the sun mature(red)
    //turn yellow to red
    fill(r1,g1,b1)
    noStroke()
    sphere(initObitRadius)
    pop()
    
  }
  pop()
}
function drawSate(i){
// Sate
push()
noStroke()
translate(satePos[i].x, satePos[i].y, satePos[i].z)
rotateX(90+map(sin(speedInit/5),-1,1,-30,30));
rotateZ(map(sin(speedInit/5),-1,1,-30,30));

fill(sateColor[i].x,sateColor[i].y,sateColor[i].z)
sphere(sateRadius);
fill(sateColor[1+i].x,sateColor[1+i].y,sateColor[i+1].z)
cylinder(sateLine, 10);
pop()
}


//interactive part with mouse(drag/click/doubleClick) and press up&down key
function mouseDragged() {
  let moveX=map(mouseX,0,windowWidth,-windowWidth/2,windowWidth/2)
  let moveZ=map(mouseY,0,windowHeight,-windowHeight/2,windowHeight/2)
  views[0]=30-moveX
  views[2]=moveZ
  // if(sec>30&&(dist(mouseX,mouseY,windowWidth/2,windowHeight/2)==sateLine[0]+)||dist()<=sateLine[1]){

  // }
  return false;
}
function keyPressed() {
  if (keyCode === UP_ARROW) {
    views[1]-=windowHeight/2/10
  } else if (keyCode === DOWN_ARROW) {
    views[1]+=windowHeight/2/10
  }
}
function mouseClicked() {
  if(dist(mouseX,mouseY,windowWidth/2,windowHeight/2)<=initObitRadius){
    print('click sun!')
    if(acc<50){
      acc+=8
    }
  }
  print('acc: '+acc)
}
function doubleClicked() {
  if(dist(mouseX,mouseY,windowWidth/2,windowHeight/2)<=initObitRadius){
    print('reset acc!')
      acc=10
  }
  print('reset acc: '+acc)
}




//Todo: 

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
function pointer(){
  push()
  fill(250)
  ellipse(mouseX, mouseY, 100, 100)
  pop()
}
function processer(){
  push()
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
  pop()
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
