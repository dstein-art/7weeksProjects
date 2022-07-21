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

let axesData=[];
let buttonData=[];

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


function getGamepadData() {
  let gamepads = navigator.getGamepads();
  for (let i=0; i<32;i++) {
    axesData[i]=0.0;
    buttonData[i]=0.0;
  }
  for (let i=0; i<gamepads.length; i++ ) {
    if ((gamepads[i]!= null) && (gamepads[i].connected)) {
      for (let j=0; j<gamepads[i].axes.length; j++) {
        axesData[j]=float(map(gamepads[i].axes[j],-1,1,0.0,1.0));
      }
      for (let j=0; j<gamepads[i].buttons.length; j++) {
        buttonData[j]=float(gamepads[i].buttons[j].value);
      }
    }
  }
}

function draw() {  
  background(255);
  getGamepadData();



  let clk=0.0;
  if (mouseIsPressed) {
    clk=1.0;
  }

  // shader() sets the active shader with our shader
  //shaderTexture.shader(simpleShader);
  shaderTexture.shader(simpleShader);
  simpleShader.setUniform('click', clk);
  simpleShader.setUniform('axes', axesData);
  simpleShader.setUniform('buttons', buttonData);
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
  // p5canvas.resizeCanvas(windowWidth, windowHeight);
}