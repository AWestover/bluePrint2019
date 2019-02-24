let x = 0;
let ct = 0;
let ctMod = 5;

let velXGuess = 0;

function setup() {
	createCanvas(400,400);
	background(200,200,200);
	text("CtMod "+ctMod, 20, 20);
}

function draw() {
	ct += 1;
	if(ct > ctMod){
		ct = 0;
		x += 1;
		fill(0,255,0);
		rect(x, height/2, 1, accelerationX);
		velXGuess += accelerationX;
		fill(255,0,0);
		rect(x, height*0.75, 1, velXGuess);
	}
}
