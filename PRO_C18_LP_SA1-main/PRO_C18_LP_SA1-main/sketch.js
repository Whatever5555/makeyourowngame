var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;
var gameSound;
var jumpSound;
var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("Warrior.png","Warrior.png","Warrior.png");
  trex_collided = loadAnimation("WarriorDead.png");
  
  groundImage = loadImage("forest.png");
  gameSound = loadSound('audio.mp3');
  jumpSound = loadSound('jumpsound.mp3');
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Tree.png");
  obstacle2 = loadImage("Soldier.png");
  obstacle3 = loadImage("Tree.png");
  obstacle4 = loadImage("Soldier.png");
  obstacle5 = loadImage("Tree.png");
  obstacle6 = loadImage("Soldier.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(2000, 900);
  
  trex = createSprite(50,500,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.25;
  
  ground = createSprite(0,0,2000,900);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale = 8
  
  gameOver = createSprite(800,400);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(800,640);
  restart.addImage(restartImg);
  
  gameOver.scale = 2;
  restart.scale = 2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,500,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  
  
  
  
  
  if (gameState===PLAY){
    //if (score = 1000){
     // text("Congratulations, You have passed 1000 Score!", 600, 40);
    //}
    score = score + Math.round(getFrameRate()/60);
    gameSound.play();
    
    ground.velocityX = -(6 + 3*score/100);
  
    if (score > 1000){
      text("Congratulations, You have passed 1000 Score!", 600, 200);
    }
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -19;
      jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);

    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  textSize(30);
  text("Score: "+ score, 1500,200);}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 0;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1800,478,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.25;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}