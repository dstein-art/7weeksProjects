// Modified example from: Adam Ferriss
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/1_basics/1-4_functions/sketch.js

//this variable will hold our shader object
let simpleShader;
let img;

var allTextLines = [];
var lines = [];
var dataloaded=false;

cPelvis_position=1;
cLeftUpperLeg_position=7;
cLeftLowerLeg_position=13;
cLeftFoot_position=19;
cRightUpperLeg_position=25;
cRightLowerLeg_position=31;
cRightFoot_position=37;
cChest_position=43;
cLeftShoulder_position=49;
cLeftUpperArm_position=55;
cLeftForeArm_position=61;
cLeftHand_position=67;
cHead_position=73;
cRightShoulder_position=79;
cRightUpperArm_position=85;
cRightForeArm_position=91;
cRightHand_position=97;

function preload(){
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  simpleShader = loadShader('texture.vert', 'texture.frag');
  img = loadImage('assets/CowsAtMarlos.png');

  fetch('assets/data.csv')
  .then(response => response.text())
  .then(data => {
    allTextLines = data.split(/\r\n|\n/);
    dataloaded=true;
    for (let i=1; i <allTextLines.length; i++) {
      let tempstr=allTextLines[i];
      let ar=tempstr.split(",");
      lines[i-1]=ar;
    }
  });
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

let lineArray=[];
let lineIndex=1;
let direction=2;

function addToArray(i1,i2) {
  //console.log(i1," ",i2,":",lineIndex);
  //console.log(lines[lineIndex]);
  lineArray.push((float(lines[lineIndex][i1])+1.001)/2); 
  lineArray.push((float(lines[lineIndex][i1+1])+1.001)/2);
  lineArray.push((float(lines[lineIndex][i2])+1.001)/2);
  lineArray.push((float(lines[lineIndex][i2+1])+1.001)/2);
}

function incrementSkeletonFrame() {
    // increment index of skeleton data
    lineIndex=lineIndex+direction;
    // if lineIndex is outside the bounds of the array, switch increment direction
    if ((lineIndex>=lines.length) || (lineIndex<=0)) {
      direction=direction*-1.0;
      lineIndex=lineIndex+direction;
    }
}

function draw() {
  if (dataloaded) {  
    lineArray=[];
    addToArray(cRightShoulder_position,cLeftShoulder_position);
    addToArray(cRightShoulder_position,cPelvis_position);
    addToArray(cLeftShoulder_position,cPelvis_position);
    addToArray(cLeftUpperLeg_position,cPelvis_position);
    addToArray(cRightUpperLeg_position,cPelvis_position);
    addToArray(cRightLowerLeg_position,cRightUpperLeg_position);
    addToArray(cLeftLowerLeg_position,cLeftUpperLeg_position);
    addToArray(cRightShoulder_position,cRightForeArm_position);
    addToArray(cLeftShoulder_position,cLeftForeArm_position);
    addToArray(cChest_position,cHead_position);
    addToArray(cLeftLowerLeg_position,cLeftFoot_position);
    addToArray(cRightLowerLeg_position,cRightFoot_position);
    addToArray(cLeftForeArm_position,cLeftHand_position);
    addToArray(cRightForeArm_position,cRightHand_position);

    // shader() sets the active shader with our shader
    shader(simpleShader);
    simpleShader.setUniform('lines',lineArray);
    simpleShader.setUniform('u_resolution', [width, height]);
    simpleShader.setUniform('img0', img);

    // rect gives us some geometry on the screen
    rect(0,0,width, height);

    incrementSkeletonFrame();
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}