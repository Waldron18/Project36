//Create variables here
var dog, happyDog, database;
var foodObj;
var foodS, foodStock;
var fedTime, lastFed, feed, addFood;
var changingGameState, readingGameState;
var dogImg, happyDogImg,sadDogImg, deadDogImg, bedroomImg, gardenImg, washroomImg; 


function preload()
{
	//load images here
  dogImg= loadImage("images/Dog.png");
  happyDogImg= loadImage("images/Happy.png");
  sadDogImg = loadImage("images/Lazy.png");
  deadDogImg = loadImage("images/deadDog.png");
  bedroomImg = loadImage("images/BedRoom.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/WashRoom.png");
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();

  readingGameState = database.ref('gameState');
  readingGameState.on("value",function(data){
    gameState = data.val();
  })

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  foodStock.set(20);

  dog = createSprite(780,200,10,50);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodObj = new Food ();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
   
  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : "+ lastFed%12 + " PM",350,30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed + " AM",350,30)
  }

  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime == (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime > (lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDogImg);
  }

  drawSprites();
  }

function readStock(data){
  foodS=data.val();
 // foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(gameState){
  database.ref('/').update({
    gameState: gameState
  })
}