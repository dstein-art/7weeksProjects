// Modified example from: Adam Ferriss
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/1_basics/1-4_functions/sketch.js

//this variable will hold our shader object
let simpleShader;
let myArray=[0.3,0.2,0.7,0.9];
let img;

function preload(){
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  simpleShader = loadShader('texture.vert', 'texture.frag');

  img = loadImage('assets/CowsAtMarlos.png');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(simpleShader);

  simpleShader.setUniform('u_resolution', [width, height]);
  simpleShader.setUniform('mouse', [map(mouseX, 0, width, 0, 1),map(mouseY, 0, width, 0, 1)]);
  simpleShader.setUniform('points',myArray);
  simpleShader.setUniform('time', frameCount * 0.01);
  simpleShader.setUniform('img0', img);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}