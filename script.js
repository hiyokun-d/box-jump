const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
})

const land = {
	x: 0,
	y: canvas.height - 200,
	width: canvas.width,
	height: 400,
}

class Player {
	constructor() {
		this.width = 30;
		this.height = 30;
		this.x = canvas.width / 2 - this.width / 2
		this.y = land.y - this.width
		this.vy = 1;
		this.atLand = false;
	}

	draw() {
		ctx.fillStyle = "blue"
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	gravity() {
		this.y += this.vy;

		if (this.y+ this.height >= land.y) {
			this.vy = 0
			this.atLand = true;
		} else {
			this.vy += 0.5;
			this.atLand = false;
		}

	}

	jump() {
		if (this.atLand) {
			this.vy -= 10
		} else {
			const timeOut = setTimeout(() => {
				this.gravity()
			}, 1000);
			
			clearTimeout(timeOut)
		}
	}
}

class Obstacle {
	constructor() {
		this.position = {
			y: land.y - 30,
			left: -100,
			right: canvas.width + 10
		}

		this.vx = Math.floor(Math.random() * 6) + 10;
	}

	drawR() {
		ctx.beginPath()
		ctx.fillStyle = "red"
		ctx.fillRect(this.position.right, this.position.y, 30, 30)
		ctx.closePath()
		this.position.right -= this.vx;

		this.vx = Math.floor(Math.random() * 6) + 10;
	}

	drawL() {
		ctx.beginPath()
		ctx.fillStyle = "purple"
		ctx.fillRect(this.position.left, this.position.y, 30, 30)
		ctx.closePath()
		this.position.left += this.vx;

		this.vx = Math.floor(Math.random() * 6) + 10;
	}
}

const player = new Player()
let obstacles = []

function spawner() {
	let time = Math.random() * 1000 + 1500;
	setInterval(() => {
		obstacles.push(new Obstacle())

		time = Math.random() * 1000 + 1500
	}, time)
}

function animate() {
	requestAnimationFrame(animate)
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.fillStyle = "black"
	ctx.fillRect(land.x, land.y, land.width, land.height)

	player.draw()
	player.gravity()

	for (let i = 0; i < obstacles.length; i++) {
		let obstacle = obstacles[i]

			obstacle.drawL()
		obstacle.drawR()
		
		if (obstacle.left >= canvas.width + 10) {
			obstacles.splice(i, 1)
		}

		if (obstacle.right <= -100) {
			obstacles.splice(i, 1)
		}
	}
}

addEventListener("mousedown", () => {
	player.jump()
})

animate()
spawner()
