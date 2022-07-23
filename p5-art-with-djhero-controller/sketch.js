//this variable will hold our shader object

let count;

let savingVideo=false;
let saveBtn;

let p5canvas;
let simpleShader;
let shaderTexture;
let backupTexture;

let capturer;
let img;
let colorImg;

let blueButton=0;
let redButton=0;
let greenButton=0;
let leftButton=0;
let turntable=0;

function preload(){
  simpleShader = loadShader('texture.vert', 'texture.frag');
  colorImg = loadImage('assets/chelsea.png');
}

function setup() {
  // shaders require WEBGL mode to work
  p5canvas=createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  cnt=0.0;
  saveBtn=select("#saveBtn");

  shaderTexture=createGraphics(width,height,WEBGL);
  shaderTexture.noStroke();
  shaderTexture.remove();
  backupTexture=createGraphics(width,height,WEBGL);
}

function toggleRecording() {
    if (saveBtn.value() != "stop saving") {
        capturer = new CCapture({
            framerate: 30,
            format: "webm",
            name: "movie",
            quality: 75,
            verbose: true
        });
        savingVideo=true;
        capturer.start();
        saveBtn.value("stop saving");
    } else {
        savingVideo=false;
        capturer.stop();
        capturer.save();
        saveBtn.value("save");
    }
    if (savingVideo) capturer.capture(p5canvas.canvas);
}



function getDJHeroData() {
  let gamepads = navigator.getGamepads();
  for (let i=0; i<gamepads.length; i++ ) {
    if ((gamepads[i]!= null) && (gamepads[i].connected)) {
      blueButton=gamepads[i].buttons[0];
      greenButton=gamepads[i].buttons[1];
      redButton=gamepads[i].buttons[2];
      leftButton=gamepads[i].buttons[3];
      turntable=gamepads[i].axes[5];
    }
  }
}

function draw() {  
  background(255);
  getDJHeroData();

  shaderTexture.shader(simpleShader);
  simpleShader.setUniform('bluebtn', blueButton);
  simpleShader.setUniform('greenbtn', greenButton);
  simpleShader.setUniform('redbtn', redButton);
  simpleShader.setUniform('leftbtn', leftButton);
  simpleShader.setUniform('turntable', turntable);
  simpleShader.setUniform('u_resolution', [width,height]);
  simpleShader.setUniform('img',backupTexture);
  simpleShader.setUniform('color_img',colorImg);

  shaderTexture.rect(0,0,width,height);
  backupTexture=shaderTexture;

  texture(shaderTexture);
  
  rect(-width/2,-height/2,width,height);  
  console.log(width,":",height);

  if (savingVideo) capturer.capture(p5canvas.canvas);
}

function windowResized(){
  p5canvas.resizeCanvas(windowWidth, windowHeight);
}