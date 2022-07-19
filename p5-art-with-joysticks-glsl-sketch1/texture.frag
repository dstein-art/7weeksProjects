#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 mouse;
uniform float time;
uniform float click;
uniform sampler2D img;
uniform sampler2D color_img;
uniform float axes[32];
uniform float buttons[32];

vec2 st;

vec4 pt(float x, float y) {
  float dx=st.x+(x*2.0/(u_resolution.x));
  float dy=st.y+(y*2.0/(u_resolution.y));
  return texture2D(img, vec2(dx,1.0-dy));
}

vec4 laplace() {
  vec4 result=vec4(0.0);
  //result=0.2*pt(0.0,0.0);
  result+=0.19999*pt(-1.0,0.0);
  result+=0.19999*pt(1.0,0.0);
  result+=0.19999*pt(0.0,-1.0);
  result+=0.19999*pt(0.0,1.0);
  result+=0.05*pt(1.0,1.0);
  result+=0.05*pt(1.0,-1.0);
  result+=0.05*pt(-1.0,1.0);
  result+=0.05*pt(-1.0,-1.0);

  return result;
}

vec4 move() {
  vec4 result=pt(-1.0,0.0);
  return result;
}


float getDistance(vec2 st) {

  float d=0.0;
  if (float(abs(axes[0]+axes[1]))>0.001) {
    d=distance(st,vec2(axes[0],axes[1]));
  }

  return d;

}


void main (void) {

  st = gl_FragCoord.xy/(u_resolution.xy*2.0);
  
  vec4 myColor=vec4(0.0);

  float dist = getDistance(st);
  float distY = axes[3];
  vec4 colorSelect = texture2D(color_img, vec2(dist/5.0,distY));

  /*
  if (buttons[0] > 0.1) {
    myColor+= 0.05*vec4(dist,dist,dist,1.0)+0.95*texture2D(img, vec2(st.x,1.0-st.y));
  }
  if (buttons[1] > 0.1) {
    myColor+= 0.05*vec4(dist,0.0,0.0,1.0)+0.95*texture2D(img, vec2(st.x,1.0-st.y));
  } 
  if (buttons[2] > 0.1) {
    myColor+= 0.05*vec4(0.0,dist,0.0,1.0)+0.95*texture2D(img, vec2(st.x,1.0-st.y));
  } 
  if (buttons[3] > 0.1) {
    myColor+= 0.05*vec4(0.0,dist,0.0,1.0)+0.95*texture2D(img, vec2(st.x,1.0-st.y));
  }
  */
  if ((axes[0]+axes[1]) > 0.001) {
    if (axes[2] < 0.25) {
      myColor+=0.05*colorSelect+0.99*texture2D(img, vec2(st.x,1.0-st.y));
    } else if (axes[2] > 0.75) {
      myColor+=0.002*colorSelect+0.99*texture2D(img, vec2(st.x,1.0-st.y));
    } else {
      myColor+=0.01*colorSelect+0.99*texture2D(img, vec2(st.x,1.0-st.y));
    }
  }
  if (myColor==vec4(0.0)) {
    myColor=laplace();
  }
  
  gl_FragColor = myColor;
}
