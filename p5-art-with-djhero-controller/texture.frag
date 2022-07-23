#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float time;
uniform float redBtn;
uniform float blueBtn;
uniform float greenBtn;
uniform float leftBtn;
uniform float turntable;
uniform sampler2D img;
uniform sampler2D color_img;


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

vec4 move(float x, float y) {
  vec4 result=pt(x,y);
  return result;
}


void main (void) {

  st = gl_FragCoord.xy/(u_resolution.xy*2.0);
  //st.y=1.0-st.y;
  
  vec4 myColor=vec4(1.0,1.0,0.0,1.0);
  myColor=(0.05+st.y/3.0)*texture2D(color_img,1.0-st)+(0.95-(st.y/3.0))*move(turntable*500.0,0.0);
  
  gl_FragColor = myColor;
}
