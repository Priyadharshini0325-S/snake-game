
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const gameOverDisplay = document.getElementById('game-over');
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameSpeed = 150; 
let gameRunning = false;
let gameInterval;
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.addEventListener('keydown', changeDirection);
function generateFood() {
    let foodPosition;

    while (!foodPosition || snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y)) {
        foodPosition = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
    }
    
    return foodPosition;
}
function changeDirection(e) {
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
}
function gameLoop() {
    direction = nextDirection;
    const head = {x: snake[0].x, y: snake[0].y};
    switch(direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    if (
        head.x < 0 || head.x >= TILE_COUNT ||
        head.y < 0 || head.y >= TILE_COUNT ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
  
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        
        food = generateFood();
        if (score % 5 === 0) {
            gameSpeed = Math.max(gameSpeed - 10, 50);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else 
        snake.pop();
    }
    drawGame();
}

function drawGame() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#8BC34A'; // Head is darker green
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.strokeStyle = '#45a049';
        ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
    const radius = GRID_SIZE / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(gameLoop, gameSpeed);
        document.getElementById('start-btn').textContent = 'Pause';
    } else {
        gameRunning = false;
        clearInterval(gameInterval);
        document.getElementById('start-btn').textContent = 'Resume';
    }
}
function resetGame() {
    clearInterval(gameInterval);
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameSpeed = 150;
    gameRunning = false;
    scoreDisplay.textContent = `Score: ${score}`;
    document.getElementById('start-btn').textContent = 'Start Game';
    gameOverDisplay.style.display = 'none';
    drawGame();
}
function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    finalScoreDisplay.textContent = `Your score: ${score}`;
    gameOverDisplay.style.display = 'block';
}
function restartGame() {
    resetGame();
    startGame();
}

drawGame();