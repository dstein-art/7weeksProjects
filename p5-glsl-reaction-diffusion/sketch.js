// in this sketch we're going to create a feedback effect by repeatedly sending the same image back to the shader and performing a slight modification
// click the mouse to get things started

// the shader variable
let diffusionShader;

// we will need at least two layers for this effect
let shaderLayer;
let colorLayer;
let pastLayer;
let p5canvas;

let clearValue=0.0;

function round2(x) {
    return round(x*100)/100;
}

function preload(){
  // load the shader
  diffusionShader = loadShader('effect.vert', 'effect.frag');
  colorShader = loadShader('effect.vert','color.frag')
  img = loadImage('../assets/CowsAtMarlos.png');
}

function setup() {
  m=new MidiController();

  // shaders require WEBGL mode to work
  p5canvas=createCanvas(windowWidth, windowHeight);
  noStroke();

  // this layer will use webgl with our shader
  shaderLayer = createGraphics(windowWidth, windowHeight, WEBGL);
  colorLayer = createGraphics(windowWidth,windowHeight,WEBGL);

  // this layer will just be a copy of what we just did with the shader
  pastLayer = createGraphics(windowWidth, windowHeight);

  m.listenByName("MIX");
}

let savingVideo=false;
function toggleRecording() {
    if (!savingVideo) {
        capturer = new CCapture({
            framerate: 15,
            format: "webm",
            name: "movie",
            quality: 75,
            verbose: true
        });
        savingVideo=true;
        capturer.start();
    } else {
        savingVideo=false;
        capturer.stop();
        capturer.save();
    }
    if ((frameCount % 3)==0) {
        if (savingVideo) capturer.capture(p5canvas.canvas);
    }
}

function keyPressed() {
    if (keyCode==82){
        toggleRecording();
    } else if (keyCode==67) {
        clearValue=1.0;
    }
}

function draw() {  
  // shader() sets the active shader with our shader
  shaderLayer.shader(diffusionShader);

  let mx = float(map(mouseX, 0, width, 0.0, 1.0));
  let my = 1-float(map(mouseY, 0, height, 0.0, 1.0));

  let feedRate=0.02;
  let killRate=0.04;

  let f=map(m.knobsXY(0,0),0,1,feedRate,feedRate+0.04);
  let k=map(m.knobsXY(1,0),0,1,killRate,killRate+0.04);
  let da=map(m.knobsXY(3,0),0,1,0.05,1.2);
  let db=map(m.knobsXY(4,0),0,1,0.05,1.2);
  let rs=map(m.knobsXY(2,0),0,1,0.02,0.2);

  console.log("f=",round2(f)," k=",round2(k)," da=",round2(da)," db=",round2(db));
  diffusionShader.setUniform('feedRate',f);
  diffusionShader.setUniform('killRate',k);
  diffusionShader.setUniform('reactionSpeed',rs);
  diffusionShader.setUniform('diffRateA',da);
  diffusionShader.setUniform('diffRateB',db);
  diffusionShader.setUniform('clear',clearValue);
  clearValue=0;

  // also send the copy layer to the shader as a uniform
  diffusionShader.setUniform('backbuffer', pastLayer);

  // send mouseIsPressed to the shader as a int (either 0 or 1)
  diffusionShader.setUniform('mouseDown', int(mouseIsPressed));
  diffusionShader.setUniform('mouse',[mx,my]);
  diffusionShader.setUniform('time', frameCount * 0.01);
  diffusionShader.setUniform('u_resolution', [width,height]);

  // rect gives us some geometry on the screen
  shaderLayer.rect(0,0,width, height);

  colorLayer.shader(colorShader);
  colorShader.setUniform('mouseDown', int(mouseIsPressed));
  colorShader.setUniform('mouse',[mx,my]);
  colorShader.setUniform('time', frameCount * 0.01);
  colorShader.setUniform('u_resolution', [width,height]);
  colorShader.setUniform('imageTex',shaderLayer);
  colorShader.setUniform('colorTex',img);

  colorLayer.rect(0,0,width, height);

  // draw the shaderlayer into the past layer
  pastLayer.image(shaderLayer, 0,0,width, height);

  image(colorLayer, 0,0,width,height);

  textSize(24);
  if (savingVideo) capturer.capture(p5canvas.canvas);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}