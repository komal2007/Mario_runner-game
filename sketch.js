var PLAY = 1;
var END = 0;
var gameState = PLAY;
var wall, wallImg;
var mario, mario_running, mario_up, mario_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var score=0;
var mario_stop;
var gameOver, restart;
var ob1,ob2,ob1Img,ob2Img,ob2_Img;
var floor, floorImg, pipeGroup;
var enemiesGroup;
var pointImg,point;
var out;
var wonImg,won;



function preload(){
  mario_running =   loadAnimation("images/walk1.png","images/walk2.png","images/walk3.png");
  mario_up = loadImage("images/marioUp.png");
  mario_stop = loadImage("images/walk3.png");
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/day.jpg");
  
  cloudImage = loadImage("images/cloud.png");
  
  pipeImg = loadImage("images/pipe.png");
  obstacle2 = loadImage("images/flowerPipe.png");
  obstacle3 = loadImage("images/mushroom.png");
  
  gameOverImg = loadImage("images/gameOverText.png");
  restartImg = loadImage("images/restart.png");

  wallImg = loadImage("images/wall.png");

  ob1Img = loadImage("images/mushroom.png");
  ob2Img_plant = loadAnimation("images/plant1.png","images/plant2.png","images/plant3.png","images/plant4.png","images/plant5.png","images/plant6.png");
 
  pointImg = loadImage("images/score.png");

  out = loadSound("lose.wav");

  wonImg = loadImage("images/win.png");




}

function setup() {
  createCanvas(displayWidth - 180, displayHeight-50);

  
  ground = createSprite(20,200,displayWidth,displayHeight);
  ground.addImage("ground",backgroundImage);
  ground.velocityX = -(6 + 3*score/100);

  mario = createSprite(50,500,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("up", mario_up);
  mario.addAnimation("stop", mario_stop);
  mario.scale = 2;
  mario.setCollider("circle",0,0,25);
  
  gameOver = createSprite(displayWidth/2-30,displayHeight/2-40);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2-10,displayHeight/2+50);
  restart.addImage(restartImg);

  won = createSprite(displayWidth/2,displayHeight/2);
  won.addImage(wonImg);
  won.scale=0.3;

  point = createSprite(displayWidth/2+250,displayHeight/2-300);
  point.addImage(pointImg);
  point.scale=0.4;
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  won.visible = false;
  
  invisibleGround = createSprite(0,510,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  pipeGroup = new Group();
  enemiesGroup = new Group(); 
  
  
  
}

function draw() {

  background("grey");

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if(keyDown("space") && mario.y >= 159) {
      mario.velocityY = -8;
      // mario.changeAnimation(mario_up)
      
      mario.changeAnimation("up", mario_up);
    }
    else{
      mario.changeAnimation("running", mario_running);
    }
    mario.velocityY = mario.velocityY + 0.8
   // 
    if (ground.x < 250){
      ground.x = ground.width/2-200;
    }
    

    if(score>1000){
      gameState=won;
    }

    if(gameState===won){
      won.visible = true;
      ground.velocityX = 0;
    mario.velocityY = 0;
    
    
    enemiesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    mario.changeAnimation("stop", mario_stop);
    
    //set lifetime of the game objects so that they are never destroyed
    enemiesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
    }
  
    if(pipeGroup.isTouching(mario)){
      mario.changeAnimation("stop", mario_stop);
      ground.velocityX=0;
    }

  
    if(enemiesGroup.isTouching(mario)){
        gameState = END;
        out.play();
    }

    mario.collide(invisibleGround);
    spawnPipe();
    spawnClouds();
    spawnWall();
    spawnObstacles();
    //plants()

    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    mario.velocityY = 0;
    enemiesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    mario.changeAnimation("stop", mario_stop);
    
    //set lifetime of the game objects so that they are never destroyed
    enemiesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
 
  drawSprites();

   //textAlign(RIGHT, TOP);
   textSize(30)
   stroke("black")
   strokeWeight(5)
   text( score, point.x+80,point.y+10);
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 160 === 0) {
    var cloud = createSprite(displayWidth+10,120,40,10);
    cloud.y = Math.round(random(60,120));
    cloud.addImage(cloudImage);
    cloud.scale = 2;
    cloud.velocityX = -3;
    cloud.lifetime = 500;
    cloudsGroup.add(cloud);
  }
}

function spawnPipe() {
  if(frameCount % 150 === 0) {
    var pipe = createSprite(displayWidth+10,500,20,50);
    pipe.velocityX = -(6 + 3*score/100);
    pipe.addImage(pipeImg);
    pipe.depth=mario.depth;
    //assign scale and lifetime to the obstacle           
    pipe.scale = Math.round(random(1.5,3));
    pipe.lifetime = 300;
    //add each obstacle to the group
    pipeGroup.add(pipe);
  }
}
function spawnWall(){
  if(frameCount % 300 === 0) {
    var wall = createSprite(displayWidth+10,500,Math.round(random(30,150)),40);
    wall.y = Math.round(random(100,400));
    //wall.debug = true;
    wall.velocityX = -(6 + 3*score/100);
    wall.addImage(wallImg);
     //assign scale and lifetime to the obstacle           
    wall.scale = 0.5;
    wall.lifetime = 300;
    //mario.depth=wall.depth+1;
}
}

function spawnObstacles(){
  if(frameCount % 200 === 0) {
    var ob = createSprite(displayWidth+10,500,Math.round(random(100,400)),10);
    ob.y = Math.round(random(200,500));
    //wall.debug = true;
    ob.velocityX = -(6 + 3*score/100);
    var rand = Math.round(random(1,2));
    switch(rand){
      case 1: ob.addImage(ob1Img);
      break;
      case 2: ob.addAnimation("plant",ob2Img_plant);
      ob.scale=3;
      break;
      default:break;
    }
    ob.lifetime = 300;
    enemiesGroup.add(ob);
}
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  enemiesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
}
/*function plants(){
  if(frameCount % 150 === 0) {
   ob2_Img= createImg("images/bros_plant.gif")
  ob2_Img.position(200,200);
  // ob2_Img.show();
   ob2_Img.size(60,80)
  ob2_Img.lifetime = 100;
  
   
  }
  
  
}*/




