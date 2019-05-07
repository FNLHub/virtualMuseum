
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
      getCategories();
      displayScans();

    } else {
      // User is signed out.
    }
  });

});

function getCategories(){
  let query = firebase.firestore().collection('scanUploads').orderBy('category', 'asc');
  query.get().then(function(collection){

    collection.forEach(function(doc){
      console.log(doc.data().category);
    });

  });

}

function displayScans(argCategory) {
  //Todo: filter for chosen category

  var query = firebase.firestore().collection('scanUploads').orderBy('name', 'asc');
  //Real time listener set here
  query.onSnapshot(function (collection) {

    $("#splash").fadeOut();
    $("#scanCards").empty(); //clear out div in index.html

    collection.forEach(function (doc) {

      var scanCard =
        '<div id="card-' + doc.id + '"  class="scan-card mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title"><h2 class="mdl-card__title-text">' + doc.data().name + '</h2></div>' +
          '<div class="mdl-card__supporting-text">' +
            '<div>Category:' + doc.data().category + '</div>' +
            '<div>Description: ' + doc.data().description + '</div>' +
            '<div><a href="' + doc.data().objectURL + '" target="_blank">Download Object</a></div>' +
            '<div><a href="' + doc.data().textureURL + '" target="_blank">Download Texture</a></div>' +
          '</div>' +
          '<div class="mdl-card__actions mdl-card--border">' +
            '<button id="go-' + doc.id + '" class="floatRight mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent">' +
            'View 3d Scan <i class="material-icons">remove_red_eye</i>' +
            '</button>' +
          '</div>' +
          '<div class="mdl-card__menu">'+
            '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
              '<i class="material-icons">share</i>'+
            '</button>'+
          '</div>'+
        '</div>';

      $("#scanCards").append(scanCard);

      //Set preview button listener here
      $("#go-" + doc.id).on('click', function () {
        window.open("viewer.html?scanId=" + doc.id);
      });

      /* 
        //TODO: Add thumbnail to background of card. Here is the potential code.
        if(doc.data().thumbnail)
          $("#card-" + doc.id + " .mdl-card__title").css('background-image', 'url(' + doc.data().thumbnail + ')');
      */

    });


  });
};

