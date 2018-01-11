var socket = io();
var loggedInPlayerName;
var loggedInPlayerSkillLvl;
var opponentName;
var opponentSkillLvl;

//Card Loader
cardsPileOne = {};
cardsPileTwo = {};
playerOneCards = {};
playerTwoCards = {};
discardPileOne = {};
discardPileTwo = {};

playerOneDeckArray = [];
playerTwoDeckArray = [];
spareCardsPileOneArray = [];
spareCardsPileTwoArray = [];
playerOneCardsArray = [];
playerTwoCardsArray = [];
cardsPileOneArray = [];
cardsPileTwoArray = [];
var playerNum;
var cardsInHand;
var inputsActive = false;

keyCombos = {
  one : false,
  two : false,
  q : false,
  w : false,
  e : false,
  r : false
}
//Sign In

window.onload = function(){
  var signDiv = document.getElementById('signDiv');
  var gameDiv = document.getElementById('gameDiv');
  var signDivUsername = document.getElementById('signDiv-username');
  var signDivPassword = document.getElementById('signDiv-password');
  var signDivSignIn = document.getElementById('signDiv-signIn');
  var signDivSignUp = document.getElementById('signDiv-signUp');
  signDivSignIn.onclick = function(){
    socket.emit('signIn',{username: signDivUsername.value, password: signDivPassword.value});
  }
  signDivSignUp.onclick = function(){
    socket.emit('signUp',{username: signDivUsername.value, password: signDivPassword.value});
  }
  var chatText = document.getElementById('chat-text');
  var chatInput = document.getElementById('chat-input');
  var chatForm = document.getElementById('chat-form');
  speedGameCanvas = document.getElementById('speedGameCanvas').getContext("2d");
  startGameButton = document.getElementById('startGame');
  flipSideDeckButton = document.getElementById('flipSideDeckBut');

  startGameButton.addEventListener('click', function(){
    socket.emit('gameStart',{startGame: true});
  });

  socket.on('inputsActive', function(data){
    inputsActive = data.inputs;
  });

  flipSideDeckButton.addEventListener('click', function(){
    if(spareCardsPileOneArray.length > 0){
      socket.emit("checkIfStaleMate", {isLocalArrayEmpty : false});
    }else{
      console.log("No Pile Cards Left");
      socket.emit("checkIfStaleMate", {isLocalArrayEmpty: true});
    }
  });
  speedGameCanvas.font = '20px Arial';
  speedGameCanvas.fillStyle = "white";
  chatForm.onsubmit = function(e){
      e.preventDefault();
      if (chatInput.value != "") {
        socket.emit('sendMsgToServer', chatInput.value, loggedInPlayerName);
        chatInput.value = '';
      }
  }

  socket.on('signInResponse', function(data){
    if (data.success) {
      loggedInPlayerName = signDivUsername.value;
      playerNum = data.numberOfPlayers;
      signDiv.style.display = 'none';
      gameDiv.style.display = 'inline-block';
    }
    else if (data.success == false && data.numberOfPlayers >= 2)
      alert("The game is currently full! Try logging in later!");
    else if (data.success == false)
      alert("Sign In Unsuccessful! Check that you have entered your username and password correctly!");


  });

  socket.on('signUpResponse', function(data){
    if (data.success) {
      alert("Sign Up Sucessful! You may now Log In!")
    } else {
      alert("Sign Up Unsuccessful, Another user exists with the same username!");
    }
  });

  socket.on('getSkill', function(data){
    loggedInPlayerSkillLvl = data.skillLvl;
  });

  //Game
  //Client

  socket.on('newPosition',function(data){

  });

  socket.on('addToChat', function(data){
      chatText.innerHTML += '<div>' + data + '</div>';
      chatText.scrollTop = chatText.scrollHeight;
  });



  function transferServerCardArrays(data){
    playerOneDeckArray = Array.from(data.pOneDeck);
    playerTwoDeckArray = Array.from(data.pTwoDeck);
    playerOneCardsArray = Array.from(data.pOneHand);
    playerTwoCardsArray = Array.from(data.pTwoHand);
    spareCardsPileOneArray = Array.from(data.pileOne);
    spareCardsPileTwoArray = Array.from(data.pileTwo);
    cardsPileOneArray = Array.from(data.cardPileO);
    cardsPileTwoArray = Array.from(data.cardPileT);
  }

  socket.on('decksUpdated', function(data){
    transferServerCardArrays(data);
    if(playerNum == 0)
      firstPlayerPlayState(data);
    if(playerNum == 1)
      secondPlayerPlayState(data);
    if(data.pileOne.length == 0)
      flipSideDeckButton.disabled = true;
  });

  socket.on('deckCreated',function(data){
    transferServerCardArrays(data);
    if(playerNum == 0)
      firstPlayerPlayState(data);
    if(playerNum == 1)
      secondPlayerPlayState(data);
    startGameButton.disabled = true;
    flipSideDeckButton.disabled = false;

  });

  document.onkeydown = function(event){
if(inputsActive ==true){
  if (event.keyCode === 49){
    keyCombos.one = true;
    keyCombos.two = false;
  } //1
  else if (event.keyCode === 50){
    keyCombos.one = false;
    keyCombos.two = true;
  } //2
  else if (event.keyCode === 81){
    keyCombos.q = true;
    keyCombos.w = false;
    keyCombos.e = false;
    keyCombos.r = false;
  } //Q
  else if (event.keyCode === 87){
    keyCombos.q = false;
    keyCombos.w = true;
    keyCombos.e = false;
    keyCombos.r = false;
  } //W
  else if (event.keyCode === 69){
    keyCombos.q = false;
    keyCombos.w = false;
    keyCombos.e = true;
    keyCombos.r = false;
  } //E
  else if (event.keyCode === 82){
    keyCombos.q = false;
    keyCombos.w = false;
    keyCombos.e = false;
    keyCombos.r = true;
  } //R
  else if (event.keyCode === 13) {
    if (keyCombos.one === true && keyCombos.q === true){
        socket.emit('keyPress',{inputId: 'firstHandCardToPileOne', state: true});
        if(playerNum ==0)
        checkCard(playerOneCardsArray[0], cardsPileOneArray, 1, 1, playerNum);
        if(playerNum ==1)
        checkCard(playerTwoCardsArray[0], cardsPileOneArray,1, 1, playerNum);
    }
    else if (keyCombos.one === true && keyCombos.w === true){
      socket.emit('keyPress',{inputId: 'secondHandCardToPileOne', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[1], cardsPileOneArray, 2, 1, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[1], cardsPileOneArray, 2, 1, playerNum);
    }
    else if (keyCombos.one === true && keyCombos.e === true){
      socket.emit('keyPress',{inputId: 'thirdHandCardToPileOne', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[2], cardsPileOneArray, 3, 1, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[2], cardsPileOneArray, 3, 1, playerNum);
    }
    else if (keyCombos.one === true && keyCombos.r === true){
      socket.emit('keyPress',{inputId: 'fourthHandCardToPileOne', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[3], cardsPileOneArray, 4, 1, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[3], cardsPileOneArray, 4, 1, playerNum);
    }

    else if (keyCombos.two === true && keyCombos.q === true){
      socket.emit('keyPress',{inputId: 'firstHandCardToPileTwo', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[0], cardsPileTwoArray, 1, 2, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[0], cardsPileTwoArray, 1 , 2, playerNum);
    }
    else if (keyCombos.two === true && keyCombos.w === true){
      socket.emit('keyPress',{inputId: 'secondHandCardToPileTwo', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[1], cardsPileTwoArray,2, 2, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[1], cardsPileTwoArray,2,2, playerNum);
    }
    else if (keyCombos.two === true && keyCombos.e === true){
      socket.emit('keyPress',{inputId: 'thirdHandCardToPileTwo', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[2], cardsPileTwoArray, 3,2, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[2], cardsPileTwoArray, 3,2, playerNum);
    }
    else if (keyCombos.two === true && keyCombos.r === true){
      socket.emit('keyPress',{inputId: 'fourthHandCardToPileTwo', state: true});
      if(playerNum ==0)
      checkCard(playerOneCardsArray[3], cardsPileTwoArray, 4,2, playerNum);
      if(playerNum ==1)
      checkCard(playerTwoCardsArray[3], cardsPileTwoArray,4,2, playerNum);
    }
  }
}
}


  document.onkeyup = function(event){
    if (event.keyCode === 13) //ENTER
      socket.emit('keyPress',{inputId: 'reset', state: false});
  }


  function checkCard(card, pile, valOne, valTwo, playerNumber){
    socket.emit('checkCard', {cardToCheck: card, requestedPile: pile, valOne : valOne, valTwo : valTwo, playerNumber: playerNumber});
  }

  loadGameBackground();
  flipSideDeckButton.disabled = true;

};
