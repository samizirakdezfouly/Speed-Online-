//Confirmation that the server is up and running correctly//
console.log("'Speed Online!' is up and running");

require('./Deck');

//MongoDb Database Linking//
var mongojs = require("mongojs");
var speedOnlineDb = mongojs("mongodb://samizirak:speedonlinedb@ds147544.mlab.com:47544/speedonline", ["accounts", "skillLvls"]);
//Express//
var expressCom = require('express');
var speedOnline = expressCom();
var hostServer = require('http').Server(speedOnline);
var numPlayers = 0;
var generateDeck = new cardDeck();
var skillLvlHolder;
mainDeck = [];
playerOneHand = [];
playerTwoHand = [];
playerOneDeck = [];
playerTwoDeck = [];
sparePileOne = [];
sparePileTwo = [];

speedOnline.get('/',function(req,res)
{
  res.sendFile(__dirname + '/client/index.html');
})

speedOnline.use('/client', expressCom.static(__dirname + '/client'));

hostServer.listen(process.env.PORT || 2000);
//////////////////////////////////////////////////////////////////////
//Socket.io//
var SOCKET_LIST = {};

//Player Function takes a "Gamer" and inherits its arrtibutes as well
//as adding a few more of its own.
var Player = function(id){
  var self = {
    id: id,
    number: "" + Math.floor(10 * Math.random()),
    //skillLvl: skillLvlHolder,
    pressingSpace : false,
    pressingEnter : false,
    pressingOne : false,
    pressingTwo : false,
  }

//Updates the speed of the player as well as a calling the regular update
//function.
  self.update = function(){
    self.UpdateSpeed();
  }

//This function continuously checks if any of the games inputs are being used
//if they are then it has an outcome.
  self.UpdateSpeed = function(){
    if (self.pressingOne)
      console.log("Player Pressing One");
    else if (self.pressingTwo)
      console.log("Player Pressing Two");
    if (self.pressingSpace)
      console.log("Player Pressing Space");
    else if (self.pressingEnter)
      console.log("Player Pressing Enter");
  }
  Player.list[id] = self;
  return self;
}

Player.list = {};

//Acts as a listener, when the client uses a keypress it sends a data package
//to the server (this) and changes values within "UpdateSpeed" depending on
//the keypress.
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
      number: inGamePlayer.number
    });
    //console.log("Player Pack Pushed");
  }
  return pPack;
}

// Checks to see that the user has inputed a valid password for the username
// provided when logging in.
var isValidPassword = function(data, callback){
  speedOnlineDb.accounts.find({username:data.username,password:data.password},function(err, res){
    if (res.length > 0 && numPlayers < 2)
    {
      callback(true);
      if (numPlayers < 0)
        numPlayers = 1;
      else
        numPlayers = numPlayers + 1;
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
              findPlayerSkill(data,function(res){});
              Player.onConnect(socket);
              console.log(numPlayers);
              socket.emit('signInResponse',{success:true, numberOfPlayers: numPlayers});
          } else {
              socket.emit('signInResponse',{success:false});
          }
      });
  });

  var findPlayerSkill = function(data,callback){
    speedOnlineDb.skillLvls.find({username: data.username}, function(err, res){
      if (res.length > 0) {
        console.log(res[0].skillLvl);
        //skillLvlHolder = res[0].skillLvl;
        socket.emit('getSkill', {skillLvl: res[0].skillLvl});
      }
    });
  }

  socket.on('gameStart', function(data){
    if (numPlayers == 2) {
      for (var i in SOCKET_LIST){
        SOCKET_LIST[i].emit('deckCreated', {pileOne: sparePileOne, pileTwo: sparePileTwo,
          pOneHand: playerOneHand, pTwoHand: playerTwoHand});
      }
    }
    else {
      console.log("Not Enough Players Present To Start Game!" + " " + numPlayers);
    }
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
