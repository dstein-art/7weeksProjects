let shapeList=[];

function wrap(n, max) {
  // this works like constrain but instead of limitting the value
  // to the max, it wraps the value around. 
  //     For example if n=12, and max=10, the value is 2
  let r = n%max;
  if (r<0) {
    r=max+r;
  }
  return r;
}

class Shape {
  constructor(x,y,w,c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.c = c;
  }
  draw() {
    fill(this.c);
    circle(this.x,this.y,this.w);
  }
  resize() {
    this.w = 100 - this.mouseDist()/4;
  }
  mouseDist() {
    return dist(this.x,this.y, mouseX,mouseY);
  }
  drift() {
    if (this.mouseDist()>30) {
      if (this.mouseDist()> sqrt(width*width+height*height)/2) {
        this.x = this.x + 0.002*(this.x - mouseX);
        this.y = this.y + 0.002*(this.y - mouseY);
      } else {
        this.x = this.x - 0.002*(this.x - mouseX);
        this.y = this.y - 0.002*(this.y - mouseY);
      }
      this.x = wrap(this.x,width);
      this.y = wrap(this.y,height);
    }
  }
}

function preload() {
  img = loadImage('assets/CowsAtMarlos.png');
}

function setup() {
  createCanvas(800, 600);
}

function mouseClicked() {
  shapeList.push(new Shape(mouseX,mouseY,100,img.get(random(img.width),random(img.height))))
}

function draw() {
  background(220);
  for (i=0; i < shapeList.length; i++) {
    shapeList[i].drift();
    shapeList[i].resize();
    shapeList[i].draw();
  }
}
