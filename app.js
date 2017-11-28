//Confirmation that the server is up and running correctly
console.log("'Speed Online!' is up and running");

//Express

var expressCom = require('express');
var speedOnline = expressCom();
var hostServer = require('http').Server(speedOnline);

speedOnline.get('/',function(req,res)
{
  res.sendFile(__dirname + '/client/index.html');
})

speedOnline.use('/client', expressCom.static(__dirname + '/client'));

hostServer.listen(2000);


//Socket.io
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
}

//Removes players who leave the browser/game form the playerlist.
Player.onDisconnect = function(socket){
  delete Player.list[socket.id];
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

//When a player connects they are assigned a random id and that player is then
//added to the SOCKET_LIST. When a player disconnects it then removes them from
//the SOCKET_LIST. A message to the server console is sent to confirm a new
//connection to the game has been established.
var io = require('socket.io')(hostServer,{});
io.sockets.on('connection', function(socket){

  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  Player.onConnect(socket);

  socket.on('disconnect', function(){
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  })
  console.log('A Ne Socket Connection Has Been Established!');
});

//Main loop of the game begins here - calls Player.update()
//When player pack from Player.update is recieved it emits the pack and updates
//all of the players positions for everyone by sending them to the clients and
//updating their canavs.
setInterval(function(){
  var pack = Player.update();

    for (var i in SOCKET_LIST) {
      var socket = SOCKET_LIST[i];
      socket.emit('newPosition', pack);
    }
  },1000/25);
