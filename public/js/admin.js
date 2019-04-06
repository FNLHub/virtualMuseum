document.addEventListener('DOMContentLoaded', function () {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    //TEST FOR AUTH USER
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    firebase.auth().onAuthStateChanged(function(user) {
if (user) {
// User is signed in.
var displayName = user.displayName;
var email = user.email;
var emailVerified = user.emailVerified;
var photoURL = user.photoURL;
var isAnonymous = user.isAnonymous;
var uid = user.uid;
var providerData = user.providerData;
// ...
} else {
// User is signed out.
// ...
}
});




    //BUSHER LOOK HERE ************************************ (0)_(0)
    //Place a change listener on the #png button
    var fileObj, fileMtl, fileJpg, filePng; //declared global vars for files
    $("#png").on('change', function (evt) {

      var files = evt.delegateTarget.files;
      filePng = files[0];

      console.log(filePng);
    })
    //BUSHER stop LOOKING HERE ************************************ (-)_(-)



    //sends obj to firebase storage
    $("#obj").on('change', function (evt) {

      var files = evt.delegateTarget.files;
      fileObj = files[0];

      console.log(evt);
    })

    //send mtl file
    $("#mtl").on('change', function (evt) {

      var files = evt.delegateTarget.files;
      fileMtl = files[0];


      console.log(fileMtl);
    })
    //send jpg file
    $("#jpg").on('change', function (evt) {

      var files = evt.delegateTarget.files;
      fileJpg = files[0];

      console.log(fileJpg);
    })
    //logs on console everytime the button is clicked
    $("#submit").on('click', function () {
      console.log("my button click");
      var userCategory = $("#userInput").val();
      if (!userCategory) userCategory = "default"; //just in case user does not type into the input box

      //put the file in storage using the users category
      firebase.storage().ref().child('pics/' + userCategory + '/' + fileObj.name).put(fileObj).then(function (fileSnapshot) {
        // Do something after saved in database
        // How about getting the download url?
        fileSnapshot.ref.getDownloadURL().then(function (url) {
          console.log(url);
        });
      });
      firebase.storage().ref().child('pics/' + userCategory + '/' + filePng.name).put(filePng).then(function (fileSnapshot) {

        fileSnapshot.ref.getDownloadURL().then(function (url) {
          console.log(url);
        });
      });
      firebase.storage().ref().child('pics/' + userCategory + '/' + fileMtl.name).put(fileMtl).then(function (fileSnapshot) {

        fileSnapshot.ref.getDownloadURL().then(function (url) {
          console.log(url);
        });
      });
      firebase.storage().ref().child('pics/' + userCategory + '/' + fileJpg.name).put(fileJpg).then(function (fileSnapshot) {

        fileSnapshot.ref.getDownloadURL().then(function (url) {
          console.log(url);
        });
      });
    })
  })