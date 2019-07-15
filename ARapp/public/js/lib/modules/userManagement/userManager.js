let config = {
    apiKey: "AIzaSyDBsZTjo-IYt-OMf95QKUU1QH63w3y6JLk",
    authDomain: "venue-ar.firebaseapp.com",
    databaseURL: "https://venue-ar.firebaseio.com",
    projectId: "venue-ar",
    storageBucket: "venue-ar.appspot.com",
    messagingSenderId: "258095649301"
};
if(!firebase) {
    firebase.initializeApp(config);
}


let friendsList = document.getElementById("friendsList");
//let database = firebase.database();
module.exports = {
    getCurrentUserUid: function(){
        return JSON.parse(window.localStorage.getItem("firebase:authUser:"+config.apiKey+":[DEFAULT]")).uid;
    },
    getCurrentUserFriends: function () {
        let uid = this.getCurrentUserUid();
        let xhttp = new XMLHttpRequest();
        let friends;
        xhttp.onreadystatechange = function () {
            if(this.status == 200 && this.readyState == 4) {
                friends = JSON.parse(this.response);
                let userDiv = document.createElement("div");
                userDiv.classList.add("userDetails");
                for(let i=0; i<friends.length; i++){
                    let h = "";
                    h += "<img class='userPic' src='" +friends[i].photoURL+"' alt='"+friends[i].displayName+"'>";
                    h += "<p class='username'>" +friends[i].displayName+"</p>";
                    h += "<input id='uid' type='hidden' name='uid' value='"+friends[i].uid+"'>";
                    h += "<i id='sendButton' class='material-icons button share'>send</i>";
                    userDiv.innerHTML+=h;
                    friendsList.appendChild(userDiv);
                }
            }
        };
        xhttp.open("GET","/user/"+uid+"/friends",false);
        xhttp.send();
    }
};

function getCurrentUser() {
    return firebase.auth().currentUser;
}