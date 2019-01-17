const canvas = document.getElementById('uncover-canvas');
const context = canvas.getContext('2d');

window.uncover = {};
window.uncover.canvas = canvas;

const GameStatus = {
	PLAYING: 1,
	PAUSED: 2,
	GAME_OVER: 3,
	GAME_WON: 4,
	INTRODUCTION: 5
}

let player;
const numberOfEnemies = 2;
let enemies;

let backgroundImage;

const gameGridSize = 50;
let gameGrid;

let tickInterval;

function initialize() {
	gameGrid = new GameGrid(gameGridSize);
	window.uncover.gameGrid = gameGrid;

	player = new GridPlayer(gameGridSize / 2, 0);
	window.uncover.player = player;

	window.uncover.gameStatus = GameStatus.INTRODUCTION;

	enemies = [];
	for (let i = 0; i < numberOfEnemies; i++) {
		const gridX = randomIntegerInRangeInclusive(0, gameGridSize);
		const gridY = gameGridSize - 1;
		
		enemies.push(new GridEnemy(gridX, gridY));
	}

	initializeKeyListeners();
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	gameGrid.render(context);
	
	if (window.uncover.gameStatus !== GameStatus.GAME_WON) {
		player.render(context);

		for (enemy of enemies) {
			enemy.render(context);
		}
	}

	if (window.uncover.gameStatus === GameStatus.INTRODUCTION) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Click here and", canvas.width / 2 - 170, canvas.height / 2 - 10);
		context.fillText("press space to begin", canvas.width / 2 - 250, canvas.height / 2 + 40);
	} else if (window.uncover.gameStatus === GameStatus.GAME_WON) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Game Won!", canvas.width / 2 - 140, canvas.height / 2 - 10);

		context.font = "42px Verdana"
		context.fillStyle = "red";
		context.fillText("Thanks for uncovering", canvas.width / 2 - 250, canvas.height / 2 + 50);
		context.fillText("info about me", canvas.width / 2 - 150, canvas.height / 2 + 90);
		context.fillText("See below for details", canvas.width / 2 - 225, canvas.height / 2 + 130);
	} else if (window.uncover.gameStatus === GameStatus.GAME_OVER) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Game Over!", canvas.width / 2 - 140, canvas.height / 2 - 10);

		context.font = "42px Verdana"
		context.fillText("Press 'R' to restart!", canvas.width / 2 - 200, canvas.height / 2 + 40);
	} else if (window.uncover.gameStatus === GameStatus.PAUSED) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Paused", canvas.width / 2 - 80, canvas.height / 2 - 10);
	}
	
	requestAnimationFrame(render);
}

function tick() {
	if (window.uncover.gameStatus === GameStatus.PLAYING) {
		gameGrid.tick();
		player.tick();
		
		for (enemy of enemies) {
			enemy.tick();
		}
	}
}

function initializeKeyListeners() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}

function keyDownHandler(e) {
	player.keyDownHandler(e);

	if (e.key === 'Escape' || e.key === 'Esc' || e.key === ' ') {
		e.preventDefault();
		if (window.uncover.gameStatus === GameStatus.INTRODUCTION) {
			gameStart();
		} else if (window.uncover.gameStatus === GameStatus.PAUSED) {
			tickInterval = setInterval(tick, 30);
			window.uncover.gameStatus = GameStatus.PLAYING;
		} else if (window.uncover.gameStatus !== GameStatus.GAME_OVER && window.uncover.gameStatus !== GameStatus.GAME_WON) {
			clearInterval(tickInterval);
			window.uncover.gameStatus = GameStatus.PAUSED;
		}
	} else if (e.key === 'r') {
		restart();
	}
}

function keyUpHandler(e) {
	player.keyUpHandler(e)
}

function randomIntegerInRangeInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function gameStart() {
	window.uncover.gameStatus = GameStatus.PLAYING;
	tickInterval = setInterval(tick, 30);
}

function gameOver() {
	window.uncover.gameStatus = GameStatus.GAME_OVER;
	clearInterval(tickInterval);
}

function gameWon() {
	window.uncover.gameStatus = GameStatus.GAME_WON;
	clearInterval(tickInterval);

	const hiddenDetails = document.getElementById('uncover-hidden-details');
	hiddenDetails.style.display = 'block';
	hiddenDetails.style.visibility = 'visible';
}

function restart() {
	window.uncover.gameStatus = GameStatus.PAUSED;
	clearInterval(tickInterval);
	initialize();
	window.uncover.gameStatus = GameStatus.INTRODUCTION;
}

initialize();
render();