if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register("../../serviceworker.js").then(function(registration) {
            console.log('Registration successful, scope is:', registration.scope);
        }).catch(function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
let userMedia = require('./modules/userMedia/userMedia.js');
let notifier = require('./modules/domInteraction/notifier.js');

let augmenter = null;

let inRange = null;
let lookingAt = null;


let waitForReady = setInterval(function () {
    if (userMedia.isReady()) {
        augmenter = require('./modules/augmenter/augmenter.js');
        clearInterval(waitForReady);
        waitForVenue();
    }
},1000);


function waitForVenue() {
    let waitForInRange = setInterval(async function () {
        if (userMedia.getInRange() != null) {
            inRange = userMedia.getInRange();
            if(inRange != null && inRange.inSight == true) {
                lookingAt = inRange;
                augmenter.setVenue(lookingAt);
                clearInterval(waitForInRange);
                waitOutOfRange();
            }
        }
    },1000);
}

function waitOutOfRange() {
    let waitForOutOfRange = setInterval(async function () {
        if (inRange == null || !inRange.inSight) {
            inRange = null;
            lookingAt = null;
            augmenter.setVenue(null);
            clearInterval(waitForOutOfRange);
            waitForVenue();
        }
    },1000);
}