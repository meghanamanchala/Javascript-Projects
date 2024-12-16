document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const squares = [];
  const result = document.querySelector('#result');
  const timerDisplay = document.querySelector('#timer');
  const displayCurrentPlayer = document.querySelector('#current-player');
  
  const rows = 6;
  const cols = 7;
  let currentPlayer = 1;
  let gameActive = true;
  let timer;
  let timeLeft = 10;

  function createGrid() {
    for (let i = 0; i < rows * cols; i++) {
      const square = document.createElement('div');
      grid.appendChild(square);
      squares.push(square);
    }
  }

  const winningArrays = [
  ];

  createGrid();

  function checkWinner() {
    for (let i = 0; i < winningArrays.length; i++) {
      const [a, b, c, d] = winningArrays[i];
      if (squares[a].classList.contains('player-one') && 
          squares[b].classList.contains('player-one') && 
          squares[c].classList.contains('player-one') && 
          squares[d].classList.contains('player-one')) {
        result.textContent = 'Player One Wins!';
        gameActive = false;
        clearInterval(timer);
        return;
      }
      if (squares[a].classList.contains('player-two') && 
          squares[b].classList.contains('player-two') && 
          squares[c].classList.contains('player-two') && 
          squares[d].classList.contains('player-two')) {
        result.textContent = 'Player Two Wins!';
        gameActive = false;
        clearInterval(timer);
        return;
      }
    }
  }

  function dropPiece(column, playerClass) {
    for (let i = column + (rows - 1) * cols; i >= column; i -= cols) {
      if (!squares[i].classList.contains('taken')) {
        squares[i].classList.add('taken');
        squares[i].classList.add(playerClass);
        squares[i].style.transform = 'translateY(100px)';
        setTimeout(() => {
          squares[i].style.transform = '';
          checkWinner();
        }, 500);
        return;
      }
    }
  }

  function startTimer() {
    timeLeft = 10;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        nextPlayer();
      }
    }, 1000);
  }

  function nextPlayer() {
    if (currentPlayer === 1) {
      currentPlayer = 2;
      displayCurrentPlayer.textContent = `Current Player: 2`;
      startTimer();
      aiMove();
    } else {
      currentPlayer = 1;
      displayCurrentPlayer.textContent = `Current Player: 1`;
      startTimer();
    }
  }

  function aiMove() {
    let validMove = false;
    while (!validMove) {
      const column = Math.floor(Math.random() * cols);
      for (let i = column + (rows - 1) * cols; i >= column; i -= cols) {
        if (!squares[i].classList.contains('taken')) {
          dropPiece(column, 'player-two');
          validMove = true;
          nextPlayer();
          break;
        }
      }
    }
  }

  squares.forEach((square, index) => {
    square.addEventListener('click', () => {
      if (gameActive && currentPlayer === 1 && !square.classList.contains('taken')) {
        const column = index % cols;
        dropPiece(column, 'player-one');
        nextPlayer();
      }
    });
  });

  startTimer();
});
