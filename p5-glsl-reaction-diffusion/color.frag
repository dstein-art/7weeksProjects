precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D imageTex;
uniform sampler2D colorTex;

uniform float mouseDown;
uniform vec2 mouse;
uniform vec2 u_resolution;
uniform float time;

vec2 uv;

vec3 rgb2hsb(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 getColor(float x, float y) {
    //x=floor(x*100.0)/1000.0;
    //y=floor(y*100.0)/1000.0;
    return texture2D(colorTex, vec2(x,y));
}

void main() {

  uv = vTexCoord;
  uv = gl_FragCoord.xy/(u_resolution.xy);
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;
  
  if (uv.x > 0.5) {
    //uv.x=1.0-uv.x;
  }

  // make a copy of the camera
  vec4 tex;

  tex=texture2D(imageTex,uv);
  
  vec4 c=0.5*getColor(tex.x,0.5)+0.5*getColor(tex.y,0.5);

  gl_FragColor = getColor(tex.x,0.5);
}