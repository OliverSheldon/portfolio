let config = {
    apiKey: "AIzaSyDBsZTjo-IYt-OMf95QKUU1QH63w3y6JLk",
    authDomain: "venue-ar.firebaseapp.com",
    databaseURL: "https://venue-ar.firebaseio.com",
    projectId: "venue-ar",
    storageBucket: "venue-ar.appspot.com",
    messagingSenderId: "258095649301"
};
firebase.initializeApp(config);

if(firebase != null){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    let ui = new firebaseui.auth.AuthUI(firebase.auth());

    let uiConfig = {
      callbacks: {
        signInSuccess: function(currentUser, credential, redirectUrl) {
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","/",true);
            xhttp.setRequestHeader("Content-type", "text/plain");
            xhttp.send("uid: " + currentUser.uid);
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      signInSuccessUrl: '/ar.html',
      signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ]
    };
    
    ui.start('#firebaseui-auth-container', uiConfig);
}

