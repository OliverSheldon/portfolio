let fLat = 0;
let fLong = 0;
let eLat = 0;
let eLong = 0;

let accuracy = 0;

let errors = [];

let options = {
    enableHighAccuracy: true,
    timeout: 3000,
};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(setPosition, geoError, options);
} else {
    errors.push("Geolocation is not supported by this browser.");
}

function setPosition (position) {
    fLat = eLat;
    fLong = eLong;
    eLat = position.coords.latitude;
    eLong = position.coords.longitude;

    accuracy = position.coords.accuracy;
}

function geoError(err) {
    errors.add(err);
}

function toRad(x) {
    return x * (Math.PI/180)
}

module.exports = {
    getMovement: function(){
        if(eLat == 0 && eLong == 0){
            return false;
        } else {
            return [fLat, fLong, eLat, eLong];
        }
    },

    currentLat: function(){
        return eLat;
    },

    currentLong: function(){
        return eLong;
    },

    getAccuracy: function () {
        return accuracy;
    },

    getErrors: function() {
        return errors;
    },

    refreshRate: function () {
        return options.timeout;
    },

    getDistance: function (loc) {
        //Source: https://www.movable-type.co.uk/scripts/latlong.html
        let lat1 = loc[0];
        let lon1 = loc[1];
        let lat2 = eLat;
        let lon2 = eLong;
        
        //Haversine formula
        let R = 6371; // Radius of the earth in km
        let dLat = toRad(lat2-lat1);  // toRad below
        let dLon = toRad(lon2-lon1);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        //distance in m
        return ((R * c)*1000).toFixed(2);
    }
};