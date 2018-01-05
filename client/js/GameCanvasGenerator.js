function firstPlayerPlayState(data) {
  speedGameCanvas.fillText(loggedInPlayerName, 20, 550);
  speedGameCanvas.fillText("Skill Level: " + loggedInPlayerSkillLvl, 20, 575);

  cardsPileOne = {
    cardOne: data.pileOne[0].cardBackground,
    cardTwo: data.pileOne[1].cardBackground,
    cardThree: data.pileOne[2].cardBackground,
    cardFour: data.pileOne[3].cardBackground
  };

  cardsPileTwo = {
    cardOne: data.pileTwo[0].cardBackground,
    cardTwo: data.pileTwo[1].cardBackground,
    cardThree: data.pileTwo[2].cardBackground,
    cardFour: data.pileTwo[3].cardBackground
  };

  playerOneCards = {
    handCardOne: data.pOneHand[0].cardPicture,
    handCardTwo: data.pOneHand[1].cardPicture,
    handCardThree: data.pOneHand[2].cardPicture,
    handCardFour: data.pOneHand[3].cardPicture
  };

  playerTwoCards = {
    handCardOne: data.pTwoHand[0].cardBackground,
    handCardTwo: data.pTwoHand[1].cardBackground,
    handCardThree: data.pTwoHand[2].cardBackground,
    handCardFour: data.pTwoHand[3].cardBackground
  };

  loadImages(cardsPileOne, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 100, 269.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardTwo, 100, 279.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardThree, 100, 289.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardFour, 100, 299.25, 125, 181.5);
  });

  loadImages(cardsPileTwo, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 1055, 269.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardTwo, 1055, 279.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardThree, 1055, 289.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardFour, 1055, 299.25, 125, 181.5);
  });

  loadImages(playerOneCards, function(images) {
    speedGameCanvas.drawImage(images.handCardOne, 270, 530, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardTwo, 460, 530, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardThree, 650, 530, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardFour, 840, 530, 125, 181.5);
  });

  loadImages(playerTwoCards, function(images) {
    speedGameCanvas.drawImage(images.handCardOne, 270, 8.5, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardTwo, 460, 8.5, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardThree, 650, 8.5, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardFour, 840, 8.5, 125, 181.5);
  });

}

function secondPlayerPlayState(data) {
  speedGameCanvas.fillText(loggedInPlayerName, 20, 550);
  speedGameCanvas.fillText("Skill Level: " + loggedInPlayerSkillLvl, 20, 575);

  cardsPileOneImgs = {
    cardOne: data.pileOne[0].cardBackground,
    cardTwo: data.pileOne[1].cardBackground,
    cardThree: data.pileOne[2].cardBackground,
    cardFour: data.pileOne[3].cardBackground
  };

  cardsPileTwoImgs = {
    cardOne: data.pileTwo[0].cardBackground,
    cardTwo: data.pileTwo[1].cardBackground,
    cardThree: data.pileTwo[2].cardBackground,
    cardFour: data.pileTwo[3].cardBackground
  };

  playerOneCards = {
    handCardOne: data.pOneHand[0].cardBackground,
    handCardTwo: data.pOneHand[1].cardBackground,
    handCardThree: data.pOneHand[2].cardBackground,
    handCardFour: data.pOneHand[3].cardBackground
  };

  playerTwoCards = {
    handCardOne: data.pTwoHand[0].cardPicture,
    handCardTwo: data.pTwoHand[1].cardPicture,
    handCardThree: data.pTwoHand[2].cardPicture,
    handCardFour: data.pTwoHand[3].cardPicture
  };

  loadImages(cardsPileOneImgs, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 100, 269.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardTwo, 100, 279.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardThree, 100, 289.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardFour, 100, 299.25, 125, 181.5);
  });

  loadImages(cardsPileTwoImgs, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 1055, 269.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardTwo, 1055, 279.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardThree, 1055, 289.25, 125, 181.5);
    speedGameCanvas.drawImage(images.cardFour, 1055, 299.25, 125, 181.5);
  });

  loadImages(playerOneCards, function(images) {
    speedGameCanvas.drawImage(images.handCardOne, 270, 8.5, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardTwo, 460, 8.5, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardThree, 650, 8.5, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardFour, 840, 8.5, 125, 181.5);
  });

  loadImages(playerTwoCards, function(images) {
    speedGameCanvas.drawImage(images.handCardOne, 270, 530, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardTwo, 460, 530, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardThree, 650, 530, 125, 181.5);
    speedGameCanvas.drawImage(images.handCardFour, 840, 530, 125, 181.5);
  });

}

function loadGameBackground() {
  speedOnlineBackground = new Image();
  speedOnlineBackground.src = "/client/img/poker_table_felt.png";

  speedOnlineBackground.onload = function() {
    speedGameCanvas.drawImage(speedOnlineBackground, 0, 0);
  }
}

function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for (var src in sources) {
    numImages++;
  }
  for (var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}
