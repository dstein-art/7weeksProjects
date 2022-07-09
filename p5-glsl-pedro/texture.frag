// Modified example from: Adam Ferriss
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/1_basics/1-4_functions/basic.frag


// webgl requires that the first line of the fragment shader specify the precision
// precision is dependent on device, but higher precision variables have more zeros
// sometimes you'll see bugs if you use lowp so stick to mediump or highp
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec2 lines[28];
uniform float time;
uniform sampler2D img0;

vec2 st;

float dEllipsesegment(vec2 p1, vec2 p2, float d) {
    float result=0.0;
    
    float p1p2=distance(p1,p2);
    float p1st=distance(p1,st);
    float p2st=distance(p2,st);

    if (((p1st+p2st)-p1p2) < d) {
      result=((p1st+p2st)-p1p2);
    }

    return result;
}

float dLinesegment(vec2 p1, vec2 p2, float d) {
  // returns distance of a line segment
    float a = p1.y-p2.y;
    float b = p2.x-p1.x;
    float result=0.0;
    
    float p1p2=distance(p1,p2);
    float p1st=distance(p1,st);
    float p2st=distance(p2,st);

    // std is positive if the point is on the line, but this line goes on to infinity 
    //in both directions. We need to check the distance of st to p1 & p2 to make sure 
    // it is smaller than line distance
    float std=(abs(a*st.x+b*st.y+p1.x*p2.y-p2.x*p1.y) / sqrt(a*a+b*b));
    // line segment from p1 to st cannot have a greater distance than this (distance(p1,p2) + d
    if (p1st>(p1p2+d)) {
      result=0.0;
    // line segment from p2 to st cannot have a greater distance than this (distance(p1,p2) + d
    } else if (p2st>(p1p2+d)) {
      result=0.0;
    } else if ((p2st<d) && (p1st>p1p2)) {
      result=p2st;
    } else if ((p1st<d) && (p2st>p1p2)) {
      result=p1st;
    } else if ((std < d) && (p1st<p1p2) && (p2st<p1p2)) {
      result=std;
    }
    return result;
}

float dBody(float ll) {
  float dc=0.0;
  dc = max(dLinesegment(lines[0],lines[1],ll),dc);
  dc = max(dLinesegment(lines[2],lines[3],ll),dc);
  dc = max(dLinesegment(lines[4],lines[5],ll),dc);
  dc = max(dLinesegment(lines[6],lines[7],ll),dc);
  dc = max(dLinesegment(lines[8],lines[9],ll),dc);
  dc = max(dLinesegment(lines[10],lines[11],ll),dc);
  dc = max(dLinesegment(lines[12],lines[13],ll),dc);
  dc = max(dLinesegment(lines[14],lines[15],ll),dc);
  dc = max(dLinesegment(lines[16],lines[17],ll),dc);
  dc = max(dLinesegment(lines[18],lines[19],ll),dc);
  dc = max(dLinesegment(lines[20],lines[21],ll),dc);
  dc = max(dLinesegment(lines[22],lines[23],ll),dc);
  dc = max(dLinesegment(lines[24],lines[25],ll),dc);
  dc = max(dLinesegment(lines[26],lines[27],ll),dc);
  return dc;
}


// the fragment shader has one main function too
// this is kinda of like the draw() function in p5
// main outputs a variable called gl_FragColor which will contain all the colors of our shader
// the word void means that the function doesn't return a value
// this function is always called main()
void main() {
  st = gl_FragCoord.xy/(u_resolution.xy*2.0);

  vec4 color=vec4(1.0);

  float dc=0.0;
  float ll=4.0;

  // Really big Pedro with each line segment having a bigger width than the screen
  dc=dBody(ll);
  if (dc > 0.0) {
    // sample a color from photo from a vertical line 10% from the left starting 75% from bottom
    color =texture2D(img0, vec2(0.1,0.75+fract(dc)/20.0));
  }

  ll=0.85;
  dc=dBody(ll);
  if (dc > 0.0) {
    // sample a color from photo from a vertical line 30% from the left starting 45% from bottom
    color =texture2D(img0, vec2(0.3,0.65+fract(dc)/15.0));
  }

  ll=0.20;
  dc=dBody(ll);
  if (dc > 0.0) {
    // sample a color from photo from a vertical line 30% from the left starting 45% from bottom
    color =texture2D(img0, vec2(0.5,0.45+fract(dc)/10.0));
  }


  ll=0.02;
  dc=dBody(ll);
  if (dc > 0.0) {
    // sample a color from photo from a vertical line 30% from the left starting from bottom
    color =texture2D(img0, vec2(0.9,fract(dc)));
  }


	gl_FragColor = color; 
}