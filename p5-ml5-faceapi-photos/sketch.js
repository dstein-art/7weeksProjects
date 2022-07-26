
let faceapi;
let detections = [];

let video;
let canvas;

let selectedImage=0;

let img=[];
let imgNames=["dave0.jpg","dave1.jpg","dave2.jpg","dave3.jpg","dave4.jpg","dave5.jpg","dave6.jpg","dave7.jpg"];

function preload() {
  for (i=0; i< imgNames.length; i++) {
    img[i] = loadImage('../assets/'+imgNames[i]);
  }
}

function setup() {
  canvas=createCanvas(displayWidth*0.4, displayHeight*0.4);
  canvas.id("canvas");
  /*
  video=createCapture(VIDEO);
  video.size(width,height);
  video.id("video");
  */

  const options = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.7
  }
  faceapi=ml5.faceApi(options,modelLoaded);
}

function modelLoaded() {
  setTimeout(detectImage, 250, 0);
}

let idToDetect=0;
function detectImage(aId) {
  if (aId < imgNames.length) {
    idToDetect=aId;
    console.log("calling ",aId);
    faceapi.detect(img[aId],detectedFaces);
  }
}

function detectedFaces(error, result) {
  if(error){
    console.log(error);
    return;
  }
  detections[idToDetect]=result;
  console.log(detections);
  setTimeout(detectImage, 250, idToDetect+1);
}

function avgP(points) {
  let _x=0;
  let _y=0;
  let c=points.length;
  if (c>0) {
    for (let cnt=0;cnt<c;cnt++) {
      _x+=points[cnt]._x;
      _y+=points[cnt]._y;
    }
  }
  _x=_x/c;
  _y=_y/c;
  return {_x,_y};
}

function centerP(point1,point2) {
  console.log("ps ",point1," ",point2);
  let _x=point1._x+(point2._x-point1._x)/2;
  let _y=point1._y+(point2._y-point1._y)/2;
  return {_x,_y};
}

function drawFaceShapes(faceDetections) {
  if (faceDetections.length>0) {
    for (let i=0; i<faceDetections.length; i++) {
      stroke(200,0,0);
      noFill();
      strokeWeight(8);
      let {_x,_y,_width,_height}=faceDetections[i].alignedRect._box;
      image(img[selectedImage],0,0,width,height,_x,_y,_width,_height);
      let wratio=width/_width;
      let hratio=height/_height;
      //rect(_x,_y,_width,_height);
      for (j=0; j<faceDetections[i].parts.leftEye.length; j++) {
        point(wratio*(faceDetections[i].parts.leftEye[j]._x-_x),hratio*(faceDetections[i].parts.leftEye[j]._y-_y));
      }
      for (j=0; j<faceDetections[i].parts.rightEye.length; j++) {
        point(wratio*(faceDetections[i].parts.rightEye[j]._x-_x),hratio*(faceDetections[i].parts.rightEye[j]._y-_y));
      }
      stroke(200,200,0);
      strokeWeight(12);
      let p1=avgP(faceDetections[i].parts.leftEye);
      point(wratio*(p1._x-_x),hratio*(p1._y-_y));
      let p2=avgP(faceDetections[i].parts.rightEye);
      point(wratio*(p2._x-_x),hratio*(p2._y-_y));
      line(wratio*(p1._x-_x),hratio*(p1._y-_y),
        wratio*(p2._x-_x),hratio*(p2._y-_y)
      );
      stroke(0,200,200);
      strokeWeight(12);
      let c1=centerP(p1,p2);
      console.log(c1);
      point(wratio*(c1._x-_x),hratio*(c1._y-_y));
    }
  }
}

function draw() {
 clear();
 if (detections.length>0) {
  drawFaceShapes(detections[selectedImage]);
  //image(img[selectedImage],0,0);
 }
}

function mousePressed() {
  selectedImage++;
  if (selectedImage>=img.length) {
    selectedImage=0;
  }
}