//Confirmation that the server is up and running correctly//
console.log("'Speed Online!' is up and running");
//MongoDb Database Linking//
var mongojs = require("mongojs");
var speedOnlineDb = mongojs('localhost:27017/SPEED_ONLINE',['accounts', 'skillLvls']);
//Express//
var expressCom = require('express');
var speedOnline = expressCom();
var hostServer = require('http').Server(speedOnline);
var numPlayers = 0;
var Deck;
var mainDeck = [];
speedOnline.get('/',function(req,res)
{
  res.sendFile(__dirname + '/client/index.html');
})

speedOnline.use('/client', expressCom.static(__dirname + '/client'));

hostServer.listen(2000);
//////////////////////////////////////////////////////////////////////
//Socket.io//
var SOCKET_LIST = {};

//The basis from which a "Player" starts.
var Gamer = function(){
  var self = {
    x: 250,
    y: 250,
    spdX: 0,
    spdY: 0,
    id:"",
  }
  self.update = function(){
    self.UpdatePosition();
  }
  self.UpdatePosition = function() {
    self.x += self.spdX;
    self.y += self.spdY;
  }
  return self;
}

//Player Function takes a "Gamer" and inherits its arrtibutes as well
//as adding a few more of its own.
var Player = function(id){
  var self = Gamer();
    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingSpace = false;
    self.pressingEnter = false;
    self.pressingOne = false;
    self.pressingTwo = false;
    self.maxSpd = 10;

//Updates the speed of the player as well as a calling the regular update
//function.
  var superUpdate = self.update;
  self.update = function(){
    self.UpdateSpeed();
    superUpdate();
  }

//This function continuously checks if any of the games inputs are being used
//if they are then it has an outcome.
  self.UpdateSpeed = function(){
    if (self.pressingOne)
      self.spdX = self.maxSpd;
    else if (self.pressingTwo)
      self.spdX = -self.maxSpd;
    else
      self.spdX = 0;

    if (self.pressingSpace)
      self.spdY = -self.maxSpd;
    else if (self.pressingEnter)
      self.spdY = self.maxSpd;
    else
      self.spdY = 0;
  }
  Player.list[id] = self;
  return self;
}

//Acts as a listener, when the client uses a keypress it sends a data package
//to the server (this) and changes values within "UpdateSpeed" depending on
//the keypress.
Player.list = {};
Player.onConnect = function(socket){
  var connectedPlayer = Player(socket.id);

  socket.on('keyPress', function(data){
    if(data.inputId === 'deckPile1')
      connectedPlayer.pressingOne = data.state;
    else if (data.inputId === 'deckPile2')
      connectedPlayer.pressingTwo = data.state;
    else if (data.inputId === 'drawCard')
      connectedPlayer.pressingSpace = data.state;
    else if (data.inputId === 'turnOver')
      connectedPlayer.pressingEnter = data.state;
  });
  console.log('A New Player Connection Has Been Established!');
}

//Removes players who leave the browser/game form the playerlist.
Player.onDisconnect = function(socket){
  delete Player.list[socket.id];
  numPlayers--;
}

//When the main loop reaches the player.update it loops through all the players
//and updates them and packages them back up and returns them to setInterval.
Player.update = function(){
  var pPack = [];

  for (var i in Player.list) {
    var inGamePlayer = Player.list[i];
    inGamePlayer.update();
    pPack.push({
      x:inGamePlayer.x,
      y:inGamePlayer.y,
      number: inGamePlayer.number
    });
  }
  return pPack;
}

//MAKING THE DECK//

 cardDeck = function(){

  //var cardsInDeck = [];

  function Card(suit, value){
    this.suit = suit;
    this.value = value;
    this.suitName = (function(cardSuitName){

        var cardName = "";
        switch (cardSuitName) {
          case 1: cardName = "spades";  break;
          case 2: cardName = "clubs";   break;
          case 3: cardName = "hearts";  break;
          case 4: cardName = "diamonds"; break;
        }
      return cardName;
    }(this.suit));

  this.cardType = (function(value){
    var cardName = "";
    switch (value) {
      case 1: cardName = "Ace";    break;
      case 2: cardName = "Two";    break;
      case 3: cardName = "Three";  break;
      case 4: cardName = "Four";   break;
      case 5: cardName = "Five";   break;
      case 6: cardName = "Six";    break;
      case 7: cardName = "Seven";  break;
      case 8: cardName = "Eight";  break;
      case 9: cardName = "Nine";   break;
      case 10: cardName = "Ten";   break;
      case 11: cardName = "Jack";  break;
      case 12: cardName = "Queen"; break;
      case 13: cardName = "King";  break;
    }

    return cardName;

  }(this.value));
  this.cardSource = "" + this.cardType + " of " + this.suitName;

  this.cardPicture = this.getCardPicture();
}

Card.prototype.getCardPicture = function(){

  var value = "".toLowerCase();

  switch(this.value){
    case 1:  value = "ace";   break;
    case 11: value = "jack";  break;
    case 12: value = "queen"; break;
    case 13: value = "king";  break;
    default: value = this.value;
  }
  return "/client/img/card_deck/" + value + "_of_" + this.suitName + ".png";
}

var generateDeck = function(){
  for (var count = 1; count < 14; count++){
    for (var suit = 1; suit < 5; suit++) {
      mainDeck[mainDeck.length] = new Card(suit, count);
      console.log("" + mainDeck[mainDeck.length-1]);
      console.log("Generated Card Was: " + mainDeck[mainDeck.length - 1].cardType + " of " + mainDeck[mainDeck.length - 1].suitName);
    }
  }
}

var shuffleDeck = function(){
  for (var i = 0; i < mainDeck.length; i++){
    var randomCard = Math.floor(Math.random() * mainDeck.length)
     tempCardSlot = mainDeck[i];
     mainDeck[i] = mainDeck[randomCard];
     mainDeck[randomCard] = tempCardSlot;
  }
  for (var z = 0; z < mainDeck.length; z++){
    console.log("Shuffled Card Was: " + mainDeck[z].cardType + " of " + mainDeck[z].suitName);
  }
}

var testCardLocations = function(){
  var location = "No Location";
  for (var k = 0; k < mainDeck.length; k++) {
    console.log("Card location = " + mainDeck[k].cardPicture);
  }
}

var readyDeck = function (){
  generateDeck();
  shuffleDeck();
  testCardLocations();
}

readyDeck();

var drawCards = function(reqNum){
  var requiredCards = [];

  if (mainDeck.length !== 0 || mainDeck.length >= reqNum){
      for (var j = 0; j < reqNum; j++){
        var randomIndex = Math.ceil(Math.random() * mainDeck.length - 1);

        if (mainDeck[randomIndex] !== 'undefined' && mainDeck[randomIndex].suit){
            requiredCards[j] = mainDeck.pop();
        }
        else{
          alert("Random Index is " + randomIndex);
        }
      }
      return requiredCards;
  }
  else {
    console.log('No Cards Left To Draw!');
    }
  }

var getCards = function(numberOfCards){
  return drawCards(numberOfCards);
}

var getCardsForPlayers = function(){

  }

} //Closing bracket for deck

//Checks to see that the user has inputed a valid password for the username
//provided when logging in.
var isValidPassword = function(data, callback){
  speedOnlineDb.accounts.find({username:data.username,password:data.password},function(err, res){
    if (res.length > 0 && numPlayers < 2)
    {
      callback(true);
      numPlayers++;
    }
    else
      callback(false);
  });
}

//Checks that on  signing up that the username isnt already taken.
var isUsernameTaken = function(data, callback){
  speedOnlineDb.accounts.find({username:data.username},function(err, res){
    if (res.length > 0)
      callback(true);
    else
      callback(false);
  });
}

//Inserts a new signed up users information into the Database.
var addUser = function(data, callback){
  speedOnlineDb.accounts.insert({username:data.username, password:data.password},function(err){
    callback();
  });
}

//When a player connects they are assigned a random id and that player is then
//added to the SOCKET_LIST. When a player disconnects it then removes them from
//the SOCKET_LIST. A message to the server console is sent to confirm a new
//connection to the game has been established.
var io = require('socket.io')(hostServer,{});
io.sockets.on('connection', function(socket){

  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn',function(data){
      isValidPassword(data,function(res){
          if(res){
              Player.onConnect(socket);
              socket.emit('signInResponse',{success:true});
          } else {
              socket.emit('signInResponse',{success:false});
          }
      });
  });

  socket.on('gameStart', function(data){
    Deck = new cardDeck();
    console.log('YESSS!');
    socket.emit('deckCreated', {deck:mainDeck});
  });

  socket.on('signUp',function(data){
      isUsernameTaken(data,function(res){
          if(res){
              socket.emit('signUpResponse',{success:false});
          } else {
              addUser(data,function(){
                  socket.emit('signUpResponse',{success:true});
              });
          }
      });
  });
  socket.on('disconnect', function(){
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });
  socket.on('sendMsgToServer', function(chatMessage, player){
    var playerName = player;
    for (var i in SOCKET_LIST){
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + chatMessage);
    }
  });
});

//Main loop of the game begins here - calls Player.update()
//When player pack from Player.update is recieved it emits the pack and updates
//all of the players positions for everyone by sending them to the clients and
//updating their canavs.
setInterval(function(){
  var pack = {
  player: Player.update(),
  //card: Card.update(),
}
    for (var i in SOCKET_LIST) {
      var socket = SOCKET_LIST[i];
      socket.emit('newPosition', pack);
    }
  },1000/25);
