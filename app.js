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

var io = require('socket.io')(hostServer,{});
io.sockets.on('connection', function(socket){
  socket.id = Math.random();
  socket.x = 0;
  socket.y = 0;
  socket.number = "" + Math.floor(10 * Math.random());
  SOCKET_LIST[socket.id] = socket;

  socket.on('disconnect', function(){
    delete SOCKET_LIST[socket.id];
  })

  console.log('Socket Connection Established!');
});

setInterval(function(){

  var pPack = [];

  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.x++;
    socket.y++;

    pPack.push({
      x:socket.x,
      y:socket.y,
      number: socket.number
    });

    for (var i in SOCKET_LIST) {
      var socket = SOCKET_LIST[i];
      socket.emit('newPosition', pPack);
    }
  }
},1000/25);
