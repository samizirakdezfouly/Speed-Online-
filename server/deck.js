//MAKING THE DECK//
var cardDeck = function(){

  var mainDeck = [];
  var cardsInDeck = [];

  function Card(suit, value){
    this.suit = suit;
    this.value = value;
    this.suitName = (function(cardSuitName){

        var cardName = "";
        switch (cardSuitName) {
          case 1: cardName = "Spades";  break;
          case 2: cardName = "Clubs";   break;
          case 3: cardName = "Hearts";  break;
          case 4: cardName = "Diamonds"; break;
        }
      return cardName;
    }(this.suit));

  this.cardType = (function(value){
    var cardName = "";
    switch (value) {
      case 1: cardName = "Ace";    break;
      case 2: cardName = "Two";    break;
      case 3: cardName = "Three";  break;
      case 4: cardName = "Four";   break;
      case 5: cardName = "Five";   break;
      case 6: cardName = "Six";    break;
      case 7: cardName = "Seven";  break;
      case 8: cardName = "Eight";  break;
      case 9: cardName = "Nine";   break;
      case 10: cardName = "Ten";   break;
      case 11: cardName = "Jack";  break;
      case 12: cardName = "Queen"; break;
      case 13: cardName = "King";  break;
    }

    return cardName;

  }(this.value));
  this.cardSource = "" + this.cardType + " of " + this.suitName;

  this.cardPicture = this.getCardPicture();
}

Card.prototype.getCardPicture = function(){

  var value = "";

  switch(this.value){
    case 1:  value = "ace";   break;
    case 11: value = "jack";  break;
    case 12: value = "queen"; break;
    case 13: value = "king";  break;
    default: value = this.value;
  }
  return ".../client/img/card_deck/" + value + "_of_" + this.suit + ".png";
}

var generateDeck = function(){
  for (var count = 1; count < 14; count++){
    for (var suit = 0; suit < 5; suit++) {
      mainDeck[mainDeck.length] = new Card(suit, count);
    }
  }
}

var shuffleDeck = function(){
  for (var i = 0; i < mainDeck.length; i++){
    var randomCard = Math.floor(Math.random() * mainDeck.length)
     tempCardSlot = mainDeck[i];
     mainDeck[i] = mainDeck[randomCard];
     mainDeck[randomCard] = tempCardSlot;
  }
}

var readyDeck = function (){
  generateDeck();
  shuffleDeck();
}

readyDeck();

var drawCards = function(reqNum){
  var requiredCards = [];

  if (mainDeck.length !== 0 || mainDeck.length >= reqNum){
      for (var j = 0; j < reqNum; j++){
        var randomIndex = Math.ceil(Math.random() * mainDeck.length - 1);

        if (mainDeck[randomIndex] !== 'undefined' && mainDeck[randomIndex].suit){
            requiredCards[j] = mainDeck.pop();
        }
        else{
          alert("Random Index is " + randomIndex);
        }
      }
      return requiredCards;
  }
  else {
    console.log('No Cards Left To Draw!');
    }
  }

  var getCards = function(numberOfCards){
    return drawCards(numberOfCards);
  }

  var getCardsForPlayers = function(){

    }
  return mainDeck;
} //Closing bracket for deck
