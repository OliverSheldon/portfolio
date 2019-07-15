if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
        registration.update();
    }).catch(function(err) {
        console.log('Service worker registration failed: ', err);
    });
}

let isOnline;

let page = window.location.pathname;
let url = new URL(window.location.href);

let fireDB;
let currentUser;

if(navigator.onLine && firebase != undefined){
    isOnline = true;
    fireDB = firebase.database();
    currentUser = JSON.parse(window.localStorage.getItem("firebase:authUser:AIzaSyDKgwUE1Jf12R8Xn7Rf_44g01imBiS9GYE:[DEFAULT]"));
    updateLocalDB();
    checkUnsent();
} else{
    isOnline = false;
}

//Timetable
let time = new Date();
let year = time.getFullYear();
let month = time.getMonth() + 1;
let day = time.getDate();
let currentTime = time.toLocaleTimeString().substr(0,5).replace(":","");
let dateInput;

//Map
let map;

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let localDbJson = JSON.parse(localStorage.getItem("db"));

if(page.includes("mytimetable")){
    dateInput = document.getElementById("date");
    updateAgenda();
    dateInput.addEventListener("change",function (event) {
        let date = event.target.value.toString();
        year = date.substr(0,4);
        month = date.substr(5,2);
        day = date.substr(8,2);
        if(month.substr(0,1) == 0){month = month.substr(1,1);}
        if(day.substr(0,1) == 0){day = day.substr(1,1);}
        let actBut = document.getElementById("timetable").getElementsByClassName("actionButton")[0];
        actBut.parentElement.parentElement.classList.remove("open");
        //actBut.parentElement.parentElement.classList.add("closed");
        actBut.classList.remove("fa-chevron-up");
        actBut.classList.add("fa-chevron-down");
        updateAgenda(actBut);
    });
} else if(page.includes("events")){
    getEvents();
} else if(page.includes("contact")){
    let actBut = document.getElementsByTagName("form")[0].getElementsByClassName("actionButton")[0];
    actBut.addEventListener("click", function () {
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let message = document.getElementById("message").value;
        dealWithEmail(name, email, message);
    });
}

function updateLocalDB() {
    let ref = fireDB.ref();
    ref.on('value', function (snapshot) {
        let snap = JSON.stringify(snapshot.val());
        localStorage.setItem('db',snap);
    });
}

function updateAgenda(newButton) {
    let agenda = document.getElementsByClassName("agenda")[0];
    let title = document.getElementById("timetable").getElementsByTagName("header")[0].getElementsByTagName("h2")[0];
    agenda.innerHTML = "";
    let actBut;

    if(!newButton) {
        actBut = document.getElementById("timetable").getElementsByClassName("actionButton")[0];
    } else {
        actBut = newButton;
    }
    try{
        let dayEvents = localDbJson.timetables[year][month][day].events;
        title.innerHTML = day+"/"+month+"/"+year;
        if(actBut.classList.contains("hidden")){
            actBut.classList.remove("hidden");
        }
        let pEvents = [];
        let lEvents = [];
        let cEvent;
        let diff;
        let cEventDiff;
        for (let i = 0; i < dayEvents.length; i++) {
            let event = dayEvents[i];
            if (!cEventDiff) {
                if (currentTime < event.time) {
                    cEventDiff = event.time - currentTime;
                } else {
                    cEventDiff = currentTime - event.time;
                }
                cEvent = event;
            } else {
                if (currentTime < event.time) {
                    diff = event.time - currentTime;
                } else {
                    diff = currentTime - event.time;
                }
                if (diff < cEventDiff) {
                    cEvent = event;
                    cEventDiff = diff;
                }
            }
            if (cEventDiff === 0) {
                break;
            }
        }

        for (let i = 0; i < dayEvents.length; i++) {
            let event = dayEvents[i];
            if (event.time < cEvent.time) {
                pEvents.push(event);
            } else if (event.time > cEvent.time) {
                lEvents.push(event);
            }
        }
        let t;
        if (pEvents.length > 0) {
            for (let i = 0; i < pEvents.length; i++) {
                t = pEvents[i].time.substr(0, 2) + ":" + pEvents[i].time.substr(2, 2);
                agenda.innerHTML += '<span class="event previousEvent closed"><span class="eventTime">' +
                    t +
                    '</span><h3 class="eventName">' +
                    pEvents[i].name +
                    '</h3></span>';
            }
        }
        t = cEvent.time.substr(0, 2) + ":" + cEvent.time.substr(2, 2);
        agenda.innerHTML += '<span class="currentEvent"><span class="eventTime">' +
            t +
            '</span><h3 class="eventName">' +
            cEvent.name +
            '</h3></span>';
        if (lEvents.length > 0) {
            for (let i = 0; i < lEvents.length; i++) {
                t = lEvents[i].time.substr(0, 2) + ":" + lEvents[i].time.substr(2, 2);
                agenda.innerHTML += '<span class="event laterEvent closed"><span class="eventTime">' +
                    t +
                    '</span><h3 class="eventName">' +
                    lEvents[i].name +
                    '</h3></span>';
            }
        }
        if(!newButton) {
            actBut.addEventListener("click", function () {
                toggleOpen(actBut);
            });
        }
    } catch (e) {
        agenda.innerHTML = "<p>No events found on selected day!</p>";
        actBut.classList.add("hidden");
        year = time.getFullYear();
        month = time.getMonth();
        day = time.getDate();
    }
}

function toggleOpen (button) {
    let timetable = document.getElementById("timetable");
    let x = document.getElementsByClassName("event");
    for(let i=0; i<x.length; i++) {
        if (!x[i].classList.contains("open")) {
            //button.parentElement.parentElement.classList.remove("closed");
            x[i].classList.add("open");
            timetable.setAttribute("aria-expanded", "true");
        } else {
            x[i].classList.remove("open");
            //button.parentElement.parentElement.classList.add("closed");
            timetable.setAttribute("aria-expanded", "false");
        }
    }
    if(button.classList.contains("fa-chevron-down")){
        button.classList.remove("fa-chevron-down");
        button.classList.add("fa-chevron-up");
    } else if(button.classList.contains("fa-chevron-up")){
        button.classList.remove("fa-chevron-up");
        button.classList.add("fa-chevron-down");
    }
}

function buildMap() {
    let allLoc = localDbJson.locations["type"];
    let uni = allLoc["uni"];
    let union = allLoc["union"];
    let shop = allLoc["shop"];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 53.009086, lng: -2.178532},
        zoom:16,

    });
    addMarkers("uni",uni);
    addMarkers("union",union);
    addMarkers("shop",shop);
}

function addMarkers(type,locs) {
    for(let i=0;i<locs.length;i++) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(locs[i].lat, locs[i].long),
            map: map,
            icon:"../img/"+type+"MapMarker.png"
        });
        let infowindow = new google.maps.InfoWindow({
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(locs[i].name);
            infowindow.open(map,marker);
        });
    }
}

function dealWithEmail(name, email, message) {
    if(isOnline){
        sendMail(name, email, message);
    } else {
        localStorage.setItem('unsent',JSON.stringify([{
            "type":"email",
            "name":name,
            "email":email,
            "message":message
        }]));
        alert("You are currently offline. Your message will be send when your connection is restored.");
    }
}

function checkUnsent() {
    try {
        let unsent = JSON.parse(localStorage.getItem("unsent"));
        if(unsent != undefined) {
            for (let i=0; i<unsent.length; i++) {
                if (unsent[i].type == "email") {
                    sendMail(unsent[i].name, unsent[i].email, unsent[i].message);
                    localStorage.removeItem(unsent[i]);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function sendMail(name, email, message) {
    alert("Your message has been sent");
}

function getEvents() {
    let tiles = document.getElementsByClassName("tiles")[0];
    let events = JSON.parse(localStorage.getItem("db"))["events"];
    for(let event in events){
        console.log(events[event]);
        tiles.innerHTML += '<div class="tile agenda"><span class="tileInner"><h3 class="eventName">' +
            events[event].name+'</h3><span class="eventTime">'+
            events[event].date+'</span><span class="eventTime"> '+
            events[event].time+'</span><span class="eventTime"> '+
            events[event].location+'</span></span></div>';
    }
}