const Direction = {
	RIGHT: 1,
	LEFT: 2,
	UP: 3,
	DOWN: 4
};

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Player {
	
	constructor(x, y) {
		this._x = x;
		this._y = y;

		this._movementSpeed = 3;
		this._width = 25;
		this._height = 25;
		this._color = 'blue';

		this._directionMoving = undefined;
		this._directionWasMoving = undefined;
		this._lastSideHit = undefined;

		this.lives = 3;

		this.trailingLineVertices = [];
		this._trailingLineWidth = 3;
		this._trailingLineColor = 'black';

		this._addTrailingLineVertex();

		this.uncoveredAreas = [];
	}

	_addTrailingLineVertex() {
		this.trailingLineVertices.push(new Point(this._x + this._width / 2, this._y + this._height / 2));
	}

	render(context) {
		context.beginPath();
		context.rect(this._x, this._y, this._width, this._height);
		context.fillStyle = this._color;
		context.fill();
		context.closePath();

		this._renderTrailingLines(context);
	}

	_renderTrailingLines(context) {
		if (this.trailingLineVertices.length > 0) {
			context.beginPath();
			context.strokeStyle = this._trailingLineColor;
			context.lineWidth = this._trailingLineWidth;
			context.moveTo(this.trailingLineVertices[0].x, this.trailingLineVertices[0].y);
			for(let i = 1; i < this.trailingLineVertices.length; i++) {
				context.lineTo(this.trailingLineVertices[i].x, this.trailingLineVertices[i].y);
			}
			// Finish at current player position
			context.lineTo(this._x + this._width / 2, this._y + this._height / 2);

			context.stroke();
			context.closePath();
		}
	}

	tick() {
		this._move();
	}

	_move() {
		if (this._directionMoving !== this._directionWasMoving && this._directionWasMoving !== undefined) {
			this._addTrailingLineVertex();
		}

		let withinRightBound = this._x + this._width < window.uncover.canvas.width;
		let withinLeftBound = this._x > 0;
		let withinTopBound = this._y > 0;
		let withinBottomBound = this._y + this._height < window.uncover.canvas.height;

		if (this._directionMoving === Direction.RIGHT) {
			this._directionWasMoving = Direction.RIGHT;

			if (withinRightBound) {
				this._x += this._movementSpeed;
			}
		} else if (this._directionMoving === Direction.LEFT) {
			this._directionWasMoving = Direction.LEFT;

			if (withinLeftBound) {
				this._x -= this._movementSpeed;
			}
		} else if (this._directionMoving === Direction.UP) {
			this._directionWasMoving = Direction.UP;

			if (withinTopBound) {
				this._y -= this._movementSpeed;
			}
		} else if (this._directionMoving === Direction.DOWN) {
			this._directionWasMoving = Direction.DOWN;

			if (withinBottomBound) {
				this._y += this._movementSpeed;
			}
		}

		// TODO, dedupe?
		withinRightBound = this._x + this._width < window.uncover.canvas.width;
		withinLeftBound = this._x > 0;
		withinTopBound = this._y > 0;
		withinBottomBound = this._y + this._height < window.uncover.canvas.height;

		if (this._directionWasMoving !== undefined && (!withinRightBound || !withinLeftBound || !withinTopBound || !withinBottomBound)) {
			this._addUncoveredArea();
			this._lastSideHit = this._directionWasMoving;
		}
	}

	_addUncoveredArea() {
		// If the directions are the same, the person hasn't moved
		if (this._directionMoving !== undefined && this._directionWasMoving === this._directionMoving) {
			return;
		}

		this._addTrailingLineVertex();

		// Connect the vertices to form a rectangle
		if (this._directionWasMoving === Direction.LEFT) {
			console.log(`WAS MOVING LEFT, LAST SIDE HIT IS: ${this._lastSideHit}`);
			if (this._lastSideHit === Direction.RIGHT) {
				if (this.trailingLineVertices[0].y < window.uncover.canvas.height - this.trailingLineVertices[0].y) { // Clear top
					this.trailingLineVertices.push(new Point(this._width / 2, this._height / 2));
				} else { // Clear bottom
					this.trailingLineVertices.push(new Point(this._width / 2, window.uncover.canvas.height - this._height / 2));
				}
			} else {
				this.trailingLineVertices.push(new Point(this._width / 2, this.trailingLineVertices[0].y));
			}
		} else if (this._directionWasMoving === Direction.RIGHT) {
			this.trailingLineVertices.push(new Point(window.uncover.canvas.width - this._width / 2, this.trailingLineVertices[0].y));
		} else if (this._directionWasMoving === Direction.UP) {
			this.trailingLineVertices.push(new Point(this.trailingLineVertices[0].x, this._height / 2));
		} else if (this._directionWasMoving === Direction.DOWN) {
			this.trailingLineVertices.push(new Point(this.trailingLineVertices[0].x, window.uncover.canvas.height - this._height / 2));
		}
		this.trailingLineVertices.push(new Point(this.trailingLineVertices[0].x, this.trailingLineVertices[0].y));

		if(this.trailingLineVertices.length > 5) {
			this.uncoveredAreas.push(this.trailingLineVertices);
		}

		this.trailingLineVertices = [];
		this._addTrailingLineVertex();
	}

	keyDownHandler(e) {
		if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'd') {
			this._directionMoving = Direction.RIGHT;
		} else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'a') {
			this._directionMoving = Direction.LEFT;
		} else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'w') {
			this._directionMoving = Direction.UP;
		} else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 's') {
			this._directionMoving = Direction.DOWN;
		}
	}

	keyUpHandler(e) {
		if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'd') {
			this._directionMoving = undefined;
		} else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'a') {
			this._directionMoving = undefined;
		} else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'w') {
			this._directionMoving = undefined;
		} else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 's') {
			this._directionMoving = undefined;
		}
	}
}
