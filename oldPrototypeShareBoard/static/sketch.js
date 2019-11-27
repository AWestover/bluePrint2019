
let mouseDown = false;
let lastPos = [0, 0];
let ct = 0;
let lastIdx = 0;
const r = 2;
const deltaPos = 0.1*r;

let toSendQueue = [];

function setup() {
	createCanvas(500,520);
	background(230,230,230);
	noStroke();
}

function draw() {
	ct ++;
	if (ct > 100){
		ct = 0;
		$.ajax({
			type: "POST",
			contentType: "application/json; charset-utf-8",
			url: "/putMassData",
			data: JSON.stringify(toSendQueue),
			dataType: "json"
		});
		toSendQueue=[];
		$.ajax({
			type: "POST",
			contentType: "application/json; charset-utf-8",
			url: "/sendData",
			data: JSON.stringify(lastIdx),
			success: function (data){
				for (var i = 0; i < data.length; i++) {
					fill(155,0,0);
					ellipse(data[i][0], data[i][1], r, r);
				}
				console.log(data);
				lastIdx += data.length;
			},
			dataType: "json"
		});
	}
}

function mousePressed(){
	mouseDown = true;
}
function mouseReleased(){
	mouseDown = false;
}

function mouseDragged(){
	if(mouseDown && (abs(winMouseX-lastPos[0]) > deltaPos || abs(winMouseY-lastPos[1])> deltaPos)) {
		fill(0,255,0);
		stroke(0,0,0);
		line(lastPos[0], lastPos[1], winMouseX, winMouseY);
		//ellipse(winMouseX, winMouseY,2*r,2*r);
		lastPos = [winMouseX, winMouseY];
		toSendQueue.push(lastPos.slice());
		/*$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "/putData",
			data: JSON.stringify(lastPos),
			dataType: "json"
		});*/
	}
}

