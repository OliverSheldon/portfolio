let draw = document.getElementById("venueInfo");

let share = document.getElementById("shareButton");
share.addEventListener("click",initShare);

let save = document.getElementById("saveButton");
save.addEventListener("click",initSave);

let close = document.getElementById("close");
close.addEventListener("click",closeDraw);

let friendsList = document.getElementById("friendsList");
let sendButtons;

let userManager = require("../userManagement/userManager.js");

function initShare() {
    friendsList.classList.remove("hide");
    friendsList.classList.add("show");
    userManager.getCurrentUserFriends();
    sendButtons = document.getElementsByClassName("share");
    for(let i=0; i<sendButtons.length; i++) {
        sendButtons[i].addEventListener("click",function () {
            sendVenue(i);
        });
    }
}

function closeDraw() {
    draw.classList.remove("show");
    draw.classList.add("hide");
}

function initSave() {
    console.log("Save");
}

function sendVenue(id) {
    let toUid = sendButtons[id].parentElement.getElementsByTagName("input")[0].value.toString();
    let fromUid = userManager.getCurrentUserUid();
    let name = document.getElementById("venueName").innerText;
    let json = JSON.stringify({"venueName":name, "toUid":toUid, "fromUid":fromUid});
    let displayName = sendButtons[id].parentElement.getElementsByClassName("username")[0].innerText;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.status == 200 && this.readyState == 4) {
        }
    };
    xhttp.open("Post","/share",true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(json);

}
