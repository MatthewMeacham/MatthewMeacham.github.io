const Direction = {
	RIGHT: 1,
	LEFT: 2,
	UP: 3,
	DOWN: 4
};

class GridPlayer {
	constructor(gridX, gridY) {
		this.gridX = gridX;
		this.gridY = gridY;

		this._movingRight = false;
		this._movingLeft = false;
		this._movingUp = false;
		this._movingDown = false;

		this._color = 'orange';
	}

	render(context) {
		context.beginPath();
		context.rect(this.gridX * window.uncover.gameGrid.cellRenderSize, this.gridY * window.uncover.gameGrid.cellRenderSize, window.uncover.gameGrid.cellRenderSize, window.uncover.gameGrid.cellRenderSize);
		context.fillStyle = this._color;
		context.fill();
		context.closePath();
	}

	tick() {
		this._move();
	}

	_move() {
		let moved = false;
		let xChange = 0;
		let yChange = 0;

		if (this._movingRight) {
			if(this.gridX + 1 < window.uncover.gameGrid.gridSize) {
				this.gridX++;
				xChange = 1;
				moved = true;
			}
		} else if (this._movingLeft) {
			if (this.gridX - 1 >= 0) {
				this.gridX--;
				xChange = -1;
				moved = true;
			}
		} else if (this._movingUp) {
			if (this.gridY - 1 >= 0) {
				this.gridY--;
				yChange = -1;
				moved = true;
			}
		} else if (this._movingDown) {
			if (this.gridY + 1 < window.uncover.gameGrid.gridSize) {
				this.gridY++;
				yChange = 1;
				moved = true;
			}
		}

		if (moved) {
			if (window.uncover.gameGrid.grid[this.gridX][this.gridY] === GridType.FILLED) {
				let westCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange - 1, this.gridY - yChange);
				let eastCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange + 1, this.gridY - yChange);
				let northCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange, this.gridY - yChange - 1);
				let southCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange, this.gridY - yChange + 1);

				// TODO: DETERMINE IF WE SHOULD DO THE CORNERS
				/*
				let northWestCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange - 1, this.gridY - yChange - 1);
				let northEastCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange + 1, this.gridY - yChange - 1);
				let southWestCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange - 1, this.gridY - yChange + 1);
				let southEastCount = window.uncover.gameGrid.countTilesThatWouldBeFlooded(this.gridX - xChange + 1, this.gridY - yChange + 1);
				*/

				let northWestCount = 0;
				let northEastCount = 0;
				let southWestCount = 0;
				let southEastCount = 0;
				
				// We don't want zeroes to be picked up as the min, so set them to a max value
				if (westCount <= 0) westCount = Number.MAX_SAFE_INTEGER;
				if (eastCount <= 0) eastCount = Number.MAX_SAFE_INTEGER;
				if (northCount <= 0) northCount = Number.MAX_SAFE_INTEGER;
				if (southCount <= 0) southCount = Number.MAX_SAFE_INTEGER;
				if (northWestCount <= 0) northWestCount = Number.MAX_SAFE_INTEGER;
				if (northEastCount <= 0) northEastCount = Number.MAX_SAFE_INTEGER;
				if (southWestCount <= 0) southWestCount = Number.MAX_SAFE_INTEGER;
				if (southEastCount <= 0) southEastCount = Number.MAX_SAFE_INTEGER;

				const minCount = Math.min(westCount, eastCount, northCount, southCount, northWestCount, northEastCount, southWestCount, southEastCount);

				// If there's no tiles to fill, just return
				const isThereAnyTilesToFill = minCount < Number.MAX_SAFE_INTEGER;
				if (!isThereAnyTilesToFill) return;

				// TODO
				if (minCount > 50) return; // Refuse to fill more than 50

				if (westCount > 0 && westCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange - 1, this.gridY - yChange);
				}
				if (eastCount > 0 && eastCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange + 1, this.gridY - yChange);
				} 
				if (northCount > 0 && northCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange, this.gridY - yChange - 1);
				} 
				if (southCount > 0 && southCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange, this.gridY - yChange + 1);
				}

				if (northWestCount > 0 && northWestCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange - 1, this.gridY - yChange - 1);
				}
				if (northEastCount > 0 && northEastCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange + 1, this.gridY - yChange - 1);
				}
				if (southWestCount > 0 && southWestCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange - 1, this.gridY - yChange + 1);
				}
				if (southEastCount > 0 && southEastCount === minCount) {
					window.uncover.gameGrid.floodFill(this.gridX - xChange + 1, this.gridY - yChange + 1);
				}
			}

			window.uncover.gameGrid.fill(this.gridX, this.gridY);
		}

	}



	keyDownHandler(e) {
		if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'd') {
			this._movingRight = true;
		} else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'a') {
			this._movingLeft = true;
		} else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'w') {
			this._movingUp = true;
		} else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 's') {
			this._movingDown = true;
		}
	}

	keyUpHandler(e) {
		if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'd') {
			this._movingRight = false;
		} else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'a') {
			this._movingLeft = false;
		} else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'w') {
			this._movingUp = false;
		} else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 's') {
			this._movingDown = false;
		}
	}
}