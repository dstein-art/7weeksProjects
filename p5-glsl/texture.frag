// Modified example from: Adam Ferriss
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/1_basics/1-4_functions/basic.frag


// webgl requires that the first line of the fragment shader specify the precision
// precision is dependent on device, but higher precision variables have more zeros
// sometimes you'll see bugs if you use lowp so stick to mediump or highp
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec2 points[2];
uniform float time;
uniform sampler2D img0;

vec2 st;

bool line(vec2 p1, vec2 p2, float d) {
    float a = p1.y-p2.y;
    float b = p2.x-p1.x;
    return (d > abs(a*st.x+b*st.y+p1.x*p2.y-p2.x*p1.y) / sqrt(a*a+b*b));
}

bool circle(vec2 origin, float d) {
  return (distance(st,origin) < d);
}

// the fragment shader has one main function too
// this is kinda of like the draw() function in p5
// main outputs a variable called gl_FragColor which will contain all the colors of our shader
// the word void means that the function doesn't return a value
// this function is always called main()
void main() {
  st = gl_FragCoord.xy/(u_resolution.xy*2.0);

	// determine distances between the points passed and the mouse position
	float d1=fract(distance(points[0]*fract(time)+mouse,st));
  float d2=fract(distance(points[1]+mouse,st));

 	// retrieves a pixel from the image that was passed
  //   but instead of selecting it using st, use a function of the mouse,time and
	vec4 tex =texture2D(img0, vec2(d1,d2));

  // Let's play a little with our line and circle
  vec4 color=vec4(0.5,0.5,0.5,1.0);
  if (circle(vec2(0.3,0.3),0.25)) {
    color=tex;
  }
  if (circle(vec2(0.7,0.3),0.25)) {
    color=tex;
  }
  if (line(vec2(0.25,0.75),vec2(0.8,0.8),0.15)) {
    color=tex;
  }

	gl_FragColor = color; 
}