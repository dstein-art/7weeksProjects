#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float time;
uniform vec2 mouse;
uniform float click;
uniform sampler2D img;

vec2 st;

vec4 pt(float x, float y) {
  float dx=st.x+(x*4.0/(u_resolution.x));
  float dy=st.y+(y*4.0/(u_resolution.y));
  return texture2D(img, vec2(dx,1.0-dy));
  //return texture2D(img, vec2(st.x,1.0-st.y));
}

vec4 laplace() {
  vec4 result=vec4(0.0,0.0,0.0,0.0);
  result=0.2*pt(0.0,0.0);
  result+=0.1*pt(-1.0,0.0);
  result+=0.1*pt(1.0,0.0);
  result+=0.1*pt(0.0,-1.0);
  result+=0.1*pt(0.0,1.0);
  result+=0.1*pt(1.0,1.0);
  result+=0.1*pt(1.0,-1.0);
  result+=0.1*pt(-1.0,1.0);
  result+=0.1*pt(-1.0,-1.0);

  return result;
}

void main (void) {

  st = gl_FragCoord.xy/(u_resolution.xy*2.0);
  
  vec4 myColor;

  float dist = distance(st,mouse);  

  if (click > 0.1) {
    myColor= 0.05*vec4(dist,dist,dist,1.0)+0.95*texture2D(img, vec2(st.x,1.0-st.y));
  } else {
    myColor=laplace();
  }
  
  gl_FragColor = myColor;
}
