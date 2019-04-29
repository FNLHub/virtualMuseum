
    //Start script when document is loaded in
    $(document).ready(function () {
        console.log("ready!");
  
        // Authentication handling starts here ***************************
        const auth = firebase.auth();
        //Auth Listener is triggered on start up
        auth.onAuthStateChanged(user => {
          //returns null if user is not logged in and true if they are logged in
          if (user) {
            console.log('user logged in: ', user);
            $("#loginBtn").html(user.displayName + " Sign Out");
          } else {
            console.log('User logged out');
            $("#loginBtn").html("Sign in with Google");
          }
        });
  
        // LOGIN BTN LISTENER HERE
        $("#loginBtn").on('click', function () {
  
          var btnHtml = $("#loginBtn").html();
          if (btnHtml == "Sign in with Google") { //Sign in
  
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
              console.log(result.user.displayName);
              //Auth listener will be triggered
            }).catch(function (error) {
              console.log(error.message);
            });
  
          } else { //sign out
            firebase.auth().signOut().then(function () {
              //Auth Listener will be triggered
            }).catch(function (error) {
              console.log(error.message);
            });
          }
  
        });
        // Authentication handling ends here ***************************
  
  
  
      });