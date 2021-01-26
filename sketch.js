var dog,dogIma, happyDog, database;
var foodS, foodStock;
var feed,addFood,fedTime,lastFed,foodObj;

var changingGameState,readingGameState;
var bedroom,garden,washroom,lazy;
var bedroomI,washI,gardenI,lazyI;
var gameState;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroomI = loadImage("images/Bed Room.png");
  washI = loadImage("images/Wash Room.png");
  gardenI = loadImage("images/Garden.png");
  lazyI = loadImage("images/lazy.png");
}

function setup() {
  database = firebase.database();

  readState=database.ref('gameState');
  readState.on('value',function(data){
    gameState=data.val();
  } );

  createCanvas(500,500);

  foodObj= new Food();

  dog=createSprite(250,250,20,20);
  dog.addImage(dogImg);
  dog.scale=0.3;

  feed= createButton("feed the dog");
  feed.position(450,450);
  feed.mousePressed(feedDog);

  addFood= createButton("add food");
  addFood.position(450,400);
  addFood.mousePressed(addFoods);


  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
}


function draw() { 
  background(46,139,87);
   
  fedTime= database.ref("FeedTime");
  fedTime.on("value",function(data){
  lastFed = data.val();
  })

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    
    }else{
      feed.show();
    addFood.show();
    
    }

  fill(225);
  textSize(20);

  if(lastFed>=12 ){
    text("lastFed:"+lastFed%12+"PM",350,30);
  }else if(lastFed==0 ){
    text("lastFed: 12 PM",350,30);
  }else{
    text("lastFed:"+lastFed+"PM",350,30);
  }
   currentTime=hour();
   if(currentTime==(lastFed+1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+1) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

  foodObj.display();
  drawSprites();
  
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  console.log(data.val());
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}


