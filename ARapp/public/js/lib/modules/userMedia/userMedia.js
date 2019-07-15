let geolocation = require('./geolocation.js');
let Compass = require('./compass.js');
let cameraStream = null;
let venues = Object.values(require('../../../../../venue-ar-testdb.json').venues);

//outputs
let compOut = "";
let venueOut = "";
let subject = "";

let venueList = [];
let movement = null;

let oldAccuracy = 0;
let accuracy = null;

let compass = new Compass();
let venueCompass = new Compass();

let device = new Proxy({}, {
    set(target, key, value){
        target[key] = value;
        switch (key){
            case "heading":
                compOut.innerHTML = "<br> Compass: " + device.heading + "°";
                break;
        }
    }
});

let subjectHeading = 0;

let deviceHeadingSet = false;
let oldDeviceHeading;
let devOrientMove = 0;
let devOrientUp = null;

let mediaReady = false;

let inRange = null;
let lookingAt = null;

window.onload = function loaded(){

    cameraStream = require('./cameraStream.js');
    compOut = document.getElementById("compass");
    venueOut = document.getElementById("venueList");
    subject = document.getElementById("subject");

    window.addEventListener("deviceorientation", function (event) {
        if (oldDeviceHeading > event.alpha) {
            devOrientMove = oldDeviceHeading - event.alpha;
            devOrientUp = false;
        } else if (oldDeviceHeading < event.alpha) {
            devOrientMove = event.alpha - oldDeviceHeading;
            devOrientUp = true;
        }
        oldDeviceHeading = event.alpha;
    }, true);

    if(venues != undefined && venues != null) {
        setVenueList();
    }

    setInterval(function () {
        movement = geolocation.getMovement();
        accuracy = geolocation.getAccuracy();
        if(movement != null && accuracy > oldAccuracy) {
            compass.setHeading(movement);
            oldAccuracy = accuracy;
        }
        updateVenueDistance();
    }, geolocation.refreshRate());

    setInterval(function () {
        if(device.heading == null || device.heading == undefined  || accuracy > oldAccuracy) {
            device.heading = compass.getHeading();
        } else{
            device.heading = updateHeading(device.heading, false);
        }
/*        compOut.innerHTML = "<br> Compass: " + device.heading + "°";*/

        let x = 0;
        venueOut.innerHTML = "";
        while(x<venueList.length){
            let n = venueList[x].name;
            let d = venueList[x].distance;
            venueOut.innerHTML +=
                "<br>Name: " + n +
                "<br>Distance: " + d + "m"
            ;

            if (inRange == null && withinRange(d)) {
                inRange = venueList[x];
            }
            x++;
        }

        if(device.heading && inRange != null && withinRange(inRange.distance)){
            let dif = null;
            if(inRange.heading == null || inRange.heading == undefined  || accuracy > oldAccuracy) {
                venueCompass.setHeading([
                    geolocation.currentLat(),
                    geolocation.currentLong(),
                    inRange.location[0],
                    inRange.location[1]
                ]);
                inRange.heading = venueCompass.getHeading();
                inRange.difference = inRange.heading - device.heading;
            } else{
                inRange.difference = updateHeading(inRange.difference,true);
            }

            subject.innerHTML = "<br>Name: " + inRange.name +
                "<br>Difference: " + inRange.difference;

            inRange.inSight = isLookingAt(inRange.difference);

        } else if(inRange && !withinRange(inRange.distance)){
            inRange = null;
            subject.innerHTML = "";
        }

        if(mediaReady == false && cameraStream.isReady() && venueList != null){
            mediaReady = true;
        }

        devOrientUp = null;
        devOrientMove = 0;
    }, 1);

    let menuToggle = document.getElementById("menuToggle");
    let menu = document.getElementById("locationDataMenu");

    menuToggle.addEventListener("click", function () {
        switch (menu.className) {
            case "hide":
                menu.setAttribute("class", "show");
                break;
            case "show":
                menu.setAttribute("class", "hide");
                break;
        }
    });
};

/*function updateDeviceHeading() {
    console.log(device.heading);
    compOut.innerHTML = "<br> Compass: " + device.heading + "°";
}*/


function setVenueList(){
    let x = 0;
    while(x<venues.length){
        venueList.push(venues[x]);
        x++;
    }
}

function  updateVenueDistance() {
    if(inRange != null){
        inRange.distance = geolocation.getDistance(inRange.location);
    }
    let x = 0;
    while(x<venueList.length) {
        venueList[x].distance = geolocation.getDistance(venueList[x].location);
        x++
    }
    venues.sort(function (a,b){
        return a.distance - b.distance;
    });
}

function withinRange(distance) {
    return (distance <= 100);
}

function isLookingAt(heading) {
    return (heading >= -45 && heading <= 45);
}

module.exports = {
    getInRange : function () {
        return inRange;
    },

    isReady : async function(){
        return mediaReady;
    }
};

function updateHeading(heading,allowNegative){
    if(devOrientUp != null) {
        if (devOrientUp == true) {
            heading = heading - devOrientMove;
        } else if (devOrientUp == false) {
            heading = heading + devOrientMove
        }
        heading = normaliseHeading(heading, allowNegative);
    }
    return heading;
}

function normaliseHeading(heading, allowNegative) {

    if(allowNegative) {
        if (heading > 179) {
            heading = heading - 360;
        } else if (heading < -181) {
            heading = heading + 360;
        }
    } else{
        if (heading > 359) {
            heading = heading - 360;
        } else if (heading < 1) {
            heading = heading + 360;
        }
    }
    return heading;
}

