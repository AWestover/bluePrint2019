let lastClicked = [];
let deltaThresh = 4;
let mouseDown = false;
let first_point = true;

let colors = ["#000000", "#FF0000", "#008000", "#800080", "#FFFFFF"]	;
//Black, Red, Green, Purple, White

let sendQueue = [];
let nextIdx = 0; // index of the next contour I will receive
let lastKillIdx = -1; // kill data thing, will let me know if someone wipes the board
let ct = 0;

// these are some parameters
let color = 0;
let sWeight = 2.5;

let roomNumber = parseInt(window.location.href.substr(window.location.href.search("value=")+6));

function postClearIdxReset() {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/getNextIdx",
			data: JSON.stringify({"roomNumber": roomNumber}),
			success: function(data){
				console.log("retrieved initial data");
				console.log(data);
				nextIdx = data;
				lastKillIdx = data-1;
		},
		dataType: "json"
	});
}
postClearIdxReset();

function killBoard() {
	console.log("running killBoard");
	$.ajax({
    type: "POST",
    contentType: "application/json",
    url: "/killBoard",
    data: JSON.stringify({"roomNumber": roomNumber, "nextIdx":nextIdx}),
    dataType: "json"
  });
}
function saveBoard(){
	let name = prompt("Input the filename that you want you png to be saved as");
	save(name);
}

function setup() {
  createCanvas(1200,700);
  background(255,255,255);
	fill(0,0,0);
	text("Color: ", width*0.8,height*0.02);

  fill(colors[color]);
  strokeWeight(1);
  stroke(0);
	rect(width*0.8,height*0.03,20,20);
}

function draw() {
  ct++;
  if(ct > 100){
    ct = 0;
    // request data
    $.ajax ({
      type: "POST",
      contentType: "application/json",
      url: "/getData",
      data: JSON.stringify({"nextIdx": nextIdx, "lastKillIdx": lastKillIdx, "roomNumber": roomNumber}),
      success: function(data) {
				console.log(data);
				if(!data){ // kill signal
					console.log("I GOT KILLED \n\n\n\n\asd super important ahsdfasdfjasdlkfjaskldfjaklsdfjklsdfjaklsdf");
					background(255,255,255);
					console.log("got killed!!!");

					postClearIdxReset();
					// really aught to / got to modify last Kill Idx here!!!!
				}
				else {
					for(let k = 0; k < data.length; k++){
						for(let j = 0; j < data[k].length-1; j++){
							stroke(colors[data[k][j][2]]);
							strokeWeight(data[k][j][3]);
							line(data[k][j][0],data[k][j][1],data[k][j+1][0],data[k][j+1][1]);
						}
						nextIdx += 1;
						console.log("success");
					}
				}
      },
      dataType: "json"
    });
  }
}

function distSquaredVec(dx, dy){
  return dx*dx+dy*dy;
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
  first_point = true;

  // send data
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: "/putData",
    data: JSON.stringify({"roomNumber": roomNumber, "sendQueue": sendQueue}),
    dataType: "json"
  });
  sendQueue = [];
}

function keyTyped() {
  if (key == 'b' || key == 'B'){
    color = 0;
    sWeight = 2.5;
  }
  if (key == 'r' || key == 'R'){
    color = 1;
    sWeight = 2.5;
  }
  if (key == 'g' || key == 'G'){
    color = 2;
    sWeight = 2.5;
  }
  if (key == 'p' || key == 'P')
  {
    color = 3;
    sWeight = 2.5;
  }
  if (key == 'e' || key == 'E')
  {
    color = 4;
    sWeight = 50;
  }
  fill(colors[color]);
  strokeWeight(1);
  stroke(0);
	rect(width*0.8,height*0.03,20,20);
}

function mouseDragged() {
  if (mouseDown){
    stroke(0);
    if (!first_point && distSquaredVec(lastClicked[0]-mouseX, lastClicked[1]-mouseY) > deltaThresh) {
      strokeWeight(sWeight);
      stroke(colors[color]);
      line(lastClicked[0], lastClicked[1], mouseX, mouseY);
      ellipse(mouseX, mouseY, 0.5, 0.5);
      lastClicked[0] = mouseX;
      lastClicked[1] = mouseY;
      sendQueue.push([mouseX, mouseY, color, sWeight]);
    }
    if(first_point) {
      lastClicked[0] = mouseX;
      lastClicked[1] = mouseY;
      sendQueue.push([mouseX, mouseY, color, sWeight]);
      first_point = false;
    }
  }
}
