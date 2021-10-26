//feedback
//add sound interaction

//for main scene
//mouse wheel zoom in(main)

//for scene 1
//mouse wheel speed up(1)
//mouse click left right change weather(1) 
//click on the cloud change cloud color/click on the landscape pause/click other change color
//cloud floating with mouse

//for scene 2
//tree glowing 10sec
//interaction last 40sec
//wind blew the tree with mouse move
//double click the tree with fruits/single click leaves falling
//click other space change forms
//wheel speed up glowing

//Todo:
//1/add zoom_in/floating/color_change/ for satellite
//2/modify the faulty scene pos with click
//3/change color for scene1 more reasonale

//todo list
//customise the windowsize
//constructor for objects
function preload() {
  // load any assets (images, sounds, etc.) here
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

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
var during=200//whole time 20sec(explodT)+3*50sec(each scene)+30sec(dead)
var route=50 //each secen time
var dead=30 //end of the scene
// var next=0 //do not use

// for obit & sun
var shapeChoose=2;
var wave=0//波动幅度
var initObitRadius=50;
var circleSpace=50;
var circleNum=1;//max 10
var sunColor;
var obitNum=[]
var sunPos;
var explodT=20;

// for planets
// var planetRadius=20
var planetNum=10;
var planets=[]
var planetColor=[]

//for movement
var speedInit=10
var acc=10

// for satellitellite
var satelliteRadius=50
var satelliteLine=65
var satellitePos=[]//3d
var satelliteColor=[]
var satelliteNum=2
var pos=[] //2d

//for particles
var particles=[]
var particleNum=200

// for scene1
var move=0
var wholeSize;
var rRange;
var bRange;
var gRange;
var recHeight=200;
var recSize=30;
var recOff=0.1
var recMove=200;
var landscapePos;
var shape=1;

//for scene2
var points=[]
var mult=0.005
var sence2Color;
var density =30
var treeColor;
var click=0;
var fruits=false;

function setup() {
  // add your setup code here
  createCanvas(windowWidth,windowHeight,WEBGL);
  addScreenPositionFunction();
  background(30)
  angleMode(DEGREES);
  rectMode(CENTER)
  ellipseMode(RADIUS);
  noiseDetail(1)
  frameRate(20);

  // for satellites
  for(let i=0;i<satelliteNum;i++){
    let s=createVector((random(windowWidth/2-satelliteLine*2-20,initObitRadius+satelliteLine+2))*random([-1,1]), 
    random(initObitRadius+satelliteLine+2, initObitRadius*1.8)*random([1,-0.5]), 
    (random(windowHeight/2-satelliteLine*2-20,initObitRadius+satelliteLine+2))*random([-1,1]))
    satellitePos.push(s)
    let c1=createVector(random(100,230), random(100,230), random(100,230))
    let c2=createVector(random(30,100), random(30,100), random(30,100))
    satelliteColor.push(c1)
    satelliteColor.push(c2)
  }
  print(satelliteColor)
  sunColor=createVector(0, 0, 0)

  //for scene1
  wholeSize=createVector(windowWidth/2,windowHeight/2)
  landscapePos=createVector(0, 0, 0)
  rRange=shape==1?createVector(100, 200):createVector(random(100,200),0)
  gRange=shape==1?createVector(200, 0):createVector(random(150,180),0)
  bRange=shape==1?createVector(0, 10):createVector(random(30,50),0)

  // for scene2
  // Treelen=windowHeight/4
  let space = width/density
  for(let i=0;i<width;i+=space){
    for(let j=0;j<height;j+=space){
      let p= createVector(i+random(-10,10), j+random(-10, 10))
      points.push(p)
    }
  }
  shuffle(points, true)
  mult=random(0.002,0.01)
  sence2Color=[random(255),random(255),random(255),random(255),random(255),random(255)]
  treeColor=createVector(80, 120, 40)
}
let Treelen=250

function drawTree(){
  randomSeed(1)
  background(0,0,30)
  frameRate(60)
  translate(0, windowHeight/2-Treelen/10, 0)
  if(sec>20){
    //add fruits
    fruits=true;
  }
  rotateY(map(mouseX,-windowWidth/2,windowWidth/2,-360,360))
  branch(Treelen)
}

function branch(len){
  strokeWeight(map(len,Treelen/10,Treelen,1,15))
  stroke(70,40,20)
  line(0,0,0,0,-len-2,0)
  translate(0, -len, 0)
  if(len>Treelen/10){
    for(let i=0;i<3;i++){
      rotateY(random(100,140))
      push()
      rotateZ(random(20,40))
      //test
      // print(frameCount)
      let glow=sec>=20?1:sin(frameCount)
      branch(len*(0.5+0.15*glow))
      // branch(len*0.7)
      pop()
    }
  }else{
    noStroke()
    fill(treeColor.x+random(-20,20),treeColor.y+random(-20,20),treeColor.z+random(-20,20),200)
    translate(5*Treelen/100, 0, 0)
    rotateZ(90)
    beginShape()
    for(let i=45;i<135;i++){
      let radius=10*Treelen/100;
      vertex(radius*cos(i), radius*sin(i))
    }
    for(let j=135;j>45;j--){
      let radius=10*Treelen/100;
      vertex(radius*cos(j), radius*sin(-j)+Treelen/10)
    }
    // push()
    // translate(10, 0, 0)
    // fill(0)
    // for(let k=5;k>0;k--){
    //   let radius=20*Treelen/100;
    //   vertex(radius*cos(k)**2, radius*sin(k)**2)
    // }
    // pop()
    endShape(CLOSE)
  }
}

function draw() {
  sec=int(millis()/1000)%during// 1 sec in 200sec
  drawTree()
  print(sec)
  // if(sec<=explodT){
  //   drawParticles()
  // }else{
  //   if(sec>route+explodT&&sec<=route*2+explodT){
  //     //landscape changing
  //     print('in s1')
  //     scene1()
  //   }
  //   //not yet 
  //   if(sec>route*2+explodT&&sec<route*3+explodT){
  //     //planet glowing
  //     print('in s2')
  //     scene2()
  //   }
  //   //in main scene or dead scene
  //   if((sec<=route+explodT||sec>during-30)){
  //     drawBackground()
  //     viewMove()
  //     updateSun()
  //     drawSun()
  //     drawPlanets()
  //     //sun is red && sun not dead
  //     if(sec>=30+explodT&&during-sec>5){
  //       drawsatellite(0)
  //       if(sec>=33+explodT){
  //         drawsatellite(1)
  //       }
  //     }
  //   }
  // }
}


class Particle{
  constructor(pos,c){
    this.pos=createVector(pos.x, pos.y, pos.z)
    this.c=c
    this.vel=p5.Vector.random3D().normalize().mult(random(4, 6))
    this.w=random(4,8)
  }
  update(){
    this.pos.add(this.vel)
  }
  show(){
    push()

    noStroke()
    fill(this.c)

    translate(this.pos.x, this.pos.y, this.pos.z)
    sphere(this.w)
    pop()
  }
}

class Planet{
  constructor(num,moveInit,c){
    this.radius=obitNum[num]*circleSpace+initObitRadius
    this.speed=moveInit
    this.pos=createVector(this.radius*cos(this.speed),this.radius*sin(this.speed),sin(frameCount+this.radius/3-this.speed+wave)*50)
    this.c=c
    this.size=random(15,30)
  }
  update(increase){
    this.radius=obitNum[num]*circleSpace+initObitRadius
    this.speed=acc+increase+this.speed
    this.pos=createVector(this.radius*cos(this.speed),this.radius*sin(this.speed),sin(frameCount+this.radius/3-this.speed+wave)*50)
  }
  show(){
    push()

    noStroke()
    fill(this.c)

    translate(this.pos.x, this.pos.y, this.pos.z)
    sphere(this.size)
    pop()
  }
}

function drawParticles(){
  push()
  directionalLight([255],0,0,-1)
  background(0,0,30)
  rotateX(sin(frameCount/6)*360)
  rotateY(cos(frameCount/6)*360)
  rotateZ(map(mouseX,0,windowWidth,-180,180))
  translate(0, 0, sin(frameCount)*100)
  if(random(1)>0.97){
    let pos=createVector(random(-100,100), random(-100,100), random(-100,100))
    for(let i=0;i<particleNum;i++){
      let r=map(sin(frameCount),-1,1,150,255)+random(-50,50)
      let g=map(sin(frameCount/2),1,-1,0,100)+random(-50,50)
      let b=map(cos(frameCount),-1,1,0,100)+random(-50,50)
      let c=color(r,g,b)
      let p=new Particle(pos,c)
      particles.push(p)
    }
  }
    for(let j=0;j<particles.length;j++){
      if(dist(particles[j].pos.x,particles[j].pos.y,particles[j].pos.z,0,0,0)<windowHeight/2){
        particles[j].show() 
        particles[j].update()      
      }
      else{
        particles.splice(j,1)
      }
    }
  pop()

}

function drawPlanets(){
  //random planet color and pos and order every 10 sec
 //planet birth
 if(sec%5==0){
// for planets
   for(let i=0;i<planetNum;i++){
    // obitNum[i]=int(map(int(random(0,planetNum)),0,planetNum,circleNum,0))
    obitNum[i]=int(random(1,circleNum+1))
    var r=map(random(0, planetNum),0,planetNum,random(30,220),random(30,220))
    var b=map(random(0, planetNum),0,planetNum,50,random(30,225))
    var g=map(random(0, planetNum),0,planetNum,random(50,225),50)
    let c=color(r,g,b)
    planetColor[i]=c
    let p=new Planet(i,random(10,360),planetColor[i])
    print(obitNum[i]+'in'+i)
    planets.push(p)
  }
 } 
 //in very first scene slowly produce planets
 if(sec<=20+explodT){
   if(sec<10+explodT){  
     if(sec%10>3){
      num=0
      planets[num].update(0)
      planets[num].show()
     }else if(sec%10>=5){
      num=1
      planets[num].update(2)
      planets[num].show()
     }else if(sec%10>=7){
      num=2
      planets[num].update(4)
      planets[num].show()
    } 
    }else{
    if(sec%10>=3){
      num=3
      planets[num].update(3)
      planets[num].show()
      num=4
      planets[num].update(0)
      planets[num].show()
     }else if(sec%10>=6){
      num=1
      planets[num].update(5)
      planets[num].show()
      num=5
      planets[num].update(2)
      planets[num].show()
     }else if(sec%10>=8){
      num=2
      planets[num].update(8)
      planets[num].show()
      num=6
      planets[num].update(5)
      planets[num].show()
    } 
    
   }
 }
 else{
    //in first scene normal produce planets
    if(sec<route+explodT){
       if(sec%10<=5){  
         if(sec%10>3){
           num=0
           planets[num].update(0)
          planets[num].show()
           num=1
           planets[num].update(5)
          planets[num].show() 
         }else{
           num=2
           planets[num].update(0)
           planets[num].show()  
           num=3
           planets[num].update(10)
          planets[num].show() 
           num=4
           planets[num].update(15)
          planets[num].show() 
         }
       } else{
         if(sec%10<=7){
           num=5
           planets[num].update(5)
          planets[num].show() 
           num=6
           planets[num].update(6)
          planets[num].show() 
         }else{
           num=7
           planets[num].update(7)
           planets[num].show() 
           num=8
           planets[num].update(5)
          planets[num].show() 
           num=9
           planets[num].update(8)
          planets[num].show() 
         }
       }
    }
    //planet & sun dead 30sec
    if(sec>during-30){
      if(sec-during+30<=15){  
        if(sec-during+30<=8){
         num=0
         planets[num].update(-5)
         planets[num].show() 
        }else{
         num=1
         planets[num].update(3)
        planets[num].show() 
         num=2
         planets[num].update(5)
        planets[num].show() 
        }
      }else{
        print('planets dead!')
      }
    }
     
 }
 print(sec)
}

// scene1
function scene1(){
  push()
  background(0,0,50)
  translate(0, windowHeight/6, -windowWidth)
  rotateX(70)
  rotateZ(frameCount/2*move)
  noStroke()

  directionalLight([255],createVector(0, 0, -1))
  directionalLight([255],createVector(0, 0, -1))

  let speed = frameCount/recMove
  let xOff=0
  //now is 0,0,0 after transformation
  landscapePos=screenPosition(0,0,0)
  for(let x=-wholeSize.x; x<=wholeSize.x; x+=recSize ){
    let yOff=0
    for(let y=-wholeSize.y;y<wholeSize.y;y+=recSize){
      let h =map(noise(xOff+speed,yOff+speed),0,1,-recHeight,recHeight)

      let r=shape==1?map(x,-width/2,width/2,rRange.x,rRange.y):rRange.x
      let g=shape==1?map(y,-height/2,height/2,gRange.x,gRange.y):gRange.x
      let b=shape==1?map(h,-recHeight,recHeight,bRange.x,bRange.y):bRange.x
     
      push()
      fill(r,g,b)
      translate(x,y,-h/2)
      box(recSize,recSize,h)
      pop()
      yOff += recOff
    }
    xOff += recOff
  }
  pop()
}
// scene2
function scene2(){
  if(sec%route<10){
    push()
    translate(-windowWidth/2, -windowHeight/2)
    noStroke()
    let view=frameCount*50<=points.length?frameCount*50:points.length
    // print(view)
    for(let i=0;i<view;i++){
      let r=map(points[i].x,0,width,scene2Color[0],scene2Color[1])
      let g=map(points[i].y,0,height,scene2Color[2],scene2Color[3])
      let b=map(points[i].x,0,width,scene2Color[4],scene2Color[5])
      var a=map(dist(points[i].x,points[i].y,mouseX,mouseY),0,windowHeight/2,400,100)
      fill(r,g,b,a)
      let angle=map(noise(points[i].x*mult, points[i].y*mult),0,1,0,720)
      points[i].add(createVector(cos(angle), sin(angle)))
      ellipse(points[i].x, points[i].y,1)
    }
    pop()
  }else{
    //planet glowing 20sec stop 20sec
    background(0,0,30)
  }
  
}

// main scene background
function drawBackground(){
  background(0,0,30)
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
//main scene view change
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
//todo sun shrink speed
function updateSun(){
  //sun birth 30sec
  if(sec<30+explodT){
    sunColor.x=map(sin(sec*3),0,1,50,250)
    sunColor.y=map(sin(sec*3),0,1,15,150)
    sunColor.z=map(sin(sec*3),0,1,0,30)
    // sunColor.z=abs(sin(frameCount/4))*90+5
    if(sec<=2+explodT){
      circleNum=0
      if(sec<=1+explodT){
        //mismatch speed
        initObitRadius=windowHeight/2-windowHeight/2*abs(sin(frameCount*2))
      }else{
        initObitRadius=50*abs(sin(frameCount*5))
      }
    }
    else if(sec<3+explodT){
      initObitRadius=50+abs(sin(frameCount*5))*5
      circleNum=1
    }else if(sec<6+explodT){
        initObitRadius=55+abs(sin(frameCount*5))*5
        circleNum=2
    }else if(sec<9+explodT){
      initObitRadius=60+abs(sin(frameCount*5))*5
      circleNum=3
    }
    else if(sec<12+explodT){
      initObitRadius=65+abs(sin(frameCount*5))*5
      circleNum=4
    }
    else if(sec<15+explodT){
      initObitRadius=70+abs(sin(frameCount*5))*5
      circleNum=5
    }
    else if(sec<18+explodT){
      initObitRadius=75+abs(sin(frameCount*5))*5
      circleNum=6
    }
    else if(sec<21+explodT){
      initObitRadius=80+abs(sin(frameCount*5))*5
      circleNum=7
    }
    else if(sec<24+explodT){
      initObitRadius=85+abs(sin(frameCount*5))*5
      circleNum=8
    }
    else if(sec<27+explodT){
      initObitRadius=90+abs(sin(frameCount*5))*5
      circleNum=9
    }else{
      initObitRadius=95+abs(sin(frameCount*5))*5
      circleNum=10
    }
  }else{
    //sun mature 10sec
    if(sec<40+explodT){
      //sun mature color
    sunColor.x=min(255,map(sin(frameCount),-1,1,225,250)+(sec-30)*2)
    sunColor.y=max(30,map(cos(frameCount),-1,1,180,150)-(sec-30)*10)
    sunColor.z=max(10,map(cos(frameCount),1,-1,90,50)-(sec-30)*6)
    initObitRadius=98+5*abs(sin(frameCount*5))
    }
    //sun dead 30sec
    if(sec>during-30){
      sunColor.x=map((sin((sec-during+30)*3)),0,1,250,30)
      sunColor.y=map((sin((sec-during+30)*3)),0,1,50,10)
      sunColor.z=map((sin((sec-during+30)*3)),0,1,10,0)
      if(abs(during-(sec)-30)<3){
        initObitRadius=95-abs(cos(frameCount*5))*5
        circleNum=9
      }else if(abs(during-(sec)-30)<6){
        initObitRadius=90-abs(cos(frameCount*5))*5
        circleNum=8
      }else if(abs(during-(sec)-30)<9){
        initObitRadius=85-abs(cos(frameCount*5))*5
        circleNum=7
      }
      else if(abs(during-(sec)-30)<12){
        initObitRadius=80-abs(cos(frameCount*5))*5
        circleNum=6
      }
      else if(abs(during-(sec)-30)<15){
        initObitRadius=75-abs(cos(frameCount*5))*5
        circleNum=5
        planetNum=0
      }
      else if(abs(during-(sec)-30)<18){
        initObitRadius=70-abs(cos(frameCount*5))*5
        circleNum=4
      }
      else if(abs(during-(sec)-30)<21){
        initObitRadius=65-abs(cos(frameCount*5))*5
        circleNum=3
      }
      else if(abs(during-(sec)-30)<24){
        initObitRadius=60-abs(cos(frameCount*5))*5
        circleNum=2
      }
      else if(abs(during-(sec)-30)<27){
        initObitRadius=55-abs(cos(frameCount*5))*5
        circleNum=1
      }else{
        initObitRadius=50*abs(cos(frameCount*5))
        circleNum=0
      }
      
    }
  }
  
}

function drawSun(){
  push()
  frameRate(10)
  stroke(200)
  noFill()
  // draw obit&sun
  if(circleNum==0){
    fill(sunColor.x,sunColor.y,sunColor.z)
    noStroke()
    sphere(initObitRadius)
  }
  for(let j=1;j<=circleNum;j++){
    //random obit colors
    var r=map(sin(frameCount),-1,1,0,255)
    var g=map(cos(frameCount),-1,1,150,0)
    var b=map(j,0,circleNum,255,0)
    stroke(r,g,b)
    strokeWeight(random(1,2))

    //draw one obit
    var radius=circleSpace*j+initObitRadius
    beginShape()
    for(let i=0;i<360;i+=shapeChoose){
      vertex(radius*cos(i), radius*sin(i),sin(frameCount+radius/3-i+wave)*50)
    }
    endShape(CLOSE)

    push()
    // strength light
    directionalLight(250, 250, 250, 0, 0, -1);

    //turn yellow to red
    fill(sunColor.x,sunColor.y,sunColor.z)
    noStroke()
    sunPos=screenPosition(0,0,0)
    sphere(initObitRadius)
    pop()
    
  }
  pop()
}

function drawsatellite(i){
// satellite
push()
noStroke()
translate(satellitePos[i].x, satellitePos[i].y, satellitePos[i].z)
rotateX(90+map(sin(speedInit/5),-1,1,-30,30));
rotateZ(map(sin(speedInit/5),-1,1,-30,30));

pos[i]=screenPosition(0,0,0)
print(pos[i])
fill(satelliteColor[i].x,satelliteColor[i].y,satelliteColor[i].z)
sphere(satelliteRadius);
fill(satelliteColor[1+i].x,satelliteColor[1+i].y,satelliteColor[i+1].z)
cylinder(satelliteLine, 10);
// torus(satelliteLine, 10)
pop()
}

//interactive part with mouse(drag/click/doubleClick) and press up&down key

function mouseDragged() {
  let moveX=map(mouseX,0,windowWidth,-windowWidth/2,windowWidth/2)
  let moveZ=map(mouseY,0,windowHeight,-windowHeight/2,windowHeight/2)
  views[0]=30-moveX
  views[2]=moveZ
}

//add function
function keyPressed() {
  if (keyCode === UP_ARROW) {
    views[1]-=windowHeight/2/10

  } else if (keyCode === DOWN_ARROW) {
    views[1]+=windowHeight/2/10
  }
}

function mouseClicked() {
  //tree color
  if(click<3){
    click++
    // print(click)
    if(click==1){
      treeColor=createVector(180, 120, 40)
    }
    if(click==2){
      treeColor=createVector(220, 220, 220)
    }
    if(click==3){
      treeColor=createVector(220, 120, 170)
    }
  }else{
    click=0
    treeColor=createVector(80, 120, 40)
  }
  //change scene1 movement and color
  if(landscapePos){
    if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,landscapePos.x,landscapePos.y)<=min(wholeSize.x,wholeSize.y)){
      move=move==0?1:0
      print(move)
    }else{
        rRange=shape==1?createVector(random(100,150),random(200,250)):createVector(random(100,200),0)
        gRange=shape==1?createVector(random(100,150), 0):createVector(random(100,180),0)
        bRange=shape==1?createVector(0, random(30)):createVector(random(0,50),0)
    }
  }
  //todo change color by mouse click other spaces or key up/down
 
  //sun exist
  if(sunPos){
    if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,sunPos.x,sunPos.y)<=initObitRadius){
      print('click sun!')
      if(acc<50){
        acc+=8
      }
      print('acc: '+acc)
    }
  }
  // satellite show up
  if(pos.length>0){
    if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,pos[0].x,pos[0].y)<=satelliteRadius){
    print('click satellite! 1'+'+add zoom in')
    //todo zoom in
  }
  if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,pos[1].x,pos[1].y)<=satelliteRadius){
    print('click satellite! 2'+'+add zoom in')
    //todo zoom in
  }
}
   
  // print(mouseX-windowWidth/2,mouseY-windowHeight/2)
}

//test satellite to scene1
function doubleClicked() {
  //scenc2 
  recHeight=recHeight==200?400:200;
  recSize=recSize==30?50:30;
  recOff=recOff==0.1?1:0.1
  recMove=recMove==200?400:200;
  shape=shape==1?2:1

  //sun exist
  if(sunPos){
    if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,sunPos.x,sunPos.y)<=initObitRadius){
      print('reset acc!')
        acc=10
    }
  }
  //sate exist
  if(pos.length>0){
    if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,pos[0].x,pos[0].y)<=satelliteRadius){
    // next=1 //do not use
    print('doubleclick satellite! 1'+'+add color change')
    // todo change color
    // scene2()
    }
    if(dist(mouseX-windowWidth/2,mouseY-windowHeight/2,pos[1].x,pos[1].y)<=satelliteRadius){
      // next=2 //do not use
      print('doubleclick satellite! 2'+'+add color change')
      //todo change color
      // scene1()
    }
  print('reset acc: '+acc)
  }
}



//Todo: past methods

// function bounce(){
//   if(object.x>=windowWidth||object.x<=0){
//     speed.x*=-1
//   }
//   object.x+=speed.x
//   if(object.y>=windowHeight||object.y<=0){
//     speed.y*=-1    
//   }
//     object.y+=speed.y
  
// }
// function pointer(){
//   push()
//   fill(250)
//   ellipse(mouseX, mouseY, 100, 100)
//   pop()
// }
// function processer(){
//   push()
//   if(i<=1){
//     fill(200)
//   }
//   else if(i<=2){
//     fill(150)
//   }
//   else if(i<=3){
//     fill(50)
//   }
//   ellipse(object.x, object.y, 100, 100)
//   pop()
// }


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
