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


function preload(){
  simpleShader = loadShader('texture.vert', 'texture.frag');
  //img = loadImage('assets/CowsAtMarlos.png');
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


function draw() {  
  background(255);
  let mx;
  let my;

  mx = float(map(mouseX, 0, width, 0.0, 1.0));
  my = 1-float(map(mouseY, 0, height, 0.0, 1.0));


  let clk=0.0;
  if (mouseIsPressed) {
    clk=1.0;
  }

  // shader() sets the active shader with our shader
  //shaderTexture.shader(simpleShader);
  shaderTexture.shader(simpleShader);

  simpleShader.setUniform('mouse', [mx,my]);
  simpleShader.setUniform('u_resolution', [width,height]);
  simpleShader.setUniform('click',clk);
  simpleShader.setUniform('img',backupTexture);


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