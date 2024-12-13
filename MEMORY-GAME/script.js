let cardArrray = [
    {name: 'fries', img: 'images/fries.png'},
    {name: 'cheeseburger', img: 'images/cheeseburger.png'},
    {name: 'hotdog', img: 'images/hotdog.png'},
    {name: 'ice-cream', img: 'images/ice-cream.png'},
    {name: 'milkshake', img: 'images/milkshake.png'},
    {name: 'pizza', img: 'images/pizza.png'},
    {name: 'fries', img: 'images/fries.png'},
    {name: 'cheeseburger', img: 'images/cheeseburger.png'},
    {name: 'hotdog', img: 'images/hotdog.png'},
    {name: 'ice-cream', img: 'images/ice-cream.png'},
    {name: 'milkshake', img: 'images/milkshake.png'},
    {name: 'pizza', img: 'images/pizza.png'}
];

let cardsChosen = [];
let cardsChosenIds = [];
const cardsWon = [];
let timerInterval;
let seconds = 0;
let bestTime = localStorage.getItem('bestTime') || Infinity; 

const gridDisplay = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result');
const timerDisplay = document.querySelector('#timer');
const bestTimeDisplay = document.querySelector('#best-time');
const difficultySelect = document.querySelector('#difficulty');

bestTimeDisplay.textContent = bestTime === Infinity ? '--' : bestTime;

difficultySelect.addEventListener('change', setDifficulty);

function setDifficulty() {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        cardArrray = [...cardArrray.slice(0, 6)];
    } else if (difficulty === 'medium') {
        cardArrray = [...cardArrray.slice(0, 8)];
    } else if (difficulty === 'hard') {
        cardArrray = [...cardArrray.slice(0, 10)];
    }
    cardArrray = [...cardArrray, ...cardArrray]; 
    cardArrray.sort(() => 0.5 - Math.random()); 
    createBoard();
}

function createBoard() {
    gridDisplay.innerHTML = ''; 
    for (let i = 0; i < cardArrray.length; i++) {
        const card = document.createElement('img');
        card.setAttribute('src', 'images/blank.png');
        card.setAttribute('data-id', i);
        card.addEventListener('click', flipCard);
        gridDisplay.appendChild(card);
    }
}

function flipCard() {
    const cardId = this.getAttribute('data-id');
    if (cardsChosenIds.includes(cardId)) return; 

    this.setAttribute('src', cardArrray[cardId].img);
    this.classList.add('flipped');
    cardsChosen.push(cardArrray[cardId].name);
    cardsChosenIds.push(cardId);

    if (cardsChosen.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const cards = document.querySelectorAll('img');
    const optionOneId = cardsChosenIds[0];
    const optionTwoId = cardsChosenIds[1];

    if (cardsChosen[0] === cardsChosen[1]) {
        cards[optionOneId].removeEventListener('click', flipCard);
        cards[optionTwoId].removeEventListener('click', flipCard);
        cardsWon.push(cardsChosen);
    } else {
        cards[optionOneId].setAttribute('src', 'images/blank.png');
        cards[optionTwoId].setAttribute('src', 'images/blank.png');
        cards[optionOneId].classList.remove('flipped');
        cards[optionTwoId].classList.remove('flipped');
    }

    cardsChosen = [];
    cardsChosenIds = [];
    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === cardArrray.length / 2) {
        clearInterval(timerInterval);
        resultDisplay.textContent = 'Congratulations! You found all pairs!';
        saveBestTime();
    }
}

function startTimer() {
    seconds = 0;
    timerDisplay.textContent = seconds;
    timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

function saveBestTime() {
    if (seconds < bestTime) {
        bestTime = seconds;
        localStorage.setItem('bestTime', bestTime);
        bestTimeDisplay.textContent = bestTime;
    }
}

createBoard();
startTimer(); 