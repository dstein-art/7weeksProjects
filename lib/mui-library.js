var webMidiEnabled=false;

let _knobMatrix= {"MIDI Mix":[
                        [16,20,24,28,46,50,54,58],
                        [17,21,25,29,47,51,55,59],
                        [18,22,26,30,48,52,56,60]],
                    "APC Key 25":[
                        [48,49,50,51],
                        [52,53,54,55]
                    ],
                    "Launch Control XL":[
                        [13,14,15,16,17,18,19,20],
                        [29,30,31,32,33,34,35,36],
                        [49,50,51,52,53,54,55,56]
                    ]
                };
let _sliderArray={"MIDI Mix":[19,23,27,31,49,53,57,61,62],
                  "APC Key 25":[],
                  "Launch Control XL":[77,78,79,80,81,82,83,84]
                };
let _buttonMatrix={"MIDI Mix":[
                        [1,4,7,10,13,16,19,22,27],
                        [3,6,9,12,15,18,21,24]],
                    "APC Key 25":[
                        [32,33,34,35,36,37,38,39,82],
                        [24,25,26,27,28,29,30,31,83],
                        [16,17,18,19,20,21,22,23,84],
                        [8,9,10,11,12,13,14,15,85],
                        [0,1,2,3,4,5,6,7,86],
                        [64,65,66,67,68,69,70,71,81]],
                    "Launch Control XL":[
                        [41,42,43,44,57,58,59,60],
                        [73,74,75,76,89,90,91,92]]
                  };

class MidiController {
    constructor() {
        this.knobMatrix=[];
        this.sliderArray=[];
        this.buttonMatrix=[];
        this._control=[];
        this._noteson=[];
        this._deviceWaitingToEnable="";
        WebMidi
        .enable()
        .then(this.onEnabled)
        .catch(err => alert(err));
    }
    onEnabled() {
        console.log("MIDI Enabled");
        webMidiEnabled=true;
    }
    listenByName(aName) {
        // first see if name exists
        if (webMidiEnabled==false) {
            this._deviceWaitingToEnable=aName;
            return;
        }
        this._deviceWaitingToEnable="";
        this.inputDevice=WebMidi.getInputByName(aName);
        if (this.inputDevice!=false) {
            
            this.devicename=this.inputDevice._midiInput.name;                   
        } else {
            WebMidi.inputs.forEach((device, index) => {
                if (device.name.toLowerCase().includes(aName.toLowerCase())) {
                    this.devicename=device.name;
                    this.inputDevice=WebMidi.inputs[index];                
                }
            });
        }

        if (this.inputDevice!=false) {
            console.log("Found ",this.devicename);
            this.inputDevice.addListener("controlchange", e => {
                this._control[e.controller.number]=e.value;
                //console.log(`control change: ${e.controller.number} ${e.value} <br>`);
            });
            this.inputDevice.addListener("noteon", e => {
                this._noteson[e.note.number]=e.value;
            });
            this.inputDevice.addListener("noteoff", e => {
                this._noteson[e.note.number]=0;
            });

            if (_knobMatrix[this.devicename]) {
                this.knobMatrix=_knobMatrix[this.devicename];    
            }
            if (_sliderArray[this.devicename]) {
                this.sliderArray=_sliderArray[this.devicename];
            }
            if (_buttonMatrix[this.devicename]) {
                this.buttonMatrix=_buttonMatrix[this.devicename];
            }
        } else {
            console.log("Did not find Device. Available Input Devices:");
            WebMidi.inputs.forEach((device, index) => {
                console.log(`Input Device: ${index} ${device.name} <br>`);
            });

        }
    }
    checkIfLoaded() {
        if (this._deviceWaitingToEnable!="") {
            this.listenByName(this._deviceWaitingToEnable);
        }
    }
    knobsXY(x,y) { 
        this.checkIfLoaded();
        let result=0;
        if (y<this.knobMatrix.length) {
            if (x<this.knobMatrix[y].length) {
                let controlId=this.knobMatrix[y][x];
                if (this._control[controlId]) {
                    result=this._control[controlId];
                }
            }
        }
        return result;
    }
    slider(x) {
        this.checkIfLoaded();
        let result=0;
        if (x<this.sliderArray.length) {
            let controlId=this.sliderArray[x];
            if (this._control[controlId]) {
                result=this._control[controlId];
            }
        }
        return result;        
    }
    buttonsXY(x,y) { 
        this.checkIfLoaded();
        let result=0;
        if (y<this.buttonMatrix.length) {
            if (x<this.buttonMatrix[y].length) {
                let noteId=this.buttonMatrix[y][x];
                if (this._noteson[noteId]) {
                    result=this._noteson[noteId];
                }
            }
        }
        return result;
    }    
    notesPressed() {
        let result="";
        for (let i=0; i<this._noteson.length; i++) {
            if (this._noteson[i]) {
                result+=i+" ";
            }
        }
        return result;
    }
    debugData() {
        var result="debugData: ";
        if (webMidiEnabled) {
            if (WebMidi.inputs.length==0) {
                result+="No Input Devices Found\n";
            } else {
                result+="\nDevices:";
                WebMidi.inputs.forEach((device, index) => {
                    result+=`Device: ${index}: ${device.name}<br>\n`;
                });
                if (this._control) {
                    for (let i=0; i < this._control.length; i++) {
                        if (this._control[i]) {
                            result+=i+":"+this._control[i]+"\n";
                        }
                    }
                }
            }
        } else {
            result+="Not Enabled";
        }
        return result;
    }
}

