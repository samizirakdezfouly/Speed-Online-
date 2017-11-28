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
var PLAYER_LIST = {};

var Player = function(id){
  var self = {
    x: 250,
    y: 250,
    id: id,
    number:"" + Math.floor(10 * Math.random()),
    pressingSpace: false,
    pressingEnter: false,
    pressingOne: false,
    pressingTwo: false,
    maxSpd: 10,
  }
  self.UpdatePosition = function(){
    if (self.pressingOne)
      self.x += self.maxSpd;
    if (self.pressingTwo)
      self.x -= self.maxSpd;
    if (self.pressingSpace)
      self.y += self.maxSpd;
    if (self.pressingEnter)
      self.y -= self.maxSpd;
  }
  return self;
}

var io = require('socket.io')(hostServer,{});
io.sockets.on('connection', function(socket){  //when player connects
  socket.id = Math.random(); //assign random id

  SOCKET_LIST[socket.id] = socket; //add players id to socket list

  var connectedPlayer = Player(socket.id);
  PLAYER_LIST[socket.id] = connectedPlayer;

  socket.on('disconnect', function(){ //when player disconnects
    delete SOCKET_LIST[socket.id];  //delete them from socket SOCKET_LIST
    delete PLAYER_LIST[socket.id]; //delete them from PLAYER_LIST
  })

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

  console.log('Socket Connection Established!');
});

setInterval(function(){

  var pPack = [];

  for (var i in PLAYER_LIST) {
    var inGamePlayer = PLAYER_LIST[i];
    inGamePlayer.UpdatePosition();

    pPack.push({
      x:inGamePlayer.x,
      y:inGamePlayer.y,
      number: inGamePlayer.number
    });

    for (var i in SOCKET_LIST) {
      var socket = SOCKET_LIST[i];
      socket.emit('newPosition', pPack);
    }
  }
},1000/25);
