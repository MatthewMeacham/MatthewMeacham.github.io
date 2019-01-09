const BASE_BALL_MOVEMENT_SPEED = 2;

class Ball {

	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		
		// Randomize the beginning movement speed and direction
		const randomXDirection = (Math.random() < 0.5 ? 1 : -1);
		const randomYDirection = (Math.random() < 0.5 ? 1 : -1);

		this.xMovementSpeed = (BASE_BALL_MOVEMENT_SPEED + Math.random() * 2) * randomXDirection;
		this.yMovementSpeed = (BASE_BALL_MOVEMENT_SPEED + Math.random() * 2) * randomYDirection;

		this.color = 'red';
	}

	render(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
	}

	tick() {
		this.move();
	}

	move() {
		const willHitTopEdge = this.y + this.yMovementSpeed < this.radius;
		const willHitBottomEdge = this.y + this.yMovementSpeed > window.uncover.canvas.height - this.radius;
		if (willHitTopEdge || willHitBottomEdge) {
			this.yMovementSpeed = -this.yMovementSpeed;
		}

		const willHitLeftEdge = this.x + this.xMovementSpeed < this.radius;
		const willHitRightEdge = this.x + this.xMovementSpeed > window.uncover.canvas.width - this.radius;
		if(willHitLeftEdge || willHitRightEdge) {
			this.xMovementSpeed = -this.xMovementSpeed;
		}

		this.x += this.xMovementSpeed;
		this.y += this.yMovementSpeed;
	}
}