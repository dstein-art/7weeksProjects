let m;

function setup() {
  m=new MidiController();
  m.listenByName("MIX");
  console.log(m.debugData());
}

function draw() {
    background(130);
    let r=m.knobsXY(3,0);
    let s=m.slider(3);
    let b=m.buttonsXY(7,1);
    console.log(r+":"+s+":"+b+"\n");
    //m.listenByName("APC Key 25");
}