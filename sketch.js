var PLAY = 1;
var END = 0;
var gameState = PLAY;

var earth, earth_running, earth_collided;
var ground, invisibleGround, groundImage;
var gameOverImage;
var obstaclesGroup, obstacle3, obstacle4, corona;
var score;

function preload(){

  earth_running = loadAnimation("earth1.png","earth2.png","earth3.png");
  earth_collided = loadAnimation("earth.collided.png");
  
  groundImage = loadImage("ground1.png")

  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  corona = loadImage("obstacle5.png");
  
   gameOverImage = loadImage("gameOver-1.png")
}

function setup() {
  createCanvas(600, 200);
  
  earth = createSprite(50,160,20,50);
  earth.addAnimation("running", earth_running);
  earth.addAnimation("collided", earth_collided);
  

  earth.scale = 0.3;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2.0;
  ground.velocityX = -4;
  
  ground.depth = earth.depth;
  earth.depth = earth.depth + 1;
    
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImage);
  
  obstaclesGroup = createGroup();
  
  earth.setCollider("circle",0,0,90);
  earth.debug = false;
  
  gameOver.scale = 0.5;
  
  score = 0;
}

function draw() {
 background(0);
     
  if(gameState === PLAY){
    gameOver.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    
    score = score + Math.round(getFrameRate()/60);
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& earth.y >= 100) {
        earth.velocityY = -12;
    }
    
    
    earth.velocityY = earth.velocityY + 0.7
  

    spawnObstacles();
    
    if(obstaclesGroup.isTouching(earth)){
        gameState = END;
      
    }
  }
   else if (gameState === END) { 
      gameOver.visible = true;
     earth.changeAnimation("collided",earth_collided);
    
      ground.velocityX = 0;
      earth.velocityY = 0
      
    obstaclesGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
      
     if(mousePressedOver(gameOver)) {
        reset();
    }
   }
  

  earth.collide(invisibleGround);
  

  drawSprites();
  
    
  stroke("white");
  textSize(20);
  fill("white");
  text("Score: "+ score,480,40);
}

function reset(){
  gameState = PLAY;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
  earth.changeAnimation("running",earth_running);
  score = 0;
  
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -6 ;
   
    //generate random obstacles            
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle3);
              break;
      case 2: obstacle.addImage(obstacle4);
              obstacle.scale = 0.5
              break;
      case 3: obstacle.addImage(corona);
              obstacle.scale = 2.0
              break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.35;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
