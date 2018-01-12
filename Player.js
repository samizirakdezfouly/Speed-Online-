Player = function(id) {
  var self = {
    id: id,
    number: "" + Math.floor(10 * Math.random()),
    username: "",
    pressingQAndOne: false,
    pressingQAndTwo: false,
    pressingWAndOne: false,
    pressingWAndTwo: false,
    pressingEAndOne: false,
    pressingEAndTwo: false,
    pressingRAndOne: false,
    pressingRAndTwo: false,
  }

  //This function continuously checks if any of the games inputs are being used
  //if they are then it has an outcome.
  self.UpdateCardPositions = function() {
    if (self.pressingQAndOne)
      console.log("Player Sending Card One To Pile One");
    else if (self.pressingWAndOne)
      console.log("Player Sending Card Two To Pile One");
    else if (self.pressingEAndOne)
      console.log("Player Sending Card Three To Pile One");
    else if (self.pressingRAndOne)
      console.log("Player Sending Card Four To Pile One");

    else if (self.pressingQAndTwo)
      console.log("Player Sending Card One To Pile Two");
    else if (self.pressingWAndTwo)
      console.log("Player Sending Card Two To Pile Two");
    else if (self.pressingEAndTwo)
      console.log("Player Sending Card Three To Pile Two");
    else if (self.pressingRAndTwo)
      console.log("Player Sending Card Four To Pile Two");
  }
  Player.list[id] = self;
  return self;
}

Player.list = {};

//Executes on login and acts as a listener, when the client uses a keypress it sends a data package
//to the server (this) and changes values within "UpdateCardPositions" depending on
//the keypress.
Player.onConnect = function(socket) {

  var connectedPlayer = Player(socket.id);

  socket.on('keyPress', function(data) {
    if (data.inputId === 'firstHandCardToPileOne')
      connectedPlayer.pressingQAndOne = data.state;
    else if (data.inputId === 'secondHandCardToPileOne')
      connectedPlayer.pressingWAndOne = data.state;
    else if (data.inputId === 'thirdHandCardToPileOne')
      connectedPlayer.pressingEAndOne = data.state;
    else if (data.inputId === 'fourthHandCardToPileOne')
      connectedPlayer.pressingRAndOne = data.state;

    else if (data.inputId === 'firstHandCardToPileTwo')
      connectedPlayer.pressingQAndTwo = data.state;
    else if (data.inputId === 'secondHandCardToPileTwo')
      connectedPlayer.pressingWAndTwo = data.state;
    else if (data.inputId === 'thirdHandCardToPileTwo')
      connectedPlayer.pressingEAndTwo = data.state;
    else if (data.inputId === 'fourthHandCardToPileTwo')
      connectedPlayer.pressingRAndTwo = data.state;
    else if (data.inputId === 'reset') {
      connectedPlayer.pressingQAndOne = data.state;
      connectedPlayer.pressingWAndOne = data.state;
      connectedPlayer.pressingEAndOne = data.state;
      connectedPlayer.pressingRAndOne = data.state;
      connectedPlayer.pressingQAndTwo = data.state;
      connectedPlayer.pressingWAndTwo = data.state;
      connectedPlayer.pressingEAndTwo = data.state;
      connectedPlayer.pressingRAndTwo = data.state;
    }
  });
  console.log('A New Player Connection Has Been Established!');
}

//Removes players who leave the browser/game form the playerlist.
Player.onDisconnect = function(socket) {
  delete Player.list[socket.id];
  numPlayers--;
}
