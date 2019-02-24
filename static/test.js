let ct = 0;
let wPos = 0;
let ctMod = 5;
let xMove = 0;
let yMove = 0;

let prevAccells = [];

const THRESH = 3; // CAILIBARATE THIS

let velX = 0;
let posX = 0;
let velY = 0;
let posY = 0;

function setup() {
	createCanvas(600,600);
	background(200,200,200);
	text("CtMod "+ctMod, 20, 20);
}

function accelAvg(){
	let sum = 0;
	for (let i = 0; i < prevAccells.length; i++){
		sum += prevAccells/prevAccells.length;
	}
	return sum;
}

function draw() {
	ct += 1;

	text(accelAvg(), 100, 100);

	if(ct > ctMod){
		ct = 0;
		wPos += 1;

		fill(0,255,0);
		rect(wPos, height*0.2, 1, accelerationX);
		fill(255,0,0);
		rect(wPos, height*0.4, 1, velX);
		fill(0,255,0);
		rect(wPos, height*0.6, 1, accelerationY);
		fill(255,0,0);
		rect(wPos, height*0.8, 1, velY);

		if(abs(accelerationX) > THRESH && xMove == 0) {
			xMove = Math.sign(accelerationX);
		}
		if(xMove > 0 && accelerationX < -1*THRESH) {
			xMove = 0;
			velX = 0;
		}
		if(xMove < 0 && accelerationX < THRESH) {
			xMove = 0;
			velX = 0;
		}
		if(xMove != 0){
			velX += accelerationX;
		}

		if(abs(accelerationY) > THRESH && yMove == 0) {
			yMove = Math.sign(accelerationY);
		}
		if(yMove > 0 && accelerationY < -1*THRESH) {
			yMove = 0;
			velY = 0;
		}
		if(yMove < 0 && accelerationY < THRESH) {
			yMove = 0;
			velY = 0;
		}
		if(yMove != 0){
			velY += accelerationY;
		}

	}
}
