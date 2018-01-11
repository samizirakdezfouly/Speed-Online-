//Confirmation that the server is up and running correctly//
console.log("'Speed Online!' is up and running");

require('./Deck');
require('./client/js/GameCanvasGenerator');
require('./Player');


//MongoDb Database Linking//
var mongojs = require("mongojs");
var speedOnlineDb = mongojs("mongodb://samizirak:speedonlinedb@ds147544.mlab.com:47544/speedonline", ["accounts", "skillLvls"]);
//Express//
var expressCom = require('express');
var speedOnline = expressCom();
var hostServer = require('http').Server(speedOnline);
mainDeck = [];
playerOneHand = [];
playerTwoHand = [];
playerOneDeck = [];
playerTwoDeck = [];
sparePileOne = [];
sparePileTwo = [];
cardPileOne = [];
cardPileTwo = [];
numPlayers = 0;
var generateDeck = new cardDeck();
var skillLvlHolder;
var beginChecks = false;

speedOnline.get('/',function(req,res)
{
  res.sendFile(__dirname + '/client/index.html');
})

speedOnline.use('/client', expressCom.static(__dirname + '/client'));

hostServer.listen(process.env.PORT || 2000);
//////////////////////////////////////////////////////////////////////
//Socket.io//
SOCKET_LIST = {};

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
    speedOnlineDb.skillLvls.insert({username: data.username, skillLvl: 0},function(err){
      callback();
    });
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

  socket.on("checkIfStaleMate", function(data){
    var count = 0;
    var cardsToCheck = [
      cardPileOne[0].value +1,
      cardPileOne[0]. value -1,
      cardPileTwo[0].value +1,
      cardPileTwo[0].value -1
    ];

      for(var i = 0; i < cardsToCheck.length; i++){
        if(cardsToCheck[i] != playerOneHand[0].value && cardsToCheck[i] != playerOneHand[1].value
          && cardsToCheck[i] != playerOneHand[2].value && cardsToCheck[i] != playerOneHand[3].value){
                count = count + 0.5;
            if(cardsToCheck[i] != playerTwoHand[0].value && cardsToCheck[i] != playerTwoHand[1].value
              && cardsToCheck[i] != playerTwoHand[2].value && cardsToCheck[i] != playerTwoHand[3].value){
               count = count + 0.5;
            }
        }
      }
        console.log(count);
        if(count == 4){
          if(data.isLocalArrayEmpty == false)
            flipSideDeckCard(cardPileOne, cardPileTwo, sparePileOne, sparePileTwo);

            for (var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('decksUpdated', {pileOne: sparePileOne, pileTwo: sparePileTwo,
              pOneHand: playerOneHand, pTwoHand: playerTwoHand, pOneDeck: playerOneDeck, pTwoDeck: playerTwoDeck, cardPileO: cardPileOne, cardPileT: cardPileTwo});
          }
          count = 0;
        }
        else{
          socket.emit('addToChat', "GAME: There Are Still Cards That Can Be Played! " + sparePileOne.length);
          count = 0;
        }
 });

 function flipSideDeckCard(cardPOne, cardPTwo, sparePileO, sparePileT) {

   var cardOne;
   var cardTwo;

 if(sparePileO.length > 0){
   cardOne = sparePileO.pop();
   cardTwo = sparePileT.pop();

   cardPOne[0] = cardOne;
   cardPTwo[0]= cardTwo;
   }
   else {
     socket.emit('addToChat', "GAME: There Are No Cards Left In The Side Deck!")
   }
 }

  function checkPlayedCard(chosenCard, chosenCardPile, handPos, pileNo, playerNum) {
      var xPos;
      var yPos;

      var xPilePos;
      var yPilePos;

      var cardHolder;

    if (chosenCardPile[chosenCardPile.length - 1].value + 1 == chosenCard.value || chosenCardPile[chosenCardPile.length - 1].value - 1 == chosenCard.value) {
      if(playerNum == 0){
        cardHolder = playerOneHand.splice(handPos- 1, 1);
      }
      if(playerNum == 1){
        cardHolder = playerTwoHand.splice(handPos - 1, 1);
      }
      if(pileNo == 1){
        cardPileOne[0] = cardHolder[0];
      }
      if(pileNo == 2){
        cardPileTwo[0] = cardHolder[0];
      }
      if(playerNum == 0){
        cardHolder = playerOneDeck.pop();
        playerOneHand[3] = cardHolder;
      }
      if(playerNum == 1){
        cardHolder = playerTwoDeck.pop();
        playerTwoHand[3] = cardHolder;
      }
      for (var i in SOCKET_LIST){
        SOCKET_LIST[i].emit('decksUpdated', {pileOne: sparePileOne, pileTwo: sparePileTwo,
          pOneHand: playerOneHand, pTwoHand: playerTwoHand, pOneDeck: playerOneDeck, pTwoDeck: playerTwoDeck, cardPileO: cardPileOne, cardPileT: cardPileTwo});
      }
    }
    else {
      socket.emit('addToChat', "GAME: You Cannot Play That Card! " + playerOneDeck.length + " " + playerTwoDeck.length);
    }
  }

  var findPlayerSkill = function(data,callback){
    speedOnlineDb.skillLvls.find({username: data.username}, function(err, res){
      if (res.length > 0) {
        console.log(res[0].skillLvl);
        socket.emit('getSkill', {skillLvl: res[0].skillLvl});
      }
    });
  }

  socket.on('gameStart', function(data){
    if (numPlayers == 2) {
      flipSideDeckCard(cardPileOne, cardPileTwo, sparePileOne, sparePileTwo);
      for (var i in SOCKET_LIST){
        SOCKET_LIST[i].emit('deckCreated', {pileOne: sparePileOne, pileTwo: sparePileTwo,
          pOneHand: playerOneHand, pTwoHand: playerTwoHand, pOneDeck: playerOneDeck, pTwoDeck: playerTwoDeck, cardPileO: cardPileOne, cardPileT: cardPileTwo});
      }
      beginChecks = true;
    }
    else {
      console.log("Not Enough Players Present To Start Game!" + " " + numPlayers);
    }
  });

  socket.on('checkCard', function(data){
    checkPlayedCard(data.cardToCheck, data.requestedPile, data.valOne, data.valTwo, data.playerNumber);
  })

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
//all of the players card positions for everyone by sending them to the clients and
//updating their canavs.
setInterval(function(){
  var pack = {
  player: Player.update(),
  //card: Card.update(),
}
    for (var i in SOCKET_LIST) {
      var socket = SOCKET_LIST[i];
if (beginChecks == true)
    socket.emit('newPosition', pack);
    }
  },1000/25);
