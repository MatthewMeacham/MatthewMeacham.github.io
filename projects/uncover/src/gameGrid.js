const GridType = {
	EMPTY: 0,
	FILLED: 1
};

class GameGrid {
	constructor(gridSize) {
		this.grid = new Array(gridSize);
		for (let i = 0; i < this.grid.length; i++) {
			this.grid[i] = new Array(gridSize);

			for (let j = 0; j < this.grid[i].length; j++) {
				if (i == 0 || i == this.grid.length - 1 || j == 0 || j == this.grid[i].length - 1) {
					this.grid[i][j] = GridType.FILLED;
				} else {
					this.grid[i][j] = GridType.EMPTY;
				}
			}	
		}

		this.gridSize = gridSize;
		this.cellRenderSize = window.uncover.canvas.width / gridSize;

		this._backgroundImage = document.getElementById('uncover-image');
	}

	render(context) {
		// Cells
		for (let x = 0; x < this.grid.length; x++) {
			for (let y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y] === GridType.FILLED) {
					const clippingX = this._backgroundImage.width / this.gridSize * x;
					const clippingY = this._backgroundImage.height / this.gridSize * y; 
					const clippingWidth = this._backgroundImage.width / this.gridSize;
					const clippingHeight = this._backgroundImage.height / this.gridSize;
					context.drawImage(this._backgroundImage, clippingX, clippingY, clippingWidth, clippingHeight, x * this.cellRenderSize, y * this.cellRenderSize, this.cellRenderSize, this.cellRenderSize);

					/*
					context.beginPath();
					context.rect(x * this.cellRenderSize, y * this.cellRenderSize, this.cellRenderSize, this.cellRenderSize);
					context.fillStyle = 'blue';
					context.fill();
					context.closePath();
					*/
				}
			}
		}

		// Lines
		if (window.uncover.gameStatus !== GameStatus.GAME_WON) {
			for (let x = 0; x < this.grid.length; x++) {
				// Horizontal Lines
				context.beginPath();
				context.moveTo(0, x * this.cellRenderSize);
				context.lineTo(window.uncover.canvas.width, x * this.cellRenderSize);
				context.strokeStyle = 'black';
				context.lineWidth = 0.5;
				context.stroke();
				context.closePath();
	
				// Verticle Lines
				context.beginPath();
				context.moveTo(x * this.cellRenderSize, 0);
				context.lineTo(x * this.cellRenderSize, window.uncover.canvas.height);
				context.strokeStyle = 'black';
				context.lineWidth = 0.5;
				context.stroke();
				context.closePath();
			}
		}
	}

	tick() {
		this._checkForWin();
	}

	_checkForWin() {
		for(let x = 0; x < this.grid.length; x++) {
			for (let y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y] === GridType.EMPTY) {
					return;
				}
			}
		}

		window.uncover.gameStatus = GameStatus.GAME_WON;
	}

	fill(x, y) {
		this.grid[x][y] = GridType.FILLED;
	}


	floodFill(startingX, startingY) {
		this._floodFillGrid(this.grid, startingX, startingY);
	}

	countTilesThatWouldBeFlooded(startingX, startingY) {
		if (startingX < 0 || startingX >= this.gridSize || startingY < 0 || startingY >= this.gridSize) return 0;
		if (this.grid[startingX][startingY] !== GridType.EMPTY) return 0;

		let gridCopy = this._deepCopyGrid();
		this._floodFillGrid(gridCopy, startingX, startingY);

		let count = 0;
		for (let x = 0; x < this.grid.length; x++) {
			for (let y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y] !== gridCopy[x][y]) {
					count++;
				}
			}
		}
		
		return count;
	}

	_floodFillGrid(grid, startingX, startingY) {
		let queue = [];
		if (grid[startingX][startingY] !== GridType.EMPTY) return;

		queue.push({ x: startingX, y: startingY });
		while (queue.length > 0) {
			let node = queue.shift();

			let west = { ...node };
			let east = { ...node };

			west.x--;
			while (west.x > 0 && grid[west.x][west.y] === GridType.EMPTY) {
				west.x--;
			}

			east.x++;
			while (east.x > 0 && grid[east.x][east.y] === GridType.EMPTY) {
				east.x++;
			}

			for (let x = west.x + 1; x < east.x; x++) {
				if (grid[x][west.y] === GridType.EMPTY) {
					grid[x][west.y] = GridType.FILLED;
				}

				if (grid[x][west.y - 1] === GridType.EMPTY) {
					queue.push({ x: x, y: west.y - 1 });
				}

				if(grid[x][west.y + 1] === GridType.EMPTY) {
					queue.push({ x: x, y: west.y + 1 });
				}
			}
		}
	}

	/*
				// target-color = EMPTY
			// replacement-color = FILLED

		Flood-fill (node, target-color, replacement-color):
			1. Set Q to the empty queue.
			2. If the color of node is not equal to target-color, return.
			3. Add node to the end of Q.
			4. For each element n of Q:
			5.  Set w and e equal to n.
			6.  Move w to the west until the color of the node to the west of w no longer matches target-color.
			7.  Move e to the east until the color of the node to the east of e no longer matches target-color.
			8.  Set the color of nodes between w and e to replacement-color.
			9.  For each node n between w and e:
			10.   If the color of the node to the north of n is target-color, add that node to the end of Q.
				If the color of the node to the south of n is target-color, add that node to the end of Q.
			11. Continue looping until Q is exhausted.
			12. Return.
	*/

	_deepCopyGrid() {
		let gridCopy = new Array(this.gridSize);
		for (let i = 0; i < gridCopy.length; i++) {
			gridCopy[i] = new Array(this.gridSize);

			for (let j = 0; j < gridCopy[i].length; j++) {
				gridCopy[i][j] = this.grid[i][j];
			}
		}

		return gridCopy;
	}

}