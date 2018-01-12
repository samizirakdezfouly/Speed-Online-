function firstPlayerPlayState(data) {
  var switchBool = false;
  var cardFourGone = false;
  var cardThreeGone = false;
  var cardTwoGone = false;
  var cardOneGone = false;

  var enemyCardFourGone = false;
  var enemyCardThreeGone = false;
  var enemyCardTwoGone = false;
  var enemyCardOneGone = false;

  var sideDeckGoneImg = "/client/img/empty_side_deck.png";
  var emptyHandSlotImg = "/client/img/hand_slot_empty.png";

  speedGameCanvas.fillText(loggedInPlayerName, 20, 550);
  speedGameCanvas.fillText("Skill Level: " + loggedInPlayerSkillLvl, 20, 575);

  if (data.pileOne.length == 0)
    switchBool = true;
  if (data.pOneHand.length == 3)
    cardFourGone = true;
  if (data.pOneHand.length == 2)
    cardThreeGone = true;
  if (data.pOneHand.length == 1)
    cardTwoGone = true;
  if (data.pOneHand.length == 0)
    cardOneGone = true;
  if (data.pTwoHand.length == 3)
    enemyCardFourGone = true;
  if (data.pTwoHand.length == 2)
    enemyCardThreeGone = true;
  if (data.pTwoHand.length == 1)
    enemyCardTwoGone = true;
  if (data.pTwoHand.length == 0)
    enemyCardOneGone = true;

  cardsPileOne = {
    cardOne: switchBool ? sideDeckGoneImg : data.pileOne[0].cardBackground
  };

  cardsPileTwo = {
    cardOne: switchBool ? sideDeckGoneImg : data.pileTwo[0].cardBackground
  };

  playerOneCards = {
    handCardOne: cardOneGone ? emptyHandSlotImg : data.pOneHand[0].cardPicture,
    handCardTwo: cardTwoGone ? emptyHandSlotImg : data.pOneHand[1].cardPicture,
    handCardThree: cardThreeGone ? emptyHandSlotImg : data.pOneHand[2].cardPicture,
    handCardFour: cardFourGone ? emptyHandSlotImg : data.pOneHand[3].cardPicture
  };

  playerTwoCards = {
    handCardOne: enemyCardOneGone ? emptyHandSlotImg : data.pTwoHand[0].cardBackground,
    handCardTwo: enemyCardTwoGone ? emptyHandSlotImg : data.pTwoHand[1].cardBackground,
    handCardThree: enemyCardThreeGone ? emptyHandSlotImg : data.pTwoHand[2].cardBackground,
    handCardFour: enemyCardFourGone ? emptyHandSlotImg : data.pTwoHand[3].cardBackground
  };

  discardPileOne = {
    zero: data.cardPileO[0].cardPicture
  };

  discardPileTwo = {
    zero: data.cardPileT[0].cardPicture
  };

  loadImages(cardsPileOne, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 100, 279.25, 125, 181.5);
  });

  loadImages(cardsPileTwo, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 1055, 279.25, 125, 181.5);
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


  loadImages(discardPileOne, function(images) {
    speedGameCanvas.drawImage(images.zero, 460, 279, 125, 181.5);
  });

  loadImages(discardPileTwo, function(images) {
    speedGameCanvas.drawImage(images.zero, 650, 279, 125, 181.5);
  });

}

function secondPlayerPlayState(data) {
  var switchBool = false;
  var cardFourGone = false;
  var cardThreeGone = false;
  var cardTwoGone = false;
  var cardOneGone = false;

  var enemyCardFourGone = false;
  var enemyCardThreeGone = false;
  var enemyCardTwoGone = false;
  var enemyCardOneGone = false;

  var sideDeckGoneImg = "/client/img/empty_side_deck.png";
  var emptyHandSlotImg = "/client/img/hand_slot_empty.png";

  speedGameCanvas.fillText(loggedInPlayerName, 20, 550);
  speedGameCanvas.fillText("Skill Level: " + loggedInPlayerSkillLvl, 20, 575);

  if (data.pileOne.length == 0)
    switchBool = true;
  if (data.pOneHand.length == 3)
    cardFourGone = true;
  if (data.pOneHand.length == 2)
    cardThreeGone = true;
  if (data.pOneHand.length == 1)
    cardTwoGone = true;
  if (data.pOneHand.length == 0)
    cardOneGone = true;
  if (data.pTwoHand.length == 3)
    enemyCardFourGone = true;
  if (data.pTwoHand.length == 2)
    enemyCardThreeGone = true;
  if (data.pTwoHand.length == 1)
    enemyCardTwoGone = true;
  if (data.pTwoHand.length == 0)
    enemyCardOneGone = true;

  cardsPileOne = {
    cardOne: switchBool ? sideDeckGoneImg : data.pileOne[0].cardBackground
  };

  cardsPileTwo = {
    cardOne: switchBool ? sideDeckGoneImg : data.pileTwo[0].cardBackground
  };

  playerOneCards = {
    handCardOne: cardOneGone ? emptyHandSlotImg : data.pOneHand[0].cardBackground,
    handCardTwo: cardTwoGone ? emptyHandSlotImg : data.pOneHand[1].cardBackground,
    handCardThree: cardThreeGone ? emptyHandSlotImg : data.pOneHand[2].cardBackground,
    handCardFour: cardFourGone ? emptyHandSlotImg : data.pOneHand[3].cardBackground
  };

  playerTwoCards = {
    handCardOne: enemyCardOneGone ? emptyHandSlotImg : data.pTwoHand[0].cardPicture,
    handCardTwo: enemyCardTwoGone ? emptyHandSlotImg : data.pTwoHand[1].cardPicture,
    handCardThree: enemyCardThreeGone ? emptyHandSlotImg : data.pTwoHand[2].cardPicture,
    handCardFour: enemyCardFourGone ? emptyHandSlotImg : data.pTwoHand[3].cardPicture
  };

  discardPileOne = {
    zero: data.cardPileO[0].cardPicture
  };

  discardPileTwo = {
    zero: data.cardPileT[0].cardPicture
  };

  loadImages(cardsPileOne, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 100, 279.25, 125, 181.5);
  });

  loadImages(cardsPileTwo, function(images) {
    speedGameCanvas.drawImage(images.cardOne, 1055, 279.25, 125, 181.5);
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

  loadImages(discardPileOne, function(images) {
    speedGameCanvas.drawImage(images.zero, 460, 279, 125, 181.5);
  });

  loadImages(discardPileTwo, function(images) {
    speedGameCanvas.drawImage(images.zero, 650, 279, 125, 181.5);
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
