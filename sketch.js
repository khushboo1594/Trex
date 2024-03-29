const PLAY = 1;
const END = 0;
var gameState;
var trex, trex_running, trex_collided, trex_standing;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver, restart;
localStorage["saved"] = 0;
var jumpSound, collidedSound, checkpointSound;

function preload() {
  trex_running = loadAnimation("images/trex1.png", "images/trex3.png", "images/trex4.png");
  trex_collided = loadAnimation("images/trex_collided.png");
  trex_standing = loadImage("images/trex1.png");

  groundImage = loadImage("images/ground2.png");

  cloudImage = loadImage("images/cloud.png");

  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");

  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");

  jumpSound = loadSound("sounds/jump.mp3");
  collidedSound = loadSound("sounds/die.mp3")
  checkpointSound = loadSound("sounds/checkpoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addImage("standing", trex_standing);

  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(255);

  textSize(15);
  textStyle(BOLD)
  text("Score: " + score, 500, 50);
  text("Highest Score: " + localStorage["saved"], 350, 50);

  trex.collide(invisibleGround);

  trex.changeAnimation("standing", trex_standing);

  if (keyDown("space")) {
    gameState = PLAY;
    jumpSound.play()
  }

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    if (score % 100 === 0) {
      checkpointSound.play();
    }
    ground.velocityX = -(6 + 3 * score / 100);
    //change the trex animation
    trex.changeAnimation("running", trex_running);

    if (keyDown("space") && trex.y >= 159) {
      jumpSound.play()
      trex.velocityY = -15;
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play()
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
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  localStorage["saved"] = score;
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
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
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

