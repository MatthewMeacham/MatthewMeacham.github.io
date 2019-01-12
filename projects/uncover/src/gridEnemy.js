const Direction = {
	RIGHT: 1,
	LEFT: 2,
	UP: 3,
	DOWN: 4
};

class GridEnemy {
	constructor(gridX, gridY) {
		this.gridX = gridX;
		this.gridY = gridY;

		this._timeLastChangedPath = new Date().getTime();
		this._baseTimeBetweenPathChanges = 1500;
		this._timeBetweenPathChanges = this._baseTimeBetweenPathChanges + randomIntegerInRangeInclusive(500, 2000);

		this._path = this._calculatePath();
		this._pathIndex = 0;

		this._color = 'red';
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
		this._pollForNewPath();
	}

	_move() {
		if (this._pathIndex < this._path.length) {
			if (Math.random() < 0.75) {
				this.gridX = this._path[this._pathIndex].x;
				this.gridY = this._path[this._pathIndex].y;
				this._pathIndex++;

				// See if the enemy is touching the player
				if (this.gridX === window.uncover.player.gridX && this.gridY === window.uncover.player.gridY) {
					window.uncover.gameStatus = GameStatus.GAME_OVER;
				}
			}
		} else {
			this._newPath();
		}
	}

	_newPath() {
		this._path = this._calculatePath();
		this._timeLastChangedPath = new Date().getTime();
		this._timeBetweenPathChanges = this._baseTimeBetweenPathChanges + randomIntegerInRangeInclusive(500, 2000);
		this._pathIndex = 0;
	}

	_pollForNewPath() {
		const timeForNewPath = new Date().getTime() - this._timeLastChangedPath > this._timeBetweenPathChanges;
		if (timeForNewPath) {
			this._newPath();
		}
	}

	// Uses A* path-finding algorithm
	_calculatePath() {
		let startNode = { x: this.gridX, y: this.gridY };
		let goalNode = { x: window.uncover.player.gridX, y: window.uncover.player.gridY };
		startNode.g = 0;
		startNode.f = Math.pow(startNode.x - goalNode.x, 2) + Math.pow(startNode.y - goalNode.y, 2);

		let openList = [startNode];
		let closedList = [];

		const neighborPositions = [{ dx: 0, dy: -1}, { dx: 1, dy: 0}, { dx: 0, dy: 1}, { dx: -1, dy: 0}];

		while (openList.length > 0) {
			// Find node with minimum f
			let currentNodeIndex = 0;
			for (let i = 1; i < openList.length; i++) {
				if (openList[i].f < openList[currentNodeIndex].f) {
					currentNodeIndex = i;
				}
			}

			let currentNode = openList[currentNodeIndex];
			openList.splice(currentNodeIndex, 1);
			closedList.push(currentNode);

			// Found the goal node, create path
			if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
				const path = [currentNode];

				let parent = currentNode.parent;
				while (parent !== undefined) {
					path.push(parent);
					parent = parent.parent;
				}

				return path.reverse();
			}

			// Create adjacent neighbors
			const neighbors = []; 
			for (let neighborPosition of neighborPositions) {
				const xPosition = currentNode.x + neighborPosition.dx;
				const yPosition = currentNode.y + neighborPosition.dy;
				if (xPosition < 0 || xPosition >= window.uncover.gameGrid.gridSize || yPosition < 0 || yPosition >= window.uncover.gameGrid.gridSize) {
					continue;
				}

				const isNeighborInClosedList = closedList.some((node) => node.x === xPosition && node.y === yPosition);
				if (isNeighborInClosedList) {
					continue;
				}

				if (window.uncover.gameGrid.grid[xPosition][yPosition] != GridType.FILLED) {
					continue;
				} 

				neighbors.push({ x: xPosition, y: yPosition, parent: currentNode });
			}

			for (let neighbor of neighbors) {
				neighbor.g = currentNode.g + 1;
				neighbor.h = Math.pow(neighbor.x - goalNode.x, 2) + Math.pow(neighbor.y - goalNode.y, 2);
				neighbor.f = neighbor.g + neighbor.h;

				const neighborInOpenListIndex = openList.findIndex((node) => node.x === neighbor.x && node.y === neighbor.y);
				const isNeighborInOpenList = neighborInOpenListIndex >= 0;
				if (isNeighborInOpenList) {
					if (neighbor.g > openList[neighborInOpenListIndex].g) {
						continue;
					}
				}
				
				openList.push(neighbor);
			}
		}

		return [];
	}
}