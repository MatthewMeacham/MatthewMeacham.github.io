const canvas = document.getElementById('uncover-canvas');
const context = canvas.getContext('2d');

window.uncover = {};
window.uncover.canvas = canvas;

let paused = false;
let gameOver = false;
let gameWon = false;

let player;
const numberOfEnemies = 2;
let enemies = [];

let backgroundImage;

const gameGridSize = 50;
let gameGrid;

function initialize() {
	gameGrid = new GameGrid(gameGridSize);
	window.uncover.gameGrid = gameGrid;

	player = new GridPlayer(gameGridSize / 2, 0);
	window.uncover.player = player;

	for (let i = 0; i < numberOfEnemies; i++) {
		const gridX = randomIntegerInRangeInclusive(0, gameGridSize);
		const gridY = gameGridSize - 1;
		
		enemies.push(new GridEnemy(gridX, gridY));
	}

	initializeKeyListeners();
}

function randomIntegerInRangeInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function initializeKeyListeners() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	gameGrid.render(context);
	player.render(context);

	for (enemy of enemies) {
		enemy.render(context);
	}

	context.font = "16px Verdana";
    context.fillStyle = "black";
	context.fillText("Lives: " + player.lives, canvas.width - 70, 20);

	if (gameWon) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Game Won!", canvas.width / 2 - 140, canvas.height / 2 - 10);
		context.font = "42px Verdana"
		context.fillText("Thanks for uncovering", 10, canvas.height / 2 + 50);
		context.fillText("info about me", 110, canvas.height / 2 + 90);
	} else if (gameOver) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Game Over!", canvas.width / 2 - 140, canvas.height / 2 - 10);
	} else if (paused) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Paused", canvas.width / 2 - 80, canvas.height / 2 - 10);
	}
	
	requestAnimationFrame(render);
}

function tick() {
	if (!paused && !gameOver && !gameWon) {
		gameGrid.tick();
		player.tick();
		
		for (enemy of enemies) {
			enemy.tick();
		}
	}
}

function keyDownHandler(e) {
	player.keyDownHandler(e);

	if (e.key === 'Escape' || e.key === 'Esc' || e.key === ' ') {
		paused = !paused;
	}
}

function keyUpHandler(e) {
	player.keyUpHandler(e)
}

initialize();

render();
let tickInterval = setInterval(tick, 30);