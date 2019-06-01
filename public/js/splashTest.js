
//Globals here

$(document).ready(function () {

  //first step to sign in for database security.
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    console.log(error.code);
    console.log(error.message)
  });
  // auth change listener
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in and can read the database
      //var isAnonymous = user.isAnonymous;
      //var uid = user.uid;
      console.log("user: "+user.isAnonymous);
      $("#appAuth").html(user.isAnonymous + " "+ user.uid);
      $("#helpInternet").html('<i class="material-icons">check_circle</i> Online.');
      $("#helpInternet").css("color", "green");
      

    } else {
      // User is signed out.
    }
    
  });



});

