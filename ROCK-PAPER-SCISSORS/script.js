const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result')
const winSound = new Audio('win.mp3')
const loseSound = new Audio('lose.mp3');
const tieSound = new Audio('tie.wav');


const possibleChoices = document.querySelectorAll('button')

let userChoice
let computerChoice
let result
let wins = 0;
let losses = 0;
let ties = 0;

const winDisplay = document.getElementById('wins');
const lossDisplay = document.getElementById('losses');
const tieDisplay = document.getElementById('ties');

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click',(e)=>{
    userChoice = e.target.id
    userChoiceDisplay.innerHTML = userChoice
    generateComputerChoice()
    getResult()
    updateScore()
}))

function generateComputerChoice(){
    const randomNumber = Math.floor(Math.random()*3) + 1
    if(randomNumber == 1){
        computerChoice = 'rock'
    }
    if(randomNumber == 2){
        computerChoice = 'scissors'
    }
    if(randomNumber == 3){
        computerChoice = 'paper'
    }
    computerChoiceDisplay.innerHTML = computerChoice
}

function getResult(){
    if (userChoice === computerChoice) {
        result = "It's a tie!";
        tieSound.play();
        ties++;
      } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'scissors' && computerChoice === 'paper') ||
        (userChoice === 'paper' && computerChoice === 'rock')
      ) {
        result = "You win!";
        winSound.play();
        wins++;
      } else {
        result = "You lose!";
        loseSound.play();
        losses++;
      }
      resultDisplay.innerHTML = result;
}

function updateScore() {
  winDisplay.innerHTML = `Wins: ${wins}`;
  lossDisplay.innerHTML = `Losses: ${losses}`;
  tieDisplay.innerHTML = `Ties: ${ties}`;
}