let lastClicked = [];
let deltaThresh = 4;
let mouseDown = false;
let first_point = true;

let colors = ["#000000", "#FF0000", "#008000", "#800080", "#FFFFFF"]	;
//Black, Red, Green, Purple, White

let sendQueue = [];
let lastIdx = 0; // index of last received contour
let ct = 0;

// these are some parameters
let color = 0;
let sWeight = 2.5;

let roomNumber = parseInt(window.location.href.substr(window.location.href.search("value=")+6));

function setup() {
  createCanvas(1200,700);
  background(255,255,255);
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
      data: JSON.stringify({"lastIdx": lastIdx, "roomNumber": roomNumber}),
      success: function(data) {
        // console.log(data);
        for(let k = 0; k < data.length; k++){
          for(let j = 0; j < data[k].length-1; j++){
            stroke(colors[data[k][j][2]]);
            strokeWeight(data[k][j][3]);
            line(data[k][j][0],data[k][j][1],data[k][j+1][0],data[k][j+1][1]);
          }
          lastIdx += 1;
          console.log("success");
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
