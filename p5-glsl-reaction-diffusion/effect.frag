precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D backbuffer;

uniform float mouseDown;
uniform vec2 mouse;
uniform vec2 u_resolution;
uniform float time;
vec2 mousepos;  // global variable that will represent the mouse position (0 to 1 range for x and y)
vec2 st;       // global variable that will represent the current pixel being drawn (0 to 1 range for x and y)

uniform float feedRate;
uniform float killRate;
uniform float clear;

vec4 pt(float x, float y) {
  float dx=st.x+(x*1.0/(u_resolution.x));
  float dy=st.y+(y*1.0/(u_resolution.y));
  dy=mod(dy,1.0);
  dx=mod(dx,1.0);
  return texture2D(backbuffer, vec2(dx,1.0-dy));
}

vec4 laplace() {
  vec4 result;
  result=-1.0*pt(0.0,0.0);
  result+=0.2*pt(0.0,1.0);
  result+=0.2*pt(-1.0,0.0);
  result+=0.2*pt(1.0,0.0);
  result+=0.2*pt(0.0,-1.0);
  result+=0.05*pt(1.0,1.0);
  result+=0.05*pt(1.0,-1.0);
  result+=0.05*pt(-1.0,1.0);
  result+=0.05*pt(-1.0,-1.0);
  result.a=1.0;
  return result;
}

float reactionSpeed=1.0;
float diffRateA=1.0;
float diffRateB=0.5;

vec4 reaction() {
  vec4 lp = laplace();
  vec4 oldPt=texture2D(backbuffer, vec2(st.x,1.0-st.y));
  float a = oldPt[0];
  float b = oldPt[1];
  
  float feedRateA=feedRate+2.0*abs(st.x-0.5)/100.0;
  float killRateA=killRate+1.0*abs(st.y-0.5)/100.0;

  oldPt[0] = a + (diffRateA*lp.x-a*b*b+feedRateA*(1.0-a))*reactionSpeed;
  oldPt[1] = b + (diffRateB*lp.y+a*b*b-(killRateA+feedRateA)*b)*reactionSpeed;

  return oldPt;
}

void main () {
    //st=uvN();
    st=vTexCoord;
    // mouse needs to be adjusted for 0 to 1 with an adjustment for the 1-y on y axis (mouse has zero on top, uvN has zero on bottom)
    mousepos=mouse.xy/(u_resolution*2.0);
    mousepos.y=1.0-mouse.y;

    vec4 outx=vec4(0.0,0.0,0.0,1.0);
    if ((mouseDown>0.1) && (distance(st,mouse)<0.02)) {
        outx=vec4(1.0,0.0,0.0,1.0);
    } else {
        // if we are outside the circle, draw a little bit of the last frame (it will slowly fade)
        outx=1.0*reaction();
    }
    
    if (clear>0.1) {
        outx=vec4(0.0,1.0,0.0,1.0);
    }

    // Make sure our alpha channel is 1
    outx.a=1.0;
	gl_FragColor=outx;
}