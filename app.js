console.log("'Speed Online!' is up and running");

var expressCom = require('express');
var speedOnline = expressCom();
var hostServer = require('http').Server(speedOnline);

speedOnline.get('/',function(req,res)
{
  res.sendFile(__dirname + '/client/index.html');
})

speedOnline.use('/client', expressCom.static(__dirname + '/client'));

hostServer.listen(2000);
