// window.addEventListener("deviceorientation", handleOrientation,true );
//
// let heading = 0;
// module.exports = {
//     setHeading: function(position, accuracy) {
//         heading = calcHeading(position);
//     },
//
//     getHeading : function () {
//         return heading;
//     }
// };
//
// function calcHeading(position) {
//     //https://www.movable-type.co.uk/scripts/latlong.html
//     let startLat = position[0];
//     let startLong = position[1];
//     let endLat = position[2];
//     let endLong = position[3];
//
//     let dLong = (endLong - startLong);
//     let y = Math.sin(dLong) * Math.cos(endLat);
//     let x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLong);
//     let bearing = toDegrees(Math.atan2(y, x));
//     return  Math.round(360 - (bearing + 360) % 360);
// }
//
// // https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation#Processing_orientation_events
// function handleOrientation(event) {
//     event.alpha = heading;
//     heading = event.alpha;
// }
//
// function toDegrees(x) {
//     return x * 180 / Math.PI;
// }
class Compass {
    constructor() {
        this.heading = 0;
    }

    setHeading(movement) {
        this.heading = this.calcHeading(movement);
    };

    getHeading() {
        return this.heading;
    };

    calcHeading(movement) {
        //Source: https://www.movable-type.co.uk/scripts/latlong.html
        let startLat = movement[0];
        let startLong = movement[1];
        let endLat = movement[2];
        let endLong = movement[3];

        let dLong = (endLong - startLong);
        let y = Math.sin(dLong) * Math.cos(endLat);
        let x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLong);
        let bearing = this.toDegrees(Math.atan2(y, x));
        return Math.round(360 - (bearing + 360) % 360);
    }

    toDegrees(x) {
        return x * 180 / Math.PI;
    }
}

module.exports = Compass;

// https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation#Processing_orientation_events


