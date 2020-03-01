/* eslint-disable no-undef */
const Setter = {
    NONE: "none",
    UPPER: 'upper',
    LOWER: 'lower'
  };
  
const shortBuzzTimeInMs = 100;
const longBuzzTimeInMs = 200;

let upperLimit = 130;
let lowerLimit = 100;
let limitSetter = Setter.NONE;
let currentHeartRate = 0;
let hrConfidence = -1;

function drawTrainingHeartRate() {
    renderUpperLimit();

    renderCurrentHeartRate();

    renderLowerLimit();

    renderConfidenceBars();

    buzz();
}

function renderUpperLimit() {
    g.setColor(255,0,0);
    g.fillRect(145,40, 230, 70);
    g.fillRect(200,70, 230, 200);

    //Round middle left corner
    g.setColor(255,0,0);
    g.fillEllipse(135,40,155,70);

    //Round top right corner
    g.setColor(0,0,0);
    g.fillRect(225,40, 230, 45);
    g.setColor(255,0,0);
    g.fillEllipse(210,40,230,50);

    //Round inner corner
    g.setColor(255,0,0);
    g.fillRect(194,71, 199, 76);
    g.setColor(0,0,0);
    g.fillEllipse(180,71,199,82);

    //Round bottom
    g.setColor(255,0,0);
    g.fillEllipse(200,190, 230, 210);

    if(limitSetter === Setter.UPPER){
        g.setColor(255,255, 255);
        g.drawPoly([140,40,230,40,230,210,200,210,200,70,140,70], true);
    }

    g.setColor(255,255,255);
    g.setFontVector(10);
    g.drawString("Upper  : " + upperLimit, 150,50);
}

function renderCurrentHeartRate() {
    g.setColor(255,255,255);
    g.fillRect(55, 110, 175, 140);
    g.setColor(0,0,0);
    g.setFontVector(13);
    g.drawString("Current: " + currentHeartRate, 75,117);
}

function renderLowerLimit() {
    g.setColor(0,0,255);
    g.fillRect(10, 180, 100, 210);
    g.fillRect(10, 40, 40, 180); 

    if(limitSetter === Setter.LOWER){
        g.setColor(255,255, 255);
        g.drawPoly([10,40,40,40,40,180,100,180,100,210,10,210], true);
    }

    g.setColor(255,255,255);
    g.setFontVector(10);
    g.drawString("Lower  : " + lowerLimit, 20,190);
}

function renderConfidenceBars(){
    if(hrConfidence >= 85){
        g.setColor(0, 255, 0);
    } else if (hrConfidence >= 50) {
        g.setColor(255, 255, 0);
    } else if(hrConfidence >= 0){
        g.setColor(255, 0, 0);
    } else {
        g.setColor(0, 0, 0);
    }

    g.fillRect(55, 110, 65, 140);
    g.fillRect(175, 110, 185, 140);
}

function buzz()
{
    if(currentHeartRate > upperLimit)
    {
        Bangle.buzz(shortBuzzTimeInMs);
        setTimeout(() => { Bangle.buzz(shortBuzzTimeInMs); }, shortBuzzTimeInMs);
        setTimeout(() => { Bangle.buzz(shortBuzzTimeInMs); }, shortBuzzTimeInMs);
    }

    if(currentHeartRate < upperLimit)
    {
        Bangle.buzz(longBuzzTimeInMs);
        setTimeout(() => { Bangle.buzz(longBuzzTimeInMs); }, longBuzzTimeInMs);
    }
}

function onHrm(hrm){
    currentHeartRate = hrm.bpm;
    hrConfidence = hrm.confidence;
}

function setLimitSetterToLower() {
    limitSetter = Setter.LOWER;
    console.log("Limit setter is lower");
    renderUpperLimit();
    renderLowerLimit();
}

function setLimitSetterToUpper() {
    limitSetter = Setter.UPPER;
    console.log("Limit setter is upper");
    renderLowerLimit();
    renderUpperLimit();
}

function incrementLimit(){
    if(limitSetter === Setter.UPPER){
        upperLimit++;
        renderUpperLimit();
        console.log("Upper limit: " + upperLimit);
    } else {
        lowerLimit++;
        renderLowerLimit();
        console.log("Lower limit: " + lowerLimit);
    }
}

function decrementLimit(){
    if(limitSetter === Setter.UPPER){
        upperLimit--;
        renderUpperLimit();
        console.log("Upper limit: " + upperLimit);
    } else {
        lowerLimit--;
        renderLowerLimit();
        console.log("Lower limit: " + lowerLimit);
    }
}

// Show launcher when middle button pressed
function switchOffApp(){
    Bangle.setHRMPower(0);
    Bangle.showLauncher();
}

// special function to handle display switch on
Bangle.on('lcdPower', (on) => {
    g.clear();
    if (on) {
        Bangle.drawWidgets();
        // call your app function here
        drawTrainingHeartRate();
    }
});

Bangle.setHRMPower(1);
Bangle.on('HRM', onHrm);

// refesh every sec
setInterval(drawTrainingHeartRate, 1000);

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
drawTrainingHeartRate();

setWatch(switchOffApp, BTN2, {repeat:false,edge:"falling"});

setWatch(incrementLimit, BTN1, {edge:"rising", debounce:50, repeat:true});

setWatch(decrementLimit, BTN3, {edge:"rising", debounce:50, repeat:true});

setWatch(setLimitSetterToLower, BTN4, {edge:"rising", debounce:50, repeat:true});

setWatch(setLimitSetterToUpper, BTN5, {edge:"rising", debounce:50, repeat:true});
