cardDeck = function() {

  function Card(suit, value) {
    this.suit = suit;
    this.value = value;
    this.suitName = (function(cardSuitName) {

      var cardName = "";
      switch (cardSuitName) {
        case 1:
          cardName = "spades";
          break;
        case 2:
          cardName = "clubs";
          break;
        case 3:
          cardName = "hearts";
          break;
        case 4:
          cardName = "diamonds";
          break;
      }
      return cardName;
    }(this.suit));

    this.cardType = (function(value) {
      var cardName = "";
      switch (value) {
        case 1:
          cardName = "Ace";
          break;
        case 2:
          cardName = "Two";
          break;
        case 3:
          cardName = "Three";
          break;
        case 4:
          cardName = "Four";
          break;
        case 5:
          cardName = "Five";
          break;
        case 6:
          cardName = "Six";
          break;
        case 7:
          cardName = "Seven";
          break;
        case 8:
          cardName = "Eight";
          break;
        case 9:
          cardName = "Nine";
          break;
        case 10:
          cardName = "Ten";
          break;
        case 11:
          cardName = "Jack";
          break;
        case 12:
          cardName = "Queen";
          break;
        case 13:
          cardName = "King";
          break;
      }

      return cardName;

    }(this.value));
    this.cardSource = "" + this.cardType + " of " + this.suitName;

    this.cardPicture = this.getCardPicture();
    this.cardBackground = "/client/img/card_deck/card_back.png";
  }

  Card.prototype.getCardPicture = function() {

    var value = "".toLowerCase();

    switch (this.value) {
      case 1:
        value = "ace";
        break;
      case 11:
        value = "jack";
        break;
      case 12:
        value = "queen";
        break;
      case 13:
        value = "king";
        break;
      default:
        value = this.value;
    }
    return "/client/img/card_deck/" + value + "_of_" + this.suitName + ".png";
  }

  var generateDeck = function() {
    for (var count = 1; count < 14; count++) {
      for (var suit = 1; suit < 5; suit++) {
        mainDeck[mainDeck.length] = new Card(suit, count);
        console.log("" + mainDeck[mainDeck.length - 1]);
        console.log("Generated Card Was: " + mainDeck[mainDeck.length - 1].cardType + " of " + mainDeck[mainDeck.length - 1].suitName);
      }
    }
  }

  var shuffleDeck = function() {
    for (var i = 0; i < mainDeck.length; i++) {
      var randomCard = Math.floor(Math.random() * mainDeck.length)
      tempCardSlot = mainDeck[i];
      mainDeck[i] = mainDeck[randomCard];
      mainDeck[randomCard] = tempCardSlot;
    }
    for (var z = 0; z < mainDeck.length; z++) {
      //console.log("Shuffled Card Was: " + mainDeck[z].cardType + " of " + mainDeck[z].suitName);
    }
  }

  var testCardLocations = function() {
    var location = "No Location";
    for (var k = 0; k < mainDeck.length; k++) {
      console.log("Card location = " + mainDeck[k].cardPicture);
    }
  }

  var drawCards = function(reqNum) {
    var requiredCards;

    if (mainDeck.length !== 0 || mainDeck.length >= reqNum) {
      var randomIndex = Math.ceil(Math.random() * mainDeck.length - 1);

      if (mainDeck[randomIndex] !== 'undefined' && mainDeck[randomIndex].suit) {
        requiredCards = mainDeck.pop();
      } else {
        alert("Random Index is " + randomIndex);
      }
      return requiredCards;
      //console.log(requiredCards.cardType);
    } else {
      console.log('No Cards Left To Draw!');
    }
  }

  var prepGame = function() {
    for (var i = 0; i < 4; i++) {
      playerOneHand[i] = drawCards(1);
      playerTwoHand[i] = drawCards(1);
      sparePileOne[i] = drawCards(1);
      sparePileTwo[i] = drawCards(1);
      //console.log("Player One's Card Number " + i + " is: " + playerOneHand[i].cardType + " of " + playerOneHand[i].suitName);
      //console.log("Player Two's Card Number " + i + " is: " + playerTwoHand[i].cardType + " of " + playerTwoHand[i].suitName);
      //console.log("sparePileOnes One's Card Number " + i + " is: " + sparePileOne[i].cardType + " of " + sparePileOne[i].suitName);
      //console.log("sparePileTwos Card Number " + i + " is: " + sparePileTwo[i].cardType + " of " + sparePileTwo[i].suitName);
      //console.log("Value = " + sparePileOne[i].value);
    }

    for (var i = 0; i < 18; i++) {
      playerOneDeck[i] = drawCards(1);
      playerTwoDeck[i] = drawCards(1);
      //  console.log("Player One's Card DECK Number " + i + " is: " + playerOneDeck[i].cardType + " of " + playerOneDeck[i].suitName);
      //console.log("Player Two's Card DECK Number " + i + " is: " + playerTwoDeck[i].cardType + " of " + playerTwoDeck[i].suitName);
    }
  }

  var readyDeck = function() {
    generateDeck();
    shuffleDeck();
    //testCardLocations();
    prepGame();
  }

  readyDeck();

}
