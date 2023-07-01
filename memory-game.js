"use strict";

/* CARD COUNT */
let maxCards;
let flippedCards = [];
let counterValue = 0;
const counter = document.getElementById('counter');
const resetButton = document.getElementById('resetButton');

const cardSlider = document.getElementById('cardSlider');
const countDisplay = document.getElementById('countDisplay');
cardSlider.addEventListener('input', updateCountDisplay);

function updateCountDisplay() {
  const value = cardSlider.value;
  countDisplay.textContent = value;
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

function startGame() {
  maxCards = parseInt(cardSlider.value);
  const colors = shuffle(colorSelector(maxCards));
  createCards(colors);

resetButton.addEventListener('click', resetGame);
}

/* SHUFFLE */
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/* COLORS */

function colorSelector(maxCards) {
  const colorCache = [];
  for (let i = 0; i < maxCards / 2; i++) {
    const randomColor = getRandomColor();
    colorCache.push(randomColor);
    colorCache.push(randomColor);
  }
  return colorCache;
}

function getRandomColor() {
  const characters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random()*16)];
  }
  return color;
}

/* GAME SETUP */

createCards(colors);

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  gameBoard.innerHTML = '';
  let cardsAdded = 0;

  for (let color of colors) {
    if (cardsAdded >= maxCards) {
      break;
    }

    const card = document.createElement('div');
    card.classList.add('card');

    const frontFace = document.createElement('div');
    frontFace.classList.add('front-face');
    frontFace.style.backgroundColor = color;
    card.setAttribute('data-color', color);

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', handleCardClick);

    gameBoard.appendChild(card);
    cardsAdded++;
  }
}

function handleCardClick(e) {
  console.log('card clicked: ', e);
  if (flippedCards.length % 2 === 0) {
    incrementCounter();
  }
  flipCard(e);
}

/* INTERACTIONS */

function flipCard(e) {
  const card = e.currentTarget;

  if (
    card.classList.contains('selected') ||
    card.classList.contains('matched') ||
    flippedCards.length >= 2
  ) {
    return;
  }

  card.classList.toggle('flipped');
  card.classList.add('selected');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];
  const firstCardColor = firstCard.getAttribute('data-color');
  const secondCardColor = secondCard.getAttribute('data-color');

  if (firstCardColor === secondCardColor) {
    console.log('match');
    lockCards();
  } else {
    console.log('no match');
    setTimeout(unFlipCards, 1000);
  }
}

function lockCards() {
  flippedCards.forEach(card => {
    card.classList.add('matched');
  });

  flippedCards = [];
}

function unFlipCards() {
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];

  firstCard.classList.remove('selected');
  secondCard.classList.remove('selected');
  flippedCards = [];

  firstCard.classList.remove('flipped');
  secondCard.classList.remove('flipped');
}

function incrementCounter() {
  counterValue++;
  counter.textContent = counterValue;
}

// function resetGame() {
//   flippedCards = [];

//   const cards = document.getElementsByClassName('card');
//   for (let i = 0; i < cards.length; i++) {
//     const card = cards[i];
//     card.classList.remove('selected');
//     card.classList.remove('matched');
//     card.classList.remove('flipped');
//     counterValue = 0;
//     counter.textContent = 0;
//   }
// }

function resetGame() {
  const gameBoard = document.getElementById("game");
  gameBoard.innerHTML = '';

  maxCards = parseInt(cardSlider.value);
  const colors = shuffle(colorSelector(maxCards));
  createCards(colors);

  flippedCards = [];
  counterValue = 0;
  counter.textContent = counterValue;
}
