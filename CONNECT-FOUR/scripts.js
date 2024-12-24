document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid .cell');
  const result = document.querySelector('#result');
  const displayCurrentPlayer = document.querySelector('#current-player');
  const playerOneScore = document.querySelector('#player-one-score');
  const playerTwoScore = document.querySelector('#player-two-score');
  let currentPlayer = 1;
  let scores = { playerOne: 0, playerTwo: 0 };

  const winningArrays = [
    [0, 1, 2, 3], [7, 8, 9, 10], [14, 15, 16, 17], [21, 22, 23, 24], [28, 29, 30, 31], [35, 36, 37, 38],
    [0, 7, 14, 21], [1, 8, 15, 22], [2, 9, 16, 23], [3, 10, 17, 24], [4, 11, 18, 25], [5, 12, 19, 26],
    [0, 8, 16, 24], [7, 15, 23, 31], [14, 22, 30, 38], [21, 29, 37, 41]
  ];

  // Check for win condition
  function checkBoard() {
    for (let y = 0; y < winningArrays.length; y++) {
      const [square1, square2, square3, square4] = winningArrays[y].map(index => squares[index]);
      
      if (
        square1.classList.contains('player-one') &&
        square2.classList.contains('player-one') &&
        square3.classList.contains('player-one') &&
        square4.classList.contains('player-one')
      ) {
        result.innerHTML = 'Player One Wins!';
        scores.playerOne++;
        playerOneScore.innerHTML = scores.playerOne;
        return true;
      }

      if (
        square1.classList.contains('player-two') &&
        square2.classList.contains('player-two') &&
        square3.classList.contains('player-two') &&
        square4.classList.contains('player-two')
      ) {
        result.innerHTML = 'Player Two Wins!';
        scores.playerTwo++;
        playerTwoScore.innerHTML = scores.playerTwo;
        return true;
      }
    }
    return false;
  }

  // Drop disc and animate
  function dropDisc(i, player) {
    const square = squares[i];
    const disc = document.createElement('div');
    disc.classList.add('disc', player);
    square.appendChild(disc);

    // Mark the square as taken
    square.classList.add('taken');
    square.classList.add(player);
  }

  // AI Move Logic
  function aiMove() {
    const availableMoves = [];
    const winningMove = findWinningMove('player-two');
    const blockMove = findWinningMove('player-one');

    // If AI can win, play the winning move
    if (winningMove !== -1) {
      dropDisc(winningMove, 'player-two');
      currentPlayer = 1;
      displayCurrentPlayer.innerHTML = currentPlayer;
      checkBoard();
      return;
    }

    // If the player is about to win, block their winning move
    if (blockMove !== -1) {
      dropDisc(blockMove, 'player-two');
      currentPlayer = 1;
      displayCurrentPlayer.innerHTML = currentPlayer;
      checkBoard();
      return;
    }

    // Otherwise, make a strategic move by prioritizing the center columns
    const preferredColumns = [3, 4, 5, 6]; // Center columns in a 7-column grid
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i].classList.contains('taken')) {
        availableMoves.push(i);
      }
    }

    // AI prefers the center column for more flexibility
    let move = preferredColumns.find(col => availableMoves.includes(col));

    // If no preferred column is available, choose randomly
    if (!move) {
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    dropDisc(move, 'player-two');
    currentPlayer = 1;
    displayCurrentPlayer.innerHTML = currentPlayer;
    checkBoard();
  }

  // Find a winning move for the given player
  function findWinningMove(player) {
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i].classList.contains('taken')) {
        squares[i].classList.add(player); // Temporarily add the player's disc
        if (checkBoard()) {
          squares[i].classList.remove(player); // Remove the disc after checking
          return i;
        }
        squares[i].classList.remove(player); // Remove the disc if not a winning move
      }
    }
    return -1; // No winning move found
  }

  // Timer functionality
  let timer;
  function startTimer() {
    let timeLeft = 10; // 10 seconds per turn
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
      } else {
        clearInterval(timer);
        changePlayer();
      }
    }, 1000);
  }

  // Change player turn
  function changePlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayCurrentPlayer.innerHTML = currentPlayer;

    if (currentPlayer === 2) {
      aiMove();
    } else {
      startTimer();
    }
  }

  // Game flow
  for (let i = 0; i < squares.length; i++) {
    squares[i].onclick = () => {
      if (!squares[i].classList.contains('taken') && currentPlayer === 1) {
        dropDisc(i, 'player-one');
        checkBoard();
        changePlayer();
      }
    };
  }

  startTimer();
});