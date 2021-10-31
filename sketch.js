//add click funciton shootstar
//add sound interaction(sun wave1,cloud height2 tree height3)

//for main scene

//for scene 1

//cloud floating with mouse

//for scene 2

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
var views;
var sec=0
var during//whole time 20sec(explodT)+3*50sec(each scene)+30sec(dead)
var route=50 //each secen time
var dead=30 //end of the scene
// var next=0 //do not use
let zoom=0;
let zoomPos;

// for obit & sun
var shapeChoose=2;
var wave=0//波动幅度
var initObitRadius=50;
var circleSpace=50;
var circleNum=1;//max 10
var sunColor;
var obitNum=[]
var sunPos;//2d

//for explosion
var explodT=20;
var explodR;

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
var satellitePos2d=[] //2d

//for particles
var particles=[]
var particleNum=150

// for scene1
var wholeSize; //width/2,height/2
var planeH;
var planeW;
// var space;
var cloudH;
var cloudW;
var clouds=[]
var snow=false;
var snowParticles=[]
var move=1
var rRange;
var bRange;
var gRange;
//for shape1
var recHeight=[];
var recSize=[];
var recOff=[]
var recMove=[];
var landscapePos;
var shape=0;

//for scene2
// var points=[]
// var mult=0.005
// var sence2Color;
// var density =30
var treeType=1
var treeColor;
var click=0;
var Treelen;
var leavesPos=[];

class Particle{
  constructor(pos,c,type){
    this.pos=createVector(pos.x, pos.y, pos.z)
    this.c=c
    this.vel=type==0?p5.Vector.random3D().normalize().mult(random(4, 6)):p5.Vector.random2D().normalize().mult(random(1, 3));
    this.size=random(4,8)
  }
  update(type,movex){
    if(type==1){
      // this.vel=p5.Vector.abs(random2D());
      this.vel.z-=20
      this.vel.x+=movex/10
      this.vel.y+=movex/10
      // print(this.vel)
    }
    this.pos.add(this.vel)
     //delete particles are away from the explosion center
     if(type==0){
      if(dist(this.pos.x,this.pos.y,this.pos.z,0,0,0)>explodR*3){
        let index = particles.indexOf(this);
        particles.splice(index,1)
      }
     }
     // delete snowflake if out of range
     if(type==1){
      if(this.pos.z<=-cloudH||abs(this.pos.x)>=wholeSize.x||abs(this.pos.y)>=wholeSize.y){
        let index = snowParticles.indexOf(this);
        snowParticles.splice(index,1)
      }
     } 
  }
  display(){
    push()
    noStroke()
    fill(this.c)
    translate(this.pos.x, this.pos.y, this.pos.z)
    sphere(this.size)
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
  display(){
    push()

    noStroke()
    fill(this.c)

    translate(this.pos.x, this.pos.y, this.pos.z)
    sphere(this.size)
    pop()
  }
}
class Cloud{
  constructor(pos,c){
    this.pos=pos
    this.c=c
    this.size=random(40,60)
  }
  update(){
    this.pos.x+=random(-4,4)
    this.pos.y+=random(-4,4)
    if(abs(this.pos.x)>=wholeSize.x){
      his.pos.x=this.pos.x>0?this.pos.x-4:this.pos.x+4
    }
    if(abs(this.pos.y)>=wholeSize.y){
      this.pos.y=this.pos.y>0?this.pos.y-4:this.pos.y+4
    }

  }
  display(){
    push()
    noStroke()
    fill(this.c)

    translate(this.pos.x, this.pos.y, this.pos.z)
    sphere(this.size)
    translate(50, 40, 5)
    sphere(this.size)
    translate(-50, -40, -5)
    translate(-50, 40, -5)
    sphere(this.size)
    translate(50, -40, 5)
    translate(0, 50, 10)
    sphere(this.size)
    pop()
  }
}

function setup() {
  // add your setup code here
  createCanvas(windowWidth,windowHeight,WEBGL);
  addScreenPositionFunction();
  background(30)
  angleMode(DEGREES);
  rectMode(CENTER)
  ellipseMode(RADIUS);
  noiseDetail(1)
  frameRate(60);
  // mouseWheel(changeWithWheel) 
  
  during=3*route+explodT+30

  //for main scene
  explodR=height/4
  zoom=height-100
  views=createVector(0, 0, 0)
  sunColor=createVector(50, 15, 0)

  //for planets
  for(let i=0;i<planetNum;i++){
    // obitNum[i]=int(map(int(random(0,planetNum)),0,planetNum,circleNum,0))
    obitNum[i]=int(random(1,circleNum+1))
    var r=map(random(0, planetNum),0,planetNum,random(30,220),random(30,220))
    var b=map(random(0, planetNum),0,planetNum,50,random(30,225))
    var g=map(random(0, planetNum),0,planetNum,random(50,225),50)
    let c=color(r,g,b)
    planetColor[i]=c
    let p=new Planet(i,random(10,360),planetColor[i])
    planets.push(p)
  }

  // for satellites
  for(let i=0;i<satelliteNum;i++){
    let s=createVector((random(width/2-satelliteLine*2-20,initObitRadius+satelliteLine+2))*random([-1,1]), 
    random(initObitRadius+satelliteLine+2, initObitRadius*1.8)*random([1,-0.5]), 
    (random(height/2-satelliteLine*2-20,initObitRadius+satelliteLine+2))*random([-1,1]))
    satellitePos.push(s)
    let c1=createVector(random(100,230), random(100,230), random(100,230))
    let c2=createVector(random(30,100), random(30,100), random(30,100))
    satelliteColor.push(c1)
    satelliteColor.push(c2)
  }
  print(satelliteColor)
  
  //for scene1
  cloudH=height/2//voice
  cloudW=height/2//voice
  wholeSize=createVector(width/2,height/2)
  landscapePos=createVector(0, 0, 0)
  let len=sqrt((height*height+width*width))
  planeH=width*height/len
  planeW=width*width/len

  rRange=createVector(random(80, 200),0)
  gRange=createVector(random(100,150), 0)
  bRange=createVector(random(0,30),0)
  //shape0123
  recHeight=[cloudH/4,cloudH/3,cloudH/2,cloudH/3*2];//1-100,2-200 3-250
  recSize=[10,10,10,20]//1-10 2-20 3-30
  recOff=[0.1,0.1,0.1,1] //1-0.1 2-0.5 3-1
  recMove=[50,100,150,400] //1-100 2-200 3-400
  shape=0

  // for scene2
  Treelen=height/4
  treeColor=createVector(80, 120, 40)
}
//todo
function reset(){
  views=createVector(0, 0, 0)
  // for scene2&3
  if(sec==route+explodT||sec==route*2+explodT){
    views.z=height-100//modify
  }
    //for planets
  if(sec==0){
    treeType=1
      shape=0
      planetNum=10
      circleNum=1
      let newPlanets=[]
      for(let i=0;i<planetNum;i++){
        // obitNum[i]=int(map(int(random(0,planetNum)),0,planetNum,circleNum,0))
        obitNum[i]=int(random(1,circleNum+1))
        var r=map(random(0, planetNum),0,planetNum,random(30,220),random(30,220))
        var b=map(random(0, planetNum),0,planetNum,50,random(30,225))
        var g=map(random(0, planetNum),0,planetNum,random(50,225),50)
        let c=color(r,g,b)
        planetColor[i]=c
        let p=new Planet(i,random(10,360),planetColor[i])
        newPlanets.push(p)
      }
      planets=newPlanets
  }  
}

// main scene background
function drawBackground(){
  push()
  background(0,0,30)
    //background little stars
    fill(255);
    noStroke();
    for(let i=0;i<3;i++){
    ellipse(random(-width/2, -width/4), random(-height/2, height/2), random(2,4), random(2,4));
    ellipse(random(-width/4, 0), random(-initObitRadius,-height/2), random(2,5), random(2,5));
    ellipse(random(0, width/4), random(initObitRadius,height/2), random(2,4), random(2,4));
    ellipse(random(width/4, width/2), random(-height/2,height/2), random(1,4), random(1,4));
    }
  pop()
}

function drawSnow() {
  push()
  frameRate(10)
    for(let i=0;i<3;i++){
      let pos=createVector(random(-wholeSize.x,wholeSize.x), random(-wholeSize.y,wholeSize.y), 0)
      snowParticles.push(new Particle(pos,[230],1))
    }
    for (let particle of snowParticles) {
      particle.update(1,map(mouseX,0,width,-wholeSize.x/2,wholeSize.x/2)); // update snowposition
      particle.display(); // draw snow
    }
  pop()
}

function drawCloud(){
  push()
  // print(snow+'snow')
  let c=snow==true?color(100,100,100):color(220,220,220)
  // print(c)
  for(let i=0;i<4;i++){
    clouds.push(new Cloud(createVector(random(-1,1)*i*50+80,i*50*random(-1,1)+80,0),c))
    clouds[i].update()
    clouds[i].display()
  }
  pop()
}

function draw() {
  background(30)
  sec=int(millis()/1000)%during// 1 sec in 200sec
  //reset the view to zero point
  if(sec==0||sec==during-30||sec==route+explodT||sec==route*2+explodT){
    reset()
  }
  viewMove()
  orbitControl();
  directionalLight([255],0,0,-1)
  // print(sec)
  //explosion & zoom sun
  if(sec<explodT+2){
    if(sec<explodT){
      drawParticles()
    }else{
      zoomSun()
    }  
  }
  else{
    if(sec>=route+explodT&&sec<route*2+explodT){
      print('in s1')
      scene1()
    }
    else if(sec>=route*2+explodT&&sec<route*3+explodT){
      //tree glowing
      print('in s2')
      scene2()  
    }
    //in main scene or dead scene
    else if((sec<route+explodT||sec>=during-30)){
      mainScene()
    }
  }
}

function drawParticles(){
  push()
  frameRate(90)
  background(0,0,30)
  rotateX(sin(frameCount/6)*360)
  rotateY(cos(frameCount/6)*360)
  rotateZ(map(mouseX,0,width,-180,180))
  translate(0, 0, sin(frameCount)*100)
  if(random(1)>0.97){
    let pos=createVector(random(-explodR,explodR), random(-explodR,explodR), random(-explodR,explodR))
    for(let i=0;i<particleNum;i++){
      let r=map(sin(frameCount),-1,1,150,255)+random(-50,50)
      let g=map(sin(frameCount/2),1,-1,0,100)+random(-50,50)
      let b=map(cos(frameCount),-1,1,0,100)+random(-50,50)
      let c=color(r,g,b)
      let p=new Particle(pos,c,0)
      particles.push(p)
    }
  }
    for(let j=0;j<particles.length;j++){
        particles[j].display() 
        particles[j].update(0) 
    }
  pop()
}

function zoomSun(){
  push()
  background(0,0,30)
  zoom=zoom-20>0?zoom-20:0
  translate(0, 0, zoom)
  initObitRadius=50
  circleNum=0
  drawSunOrbit()
  pop()
}

function drawPlanets(){
  //random planet color and pos and order every 10 sec
 //update every 10 secs
 if(sec%10==0){
// for planets
    let newPlanets=[];
   for(let i=0;i<planetNum;i++){
    obitNum[i]=int(random(1,circleNum+1))
    var r=map(random(0, planetNum),0,planetNum,random(30,220),random(30,220))
    var b=map(random(0, planetNum),0,planetNum,50,random(30,225))
    var g=map(random(0, planetNum),0,planetNum,random(50,225),50)
    let c=color(r,g,b)
    planetColor[i]=c
    let p=new Planet(i,random(10,360),planetColor[i])
    newPlanets.push(p)
  }
  planets=newPlanets;
  print(planets)
 } 

 //in very first scene slowly produce planets
 if(sec<=20+explodT){
   if(sec<10+explodT){  
     if(sec%10<3){
     }
     else if(sec%10<5){
      num=0
      planets[num].update(0)
      planets[num].display()
     }
     else if(sec%10<7){
      num=1
      planets[num].update(2)
      planets[num].display()
      num=2
      planets[num].update(-5)
      planets[num].display()
     }else if(sec%10<9){
      num=3
      planets[num].update(2)
      planets[num].display()
      num=4
      planets[num].update(0)
      planets[num].display()
    }else{
      num=5
      planets[num].update(0)
      planets[num].display()
      num=6
      planets[num].update(5)
      planets[num].display()
    }
    }else{
     if(sec%10<3){
      num=1
      planets[num].update(0)
      planets[num].display()
      num=2
      planets[num].update(0)
      planets[num].display()
     } 
    else if(sec%10<6){
      num=3
      planets[num].update(3)
      planets[num].display()
      num=4
      planets[num].update(0)
      planets[num].display()
     }else if(sec%10<8){
      num=5
      planets[num].update(5)
      planets[num].display()
      num=6
      planets[num].update(2)
      planets[num].display()
     }else{
      num=7
      planets[num].update(8)
      planets[num].display()
      num=8
      planets[num].update(5)
      planets[num].display()
    } 
    
   }
 }
 else{
    //in first scene normal produce planets
    if(sec<route+explodT){
       if(sec%10<=5){  
         if(sec%10<3){
           num=0
           planets[num].update(0)
          planets[num].display()
           num=1
           planets[num].update(5)
          planets[num].display() 
         }else{
           num=2
           planets[num].update(0)
           planets[num].display()  
           num=3
           planets[num].update(10)
          planets[num].display() 
           num=4
           planets[num].update(15)
          planets[num].display() 
         }
       } else{
         if(sec%10<=7){
           num=5
           planets[num].update(5)
          planets[num].display() 
           num=6
           planets[num].update(6)
          planets[num].display() 
         }else{
           num=7
           planets[num].update(7)
           planets[num].display() 
           num=8
           planets[num].update(5)
          planets[num].display() 
           num=9
           planets[num].update(8)
          planets[num].display() 
         }
       }
    }
    //planet & sun dead 30sec
    if(sec>during-30){
      if(sec-during+30<=15){  
        if(sec-during+30<=8){
         num=0
         planets[num].update(-5)
         planets[num].display() 
        }else{
         num=1
         planets[num].update(3)
        planets[num].display() 
         num=2
         planets[num].update(5)
        planets[num].display() 
        }
      }else{
        print('planets dead!')
      }
    }
     
 }
 print(sec)
}

function mainScene(){
  //  main scene last 5 sec(zoom in)
  if((sec>=explodT+route-3&&sec<route+explodT)){
    views.z=views.z+20
  }
  push()
  drawBackground()
  universeMove()
  updateSun()
  drawSunOrbit()
  drawPlanets()
  //sun is glowing up not red
  if(sec>30+explodT){
    //sun not dead last 5sec
    if(during-sec>10){
      drawsatellite(0,0)
    }
    if(sec>=35+explodT){
      //sun not dead last 3sec
      if(during-sec>5){
        drawsatellite(1,0)
      }
    }
  }
  pop()

}

function drawLandscape(){
  push()
  frameRate(60)
  noStroke()
  fill(150,400)
  plane(planeW,planeH);
  if(sec-explodT-route<=30){
    // print(sec)
    shape=shape<3?shape=int((sec-explodT-route)/10):3
    // print(shape)
    if(shape>=0&&shape<3){
      recMove[shape]=map(sec%10,0,10,recMove[shape],recMove[shape+1])
      recHeight[shape]=map(sec%10,0,10,recHeight[shape],recHeight[shape+1])
    }
  }
  let speed = frameCount/recMove[shape]
  let xOff=0
  //now is 0,0,0 after transformation
  landscapePos=screenPosition(0,0,0)
  for(let x=-wholeSize.x/2; x<=wholeSize.x/2; x+=recSize[shape] ){
    let yOff=0
    for(let y=-wholeSize.y/2;y<wholeSize.y/2; y+=recSize[shape]){
      let h =map(noise(xOff+speed,yOff+speed),0,1,-recHeight[shape],recHeight[shape])

      let r=shape==3?rRange.x:map(x,-width/2,width/2,rRange.x,rRange.y)
      let g=shape==3?gRange.x:map(y,-height/2,height/2,gRange.x,gRange.y)
      let b=shape==3?bRange.x:map(h,-recHeight,recHeight,bRange.x,bRange.y)
      if(random(1)>0.9&&shape==3){
        r=rRange.x+random(-20,20)
        g=gRange.x+random(-20,20)
        b=bRange.x+random(-20,20)
      }
      push()
      fill(r,g,b)
      translate(x,y,-h/2)
      box(recSize[shape],recSize[shape],h)
      pop()
      yOff += recOff[shape]
    }
    xOff += recOff[shape]
  }
  pop()
}
// scene1
function scene1(){
  //landscape changing
  if(sec>=explodT+route*2-3){
    views.z+=50
  }
  if(sec<=route+explodT+3){
    views.z=views.z-50>0?views.z-50:0
  }
  push()
  background(0,0,30)
  frameRate(90)
  //for whole scene
  translate(0, height/5, 0)
  drawsatellite(0,1)
  rotateX(90)
  rotateZ(map(mouseX,0,width,15,-15))
  rotateX(-15)
  drawLandscape()
  //for cloud
  translate(0, 0,cloudH)
  if(snow){
    drawSnow()
  }
  drawCloud()
  translate(-wholeSize.x/3, -wholeSize.y/2,0)
  drawCloud()
  // if()
  pop()
}
// scene2
function scene2(){
  if(sec>=explodT+route*3-3){
    views.z+=50
  }
  if(sec<=route*2+explodT+3){
    views.z=views.z-50>0?views.z-50:0
  }
  push()
  // background(0,0,30)
  drawBackground()
  drawsatellite(1,1)
  drawTree()
  pop() 
}

function drawTree(){
  push()
  frameRate(60)
  // print(sec)
  if(sec-explodT-route*2<30){
    let type=int((sec-explodT-route*2)/10)
    // print(type)
    randomSeed(type+1)
    treeColor=type==0?createVector(80, 120, 40):(type==1?createVector(180, 120, 40):((type==2?createVector(220, 120, 170):treeColor=createVector(220, 220, 220))))
  }
  else{
    randomSeed(1)
    let direct=mouseX>=width/2?1:-1
    rotateY(frameCount*5*direct)
  }
  translate(0, height/2-Treelen/10, 0)
  
  branch(Treelen)
  pop()
}

function branch(len){
  push()
  strokeWeight(map(len,Treelen/10,Treelen,1,15))
  stroke(70,40,20)
  line(0,0,0,0,-len-2,0)
  translate(0, -len, 0)
  if(len>Treelen/10){
    for(let i=0;i<3;i++){
      rotateY(random(100,140))
      push()
      rotateZ(random(20,40))
      if(sec-explodT-route*2>30){
        branch(len*0.7)
      }else{
      // print(frameCount)
        let glow=sec-explodT-route*2>=30?1:sin(frameCount*3)
        branch(len*(0.5+0.15*glow))
      }
      pop()
    }
  }else{
    noStroke()
    // print(treeColor)
    fill(treeColor.x+random(-20,20),treeColor.y+random(-20,20),treeColor.z+random(-20,20),200)
    translate(5*Treelen/100, 0, 0)
    rotateZ(90)
    if(treeType==1){
      push()
      sphere(5)
      pop()
    }else{
      beginShape()
      for(let i=45;i<135;i++){
        let radius=8*Treelen/100;
        vertex(radius*cos(i), radius*sin(i))
      }
      for(let j=135;j>45;j--){
        let radius=8*Treelen/100;
        vertex(radius*cos(j), radius*sin(-j)+Treelen/10)
      }
      endShape(CLOSE)
    }
  }
  pop()
}

function updateSun(){
  push()
  //sun birth 30sec
  if(sec<30+explodT){
    sunColor.x=map(sin((sec-explodT)*3),0,1,50,250)
    sunColor.y=map(sin((sec-explodT)*3),0,1,15,150)
    sunColor.z=map(sin((sec-explodT)*3),0,1,0,30)
    if(sec<=3+explodT){
      initObitRadius=50+abs(sin(frameCount*5))*5
      circleNum=1
    }else if(sec<=6+explodT){
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
    sunColor.x=map(sin((sec-explodT-30)*9),0,1,250,255)
    sunColor.y=map(sin((sec-explodT-30)*9),0,1,150,30)
    sunColor.z=map(sin((sec-explodT-30)*9),0,1,30,10)
    initObitRadius=98+5*abs(sin(frameCount*5))
    }
    //sun dead 30sec
    if(sec>during-30){
      sunColor.x=map((sin((sec-during+30)*3)),0,1,255,10)
      sunColor.y=map((sin((sec-during+30)*3)),0,1,30,0)
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
  pop()
  
}

function drawSunOrbit(){
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

    //turn yellow to red
    fill(sunColor.x,sunColor.y,sunColor.z)
    noStroke()
    sunPos=screenPosition(0,0,0)
    sphere(initObitRadius)
    pop()
  }
  pop()
}

function drawsatellite(i,type){
// satellite
push()
//moving satellite
noStroke()
let radius=0;
if(type==0){
  radius=satelliteRadius
  translate(satellitePos[i].x+random(-10,10), satellitePos[i].y+random(-10,10), satellitePos[i].z)
  rotateX(90+map(sin(frameCount),-1,1,-30,30));
  rotateZ(map(cos(frameCount),-1,1,-30,30));
  fill(satelliteColor[1+i*2].x,satelliteColor[1+i*2].y,satelliteColor[i*2+1].z)
  cylinder(satelliteLine, 10);
}else{
  radius=width/2
}
satellitePos2d[i]=screenPosition(0,0,0)
fill(satelliteColor[i*2].x,satelliteColor[i*2].y,satelliteColor[i*2].z)
sphere(radius);
pop()
}

//zoom with wheel and light with mouse
function viewMove(){
  translate(views.x, views.y,views.z)
  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  directionalLight([250], -dirX, -dirY, -1);
}

function universeMove(){
  let moveX=map(mouseX,0,width,-width/2,width/2)
  let moveY=map(mouseY,0,height,-height/2,height/2)
  // print(moveX,moveY)
  rotateX(75+moveY/30)
  rotateY(-15+moveX/40)
}
//interactive part with mouse(drag/click/doubleClick) and press up&down key
//add function
function keyPressed() {
  if (keyCode === UP_ARROW) {
    views.z+=height/2/10

  } else if (keyCode === DOWN_ARROW) {
    views.z-=height/2/10
  }
}

function mouseClicked() {
  if(sec>=explodT+route*2){
    //tree color
    click++
    if(click>0&&click<=3){
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
  }
  else if(sec>explodTroute+route){
    //change scene1 movement and color
    if(landscapePos){
    // if(dist(mouseX-width/2,mouseY-height/2,landscapePos.x,landscapePos.y)<=min(wholeSize.x,wholeSize.y)){
    //   move=move==0?1:0
    //   print(move)
    if(abs(mouseX-width/2)<=wholeSize.x&&mouseY-height/2<0){
      if(snow){
        snow=false
      } else{
        snow=true
      } 
      // print('snow')
      }
      else{
        rRange=shape==3?createVector(random(100,150),0):createVector(random(80,120),0)
        gRange=shape==3?createVector(random(100,180),0):createVector(random(100,150),0)
        bRange=shape==3?createVector(random(0,50),0):createVector(random(0,30),0)
     }
  }
  }
  else if(sec>explodT){
    //sun exist
    if(sunPos){
    if(dist(mouseX-width/2,mouseY-height/2,sunPos.x,sunPos.y)<=initObitRadius){
      print('click sun!')
      if(acc<50){
        acc+=8
      }
      print('acc: '+acc)
    }
    }
    //sate exist
    if(satellitePos2d.length>0){
      if(dist(mouseX-width/2,mouseY-height/2,satellitePos2d[0].x,satellitePos2d[0].y)<=satelliteRadius){
      // next=1 //do not use
      print('doubleclick satellite! 1'+'+add color change')
      // todo change color
      let c1=createVector(random(100,230), random(100,230), random(100,230))
      let c2=createVector(random(30,100), random(30,100), random(30,100))
      satelliteColor[0]=c1
      satelliteColor[1]=c2
      }
      if(dist(mouseX-width/2,mouseY-height/2,satellitePos2d[1].x,satellitePos2d[1].y)<=satelliteRadius){
        // next=2 //do not use
        print('doubleclick satellite! 2'+'+add color change')
        //todo change color
        let c1=createVector(random(100,230), random(100,230), random(100,230))
        let c2=createVector(random(30,100), random(30,100), random(30,100))
        satelliteColor[2]=c1
        satelliteColor[3]=c2
      }
    }
  }
 
}

function doubleClicked() {
  //for tree
  if(sec>=explodT+route*2){
    treeType=treeType==0?1:0
  }
  //scene1 after 30sec
  if(sec>explodTroute+30){
    shape=shape==3?1:3
  }
  // print(shape)
  //sun exist
  if(sec>explodT&&sec<explodT+route){
    if(sunPos){
      if(dist(mouseX-width/2,mouseY-height/2,sunPos.x,sunPos.y)<=initObitRadius){
        print('reset acc!')
          acc=10
      }
    }
  }
  
}

// when you hit the spacebar, what's currently on the canvas will be saved (as
// a "thumbnail.png" file) to your downloads folder. this is a good starting
// point for the final thumbnail of your project (this allows us to make a
// displaycase of everyone's work like we did for the nametag assignment).
//
// remember that you need to resize the file to 1280x720, and you will probably
// want to delete this bit for your final submission.
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}






