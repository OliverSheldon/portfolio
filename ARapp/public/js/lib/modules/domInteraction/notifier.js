let domEditior = require("./domEditor.js");

let config = {
    apiKey: "AIzaSyDBsZTjo-IYt-OMf95QKUU1QH63w3y6JLk",
    authDomain: "venue-ar.firebaseapp.com",
    databaseURL: "https://venue-ar.firebaseio.com",
    projectId: "venue-ar",
    storageBucket: "venue-ar.appspot.com",
    messagingSenderId: "258095649301"
};
firebase.initializeApp(config);
let database = firebase.database();
let currentUser = JSON.parse(window.localStorage.getItem("firebase:authUser:"+config.apiKey+":[DEFAULT]"));
let notifications = [];

setTimeout(function () {


let notebox = document.getElementById("notifications");
if (database != null) {
    let ref = database.ref('user/' + currentUser.uid + '/notifications');
    ref.on('value', function (snapshot) {
        let snap = snapshot.val();
        let x = 0;
        for (let key in snap) {
            if (snap[key].seen != true) {
                let icon = document.createElement("i");
                icon.classList.add("material-icons");
                icon.innerText += "chat";
                icon.addEventListener("click", function () {
                    openNote(snap[key]);
                });
                notebox.appendChild(icon);
            }
            x++
        }
    });
}
},1000);


function openNote(note) {
    let venueId;
    database.ref('shared/'+note.resourceId).once('value').then(function (snapshot) {
        venueId = snapshot.val().venueId;
    }).then(function () {
        database.ref('venues/').once('value').then(function (snapshot) {
            domEditior.applyToDOM(snapshot.val()[venueId]);
        });
    });
}