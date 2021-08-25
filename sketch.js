var PLAY = 1;
var END = 0;
var gameState = PLAY;

var camel, camel_running, camel_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
//var message;

function preload(){
  camel_running = loadAnimation("camel1.png","camel2.png");
  camel_collided = loadAnimation("camel_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  camel = createSprite(50,height/2,20,50);
  camel.addAnimation("running", camel_running);
  camel.addAnimation("collided" ,camel_collided);
  camel.scale = 0.5;
  
  ground = createSprite(200,height-70,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.depth = camel.depth
  ground.depth = camel.depth
  
  gameOver = createSprite(350,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(350,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
 // console.log("Hello" + 5);
  
  camel.setCollider("circle",0,0,50);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {

  
  background(270);
  //console.log(message)
  //message = "from draw"

  //displaying score
  text("Score: "+ score, 500,50);
  
  //console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(6 + 2*score/100);
    //scoring
    score = score + Math.round(frameRate()/60.25);

  
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((keyDown("space") || touches.length>0)&& camel.y >= height-120) {
     camel.velocityY = -17;
     touches = []
    }
    
    //add gravity
    camel.velocityY = camel.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(camel)){
     gameState = END;
    }
  }
   else if (gameState === END) {
     //console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      camel.velocityY = 0
     
      //change the trex animation
      camel.changeAnimation("collided", camel_collided);
      camel.y = ground.y
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }

   
  
 
  //stop trex from falling down
  camel.collide(invisibleGround);
  if (mousePressedOver(restart)){
    console.log("restart game")
    reset()
  }
  
  
  
  drawSprites();
}

function reset(){
 gameState = PLAY
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 camel.changeAnimation("running", camel_running)
 score = 0
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-120,10,40);
   obstacle.velocityX = -(8 + score/100)
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstacle.depth = camel.depth
    camel.depth = camel.depth+1
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = camel.depth;
    camel.depth = camel.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

