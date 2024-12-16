const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = -2
let yDirection = 2

const ballHitSound = new Audio('ball-hit.mp3');
const brickHitSound = new Audio('brick-hit.mp3');
const levelCompleteSound = new Audio('level-complete.mp3');


const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let timerId
let score = 0
let lives = 3 // Player starts with 3 lives

// Power-ups array
let powerUps = []

// Block class
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

// Power-up class
class PowerUp {
  constructor(xAxis, yAxis, type) {
    this.position = [xAxis, yAxis]
    this.type = type // Type of power-up (e.g., 'increasePaddle', 'increaseBallSpeed', 'extraLife')
  }
}

// Blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

// Draw blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'
    grid.appendChild(block)
  }
}
addBlocks()

// Add user (paddle)
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

// Add ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

// Move user (paddle)
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10
        drawUser()
      }
      break
    case 'ArrowRight':
      if (currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10
        drawUser()
      }
      break
  }
}
document.addEventListener('keydown', moveUser)

// Draw user (paddle)
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
  user.style.width = blockWidth + 'px'; // Set paddle width dynamically
}

// Draw ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// Move ball
function moveBall() {
  ballCurrentPosition[0] += xDirection
  ballCurrentPosition[1] += yDirection
  drawBall()
  checkForCollisions()
}
timerId = setInterval(moveBall, 20)  // Increased speed by decreasing interval

// Check for collisions
function checkForCollisions() {
  // Block collision detection
  for (let i = 0; i < blocks.length; i++) {
    if (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i, 1)
      brickHitSound.play();

      // Randomly generate a power-up when a block is destroyed
      if (Math.random() < 0.3) { // 30% chance to spawn a power-up
        const powerUpType = ['increasePaddle', 'increaseBallSpeed', 'extraLife'][Math.floor(Math.random() * 3)]
        const powerUp = new PowerUp(blocks[i].bottomLeft[0] + blockWidth / 2, blocks[i].bottomLeft[1] + blockHeight, powerUpType)
        powerUps.push(powerUp)
        drawPowerUp(powerUp)
      }

      changeDirection()
      score++
      scoreDisplay.innerHTML = score

      if (blocks.length == 0) {
        levelCompleteSound.play();
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
    }
  }

  // Wall collision detection
  if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0) {
    xDirection = -xDirection
    ballHitSound.play();  
  }

  if (ballCurrentPosition[1] >= (boardHeight - ballDiameter) || ballCurrentPosition[1] <= 0) {
    yDirection = -yDirection
    ballHitSound.play();
  }

  // User collision detection (paddle collision)
  if (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] + ballDiameter > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
  ) {
    yDirection = -yDirection
    ballHitSound.play();
  }

  // Check for power-up collection
  for (let i = 0; i < powerUps.length; i++) {
    const powerUp = powerUps[i]
    if (
      ballCurrentPosition[0] > powerUp.position[0] && ballCurrentPosition[0] < powerUp.position[0] + 20 &&
      ballCurrentPosition[1] > powerUp.position[1] && ballCurrentPosition[1] < powerUp.position[1] + 20
    ) {
      applyPowerUp(powerUp)
      powerUps.splice(i, 1) // Remove power-up after collection
      document.querySelectorAll('.power-up')[i].remove() // Remove power-up element from DOM
    }
  }

  // Game over detection
  if (ballCurrentPosition[1] <= 0) {
    lives--
    if (lives > 0) {
      scoreDisplay.innerHTML = `You Lose a Life! Lives: ${lives}`
      resetBall()
    } else {
      clearInterval(timerId)
      scoreDisplay.innerHTML = 'Game Over!'
      document.removeEventListener('keydown', moveUser)
    }
  }
}

// Draw power-up
function drawPowerUp(powerUp) {
  const powerUpDiv = document.createElement('div')
  powerUpDiv.classList.add('power-up')
  powerUpDiv.style.left = powerUp.position[0] + 'px'
  powerUpDiv.style.bottom = powerUp.position[1] + 'px'
  grid.appendChild(powerUpDiv)
}

// Ball reset
function resetBall() {
  ballCurrentPosition = [270, 40]
  xDirection = -2
  yDirection = 2
  drawBall()
}

// Change direction
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
    return
  }
}
