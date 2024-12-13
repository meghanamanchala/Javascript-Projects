const squares = document.querySelectorAll('.square');
const scoreDisplay = document.querySelector('#score');
const timeLeft = document.querySelector('#time-left');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let countDownTimerId = null;
let moleSpeed = 500;

function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole', 'bonus'); 
  });

  let randomSquare = squares[Math.floor(Math.random() * 9)];
  const isBonusMole = Math.random() < 0.1; 

  if (isBonusMole) {
    randomSquare.classList.add('bonus');  
    hitPosition = randomSquare.id;
  } else {
    randomSquare.classList.add('mole');  
    hitPosition = randomSquare.id;
  }
}

squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (square.id == hitPosition) {
      result++;
      scoreDisplay.textContent = result;
      if (square.classList.contains('bonus')) {
        result += 2;  
        scoreDisplay.textContent = result;
      }

      hitPosition = null;
    }
  });
});

function moveMole() {
  timerId = setInterval(randomSquare, moleSpeed);
}

function increaseDifficulty() {
  if (result > 5 && moleSpeed > 400) {
    moleSpeed -= 50; 
    clearInterval(timerId); 
    moveMole();  
  }

  if (result > 10 && moleSpeed > 300) {
    moleSpeed -= 50;
    clearInterval(timerId);
    moveMole();
  }

  if (result > 20 && moleSpeed > 200) {
    moleSpeed -= 50;
    clearInterval(timerId);
    moveMole();
  }
}

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime == 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert('GAME OVER! Your final score is ' + result);
  }
}

countDownTimerId = setInterval(countDown, 1000);
moveMole();
setInterval(increaseDifficulty, 1000);
