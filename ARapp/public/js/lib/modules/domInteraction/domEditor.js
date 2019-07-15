/*const mdc = require('material-components-web');
const mdcDrawer = require('../../../../../node_modules/@material/drawer/dist/mdc.drawer.js');
const MDCPersistentDrawer = mdcDrawer.MDCPersistentDrawer;
const MDCPersistentDrawerFoundation = mdcDrawer.MDCPersistentDrawerFoundation;
const util = mdcDrawer.util;
let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));*/

let interactManager = null;

let subject = null;

module.exports = {
    setVenue: function (venue) {
        subject = venue;
        this.applyToDOM();
    },

    unsetVenue: function(){
        subject = null;
    },

    reveal: function () {
        //document.querySelector('.menu').addEventListener('click', () => drawer.open = true);
        let draw = document.getElementById("venueInfo");
        draw.classList.remove("hide");
        draw.classList.add("show");

        /*document.getElementById("venueId").setAttribute("value",subject.name);*/
    },
    applyToDOM: function(s) {
        let name = document.getElementById("venueName");
        let desc = document.getElementById("description");
        let rating = document.getElementById("rating");
        if(s != null){
            let f = null;

            if(isInt(s.rating)){
                f = false;
            } else{
                f = true;
            }

            name.innerHTML = s.name;
            desc.innerHTML = s.description;
            rating.innerHTML = makeStars(s.rating,f);
            this.reveal();
        }
        if(subject != null) {
            let f = null;

            if(isInt(subject.rating)){
                f = false;
            } else{
                f = true;
            }

            name.innerHTML = subject.name;
            desc.innerHTML = subject.description;
            rating.innerHTML = makeStars(subject.rating,f);
        }
        interactManager = require('./interactManager.js');
    }
};


function isInt(n) {
    return n % 1 === 0;
}

function makeStars(x,f) {
    let star = '<i class="material-icons">star</i>';
    let starHalf = '<i class="material-icons">star_half</i>';
    let html = '';

    switch (f) {
        case true:
            x -= 0.5;
            for(let i = 0; i<x; i++){
                html += star;
            }
            html += starHalf;
            break;
        case false:
            for(let i = 0; i<x; i++){
                html += star;
            }
            break;
    }
    return html;
}