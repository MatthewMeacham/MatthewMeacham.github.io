const canvas = document.getElementById('uncover-canvas');
const context = canvas.getContext('2d');

window.uncover = {};
window.uncover.canvas = canvas;

const GameStatus = {
	PLAYING: 1,
	PAUSED: 2,
	GAME_OVER: 3,
	GAME_WON: 4
}

let player;
const numberOfEnemies = 2;
let enemies;

let backgroundImage;

const gameGridSize = 50;
let gameGrid;

function initialize() {
	gameGrid = new GameGrid(gameGridSize);
	window.uncover.gameGrid = gameGrid;

	player = new GridPlayer(gameGridSize / 2, 0);
	window.uncover.player = player;

	window.uncover.gameStatus = GameStatus.PLAYING;

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

	if (window.uncover.gameStatus === GameStatus.GAME_WON) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Game Won!", canvas.width / 2 - 140, canvas.height / 2 - 10);
		context.font = "42px Verdana"
		context.fillText("Thanks for uncovering", 10, canvas.height / 2 + 50);
		context.fillText("info about me", 110, canvas.height / 2 + 90);
	} else if (window.uncover.gameStatus === GameStatus.GAME_OVER) {
		context.font = "48px Verdana";
		context.fillStyle = "red";
		context.fillText("Game Over!", canvas.width / 2 - 140, canvas.height / 2 - 10);
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
		if (window.uncover.gameStatus === GameStatus.PAUSED) {
			window.uncover.gameStatus = GameStatus.PLAYING;
		} else if (window.uncover.gameStatus !== GameStatus.GAME_OVER && window.uncover.gameStatus !== GameStatus.GAME_WON) {
			window.uncover.gameStatus = GameStatus.PAUSED;
		}
	} else if (e.key === 'r') {
		window.uncover.gameStatus = GameStatus.PAUSED;
		initialize();
		window.uncover.gameStatus = GameStatus.PLAYING;
	}
}

function keyUpHandler(e) {
	player.keyUpHandler(e)
}

function randomIntegerInRangeInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

initialize();

render();
let tickInterval = setInterval(tick, 30);