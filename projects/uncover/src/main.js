const canvas = document.getElementById('uncover-canvas');
const context = canvas.getContext('2d');

window.uncover = {};
window.uncover.canvas = canvas;

let paused = false;

let player;
const numberOfBalls = 2;
let balls = [];

let backgroundImage;

const gameGridSize = 50;
let gameGrid;

function initialize() {
	gameGrid = new GameGrid(gameGridSize);
	window.uncover.gameGrid = gameGrid;

	player = new GridPlayer(gameGridSize / 2, 0);

	/*
	for (let i = 0; i < numberOfBalls; i++) {
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		balls.push(new Ball(x, y, 10));
	}

	backgroundImage = document.getElementById('uncover-image');
	*/

	initializeKeyListeners();
}

function initializeKeyListeners() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	// Background Image TODO
	/*
	context.save();
	for (uncoveredAreaVertices of player.uncoveredAreas) {
		context.beginPath();
		context.moveTo(uncoveredAreaVertices[0].x, uncoveredAreaVertices[0].y);
		for (let i = 1; i < uncoveredAreaVertices.length; i++) {
			context.lineTo(uncoveredAreaVertices[i].x, uncoveredAreaVertices[i].y);
		}
		context.closePath();
		
		context.clip();

		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

		context.restore();
		context.save();
	}
	context.restore();
	*/

	gameGrid.render(context);
	player.render(context);

	for (ball of balls) {
		ball.render(context);
	}

	context.font = "16px Verdana";
    context.fillStyle = "black";
	context.fillText("Lives: " + player.lives, canvas.width - 70, 20);

	if (paused) {
		context.font = "48px Verdana";
		context.fillStyle = "black";
		context.fillText("Paused", canvas.width / 2 - 80, canvas.height / 2 - 10);
	}
	
	requestAnimationFrame(render);
}

function tick() {
	if (!paused) {
		player.tick();

		for (ball of balls) {
			ball.tick();
		}
	}
}

function gameOver() {
	clearInterval(tick);
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