let camera = document.getElementById("camera");

let activeStream = false;

    //let VWidth = document.innerWidth;
    //let VHeight = document.innerHeight;
let mediaConstraints = {
        audio: false,
        video: { facingMode: "environment" },
        facingMode: { exact: "environment" }
};


navigator.mediaDevices.getUserMedia(mediaConstraints)
    .then(
        function(stream) {
        camera.srcObject = stream;
        camera.play();
        activeStream = true;
    })
    .catch(function(err) {
        console.log("An error occured! " + err.toString());
        activeStream = false;
    });

module.exports = {
    isReady : function () {
        return activeStream;
    }
};