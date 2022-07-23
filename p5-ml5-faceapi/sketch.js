
let faceapi; // global to hold faceapi model
let detections = [];  // global to hold position data from face-api
let video;
let canvas;

function setup() {
  canvas=createCanvas(displayWidth, displayHeight);
  canvas.id("canvas");
  video=createCapture(VIDEO);
  video.id("video");

  const options = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.5
  }
  faceapi=ml5.faceApi(video,options,modelLoaded);
}

function modelLoaded() {
  faceapi.detect(detectedFaces);
}

function detectedFaces(error, result) {
  if(error){
    console.log(error);
    return;
  }
  detections=result;
  faceapi.detect(detectedFaces);
}

function drawFaceShapes(detections) {
  if (detections.length>0) {
    for (i=0; i<detections.length; i++) {
      stroke(200,0,0);
      noFill();
      strokeWeight(8);
      // draw box around face
      let {_x,_y,_width,_height}=detections[i].alignedRect._box;
      rect(_x,_y,_width,_height);
      rect(_x,_y+400,_width,_height);

      // draw landmark points of face
      for (j=0; j<detections[i].landmarks._positions.length; j++) {
        point(detections[i].landmarks._positions[j]._x,detections[i].landmarks._positions[j]._y);
        point(detections[i].landmarks._positions[j]._x,detections[i].landmarks._positions[j]._y+400);
      }
    }
  }
}
function draw() {
 clear();
 drawFaceShapes(detections); 
}
