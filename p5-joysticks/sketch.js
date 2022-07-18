var canvas;
var dataDiv;

function round2(aFloat) {return Math.round(aFloat*100)/100};

function buttonsPressed(aGamepad) {
  var result="";
  for (let i=0; i < aGamepad.buttons.length; i++) {
    result+=round2(aGamepad.buttons[i].value)+" ";
    if ((i % 4)==3) { result += " - ";}
  }
  return result;
}

function axesValue(aGamepad) {
  var result="";
  for (let i=0; i < aGamepad.axes.length; i++) {
		if ((i % 2) == 0) {result += " (";}
    result+=round2(aGamepad.axes[i])+" ";
    if ((i % 2) == 1) {result += ") ";}
  }
  return result;
}

function setup() {
  dataDiv=document.getElementById('data');
  canvas=createCanvas(400, 400);
  canvas.parent("p5sketch");
}


function gamePadSummary() {
  // Get the state of all gamepads
  let gamepads = navigator.getGamepads();
  let result = "";
  let foundOne=false;

  for (let i = 0; i < gamepads.length; i++) {
      result+="Gamepad " + i + ":<br>";
      if (gamepads[i] === null) {
          result+="[null]<br>";
          continue;
      }

      if (!gamepads[i].connected) {
          result+="[disconnected]<br>";
          continue;
      }

      foundOne=true;
      result+="    Index: " + gamepads[i].index+"<br>";
      result+="    ID: " + gamepads[i].id+"<br>";
      result+="    Axes: " + gamepads[i].axes.length+" : "+axesValue(gamepads[i])+"<br>";
      result+="    Buttons: " + gamepads[i].buttons.length+" : "+buttonsPressed(gamepads[i])+"<br>";
      result+="    Mapping: " + gamepads[i].mapping+"<br>";
      drawGamePad(gamepads[i]);
  }
  if (!foundOne) {
    textSize(32);
    fill(0, 102, 153);
    text('No Joystick Connected', 10, 100);
    textSize(20);
    text('Once connected, move controls to detect', 10, 150);
  }
  dataDiv.innerHTML=result;
}

function drawButtons(aGamePad) {
  let numButtons=aGamePad.buttons.length;
  let buttonWidth=width/(2*numButtons);
  for (let i=0; i< numButtons; i++) {
    if (aGamePad.buttons[i].pressed) {
      fill(200,0,0);
    } else {
      fill(255,255,255);
    }
    ellipse(i*(buttonWidth*2)+buttonWidth,buttonWidth,buttonWidth,buttonWidth);
  }
}

function drawAxes(aGamePad) {
  let numSticks=aGamePad.axes.length/2;
  let buttonWidth=width/(2*numSticks);
  for (let i=0; i< numSticks; i++) {
    let x=i*(buttonWidth*2)+buttonWidth;
    let y=height/2;
    fill(255);
    ellipse(x,y,buttonWidth,buttonWidth);
    line(x,y,x+0.5*buttonWidth*aGamePad.axes[i*2],y+0.5*buttonWidth*aGamePad.axes[i*2+1]);
  }
}


function drawGamePad(aGamePad) {
  drawButtons(aGamePad);
  drawAxes(aGamePad);
}

function draw() {
  background(220);
  gamePadSummary();
}
