
let faceapi; // global to hold faceapi model
let detections = [];  // global to hold position data from face-api
let video;
let canvas;

function setup() {
  canvas=createCanvas(displayWidth, displayHeight);
  canvas.id("canvas");
  video=createCapture(VIDEO);
  video.id("video");
  video.hide();

  const options = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.5
  }
  faceapi=ml5.faceApi(video,options,modelLoaded);
}

function preload() {
  img = loadImage('../assets/chelsea.png');
}

function modelLoaded() {
  faceapi.detect(detectedFaces);
}

function detectedFaces(error, result) {
  if(error){
    console.log(error);
    return;
  }
  if (result.length>0) {
    detections=result;
  }
  faceapi.detect(detectedFaces);
}

function xLinesTo(points,xstart,ystart,width) {
  let c=points.length;
  for (let i=0; i<c; i++) {
    let x1=xstart+(width/(c-1))*i;
    for (let j=0; j<c; j++) {
      let clr=img.get(img.width/3,(j/c)*img.height);
      stroke(clr);
      line(x1,ystart,points[j]._x,points[j]._y);
    }
  }
}

function yLinesTo(points,xstart,ystart,height) {
  let c=points.length;
  for (let i=0; i<c; i++) {
    let y1=ystart+(height/(c-1))*i;
    for (let j=0; j<c; j++) {
      let clr=img.get(img.width/3,(j/c)*img.height);
      stroke(clr);
      line(xstart,y1,points[j]._x,points[j]._y);
    }
  }
}

function connectPoints(from,to) {
  for (let i=0; i<from.length; i++) {
    for (let j=0; j<to.length; j++) {
      strokeWeight(1);
      let clr=img.get(img.width/3,(j/to.length)*img.height);
      stroke(clr);
      line(from[i]._x,from[i]._y,to[j]._x,to[j]._y);
    }
  }
}

function selectItems(list,start,count) {
  let temp=[];
  for (let i=0; i < list.length; i++) {
    if (i>=start) {
      if (count>0) {
        temp.push(list[i]);
        count--;
      }
    }
  }
  return temp;
}

function drawFaceShapes(detections) {
  if (detections.length>0) {
    for (i=0; i<detections.length; i++) {
      stroke(200,0,0);
      noFill();
      strokeWeight(10);
      // draw box around face
      let {_x,_y,_width,_height}=detections[i].alignedRect._box;

      // draw landmark points of face
      for (j=0; j<detections[i].landmarks._positions.length; j++) {
        let clr=img.get(img.width/3,(j/detections[i].landmarks._positions.length)*img.height);
        stroke(clr);    
        strokeWeight(10);
        point(detections[i].landmarks._positions[j]._x,detections[i].landmarks._positions[j]._y);
      }
      strokeWeight(10);

      // Draw lines from top to the left and right eye brows
      xLinesTo(detections[i].parts.leftEyeBrow,0,0,(video.width)/2);
      xLinesTo(detections[i].parts.rightEyeBrow,(video.width)/2,0,(video.width)/2);

      // Draw lines from left side of jawline to left side of mouth
      let temp=selectItems(detections[i].parts.jawOutline,0,5);
      let temp2=selectItems(detections[i].parts.mouth,0,4);
      connectPoints(temp,temp2);
      // Draw lines from left side of jawline to top of nose
      temp2=selectItems(detections[i].parts.nose,1,5);
      connectPoints(temp,temp2);

      strokeWeight(10);

      // Draw lines from left to left side of jawline
      yLinesTo(temp,0,100,video.height-100);

      // Draw lines from right side of jawline to top of nose
      temp=selectItems(detections[i].parts.jawOutline,12,5);
      connectPoints(temp,temp2);
      // Draw lines from right side of jawline to right side of mouth
      temp2=selectItems(detections[i].parts.mouth,4,4);
      connectPoints(temp,temp2);

      // Draw lines from right to right side of jawline
      strokeWeight(10);
      yLinesTo(temp,video.width,video.height,100-video.height);

      // Draw lines from bottom to bottom of jawline
      temp=selectItems(detections[i].parts.jawOutline,5,7);
      xLinesTo(temp,100,video.height,(video.width-200));

      // Draw lines from bottom of jawline to bottom of mouth
      temp2=selectItems(detections[i].parts.mouth,7,5);
      connectPoints(temp,temp2);
    }
  }
}
function draw() {
 background(160);
 drawFaceShapes(detections); 
}

