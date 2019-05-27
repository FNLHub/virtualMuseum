
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
      //getCategories();
      //displayScans();

    } else {
      // User is signed out.
    }
  });


  showAllScansBtn
  $("#showAllScansBtn").on('click',function(){
    $("#mainLoadingBar").show();
    displayScans();
  })

});

function getCategories(){
  let query = firebase.firestore().collection('NewUploads').where("published", "==", true).orderBy('category', 'asc');
  query.get().then(function(collection){

    collection.forEach(function(doc){
      console.log(doc.data().category);
    });

  });

}

function displayScans(argCategory) {
  //Todo: filter for chosen category

  var query = firebase.firestore().collection('NewUploads').where("published", "==", true).orderBy('title', 'asc');
  //Real time listener set here
  query.onSnapshot(function (collection) {

    $("#splash").fadeOut();
    $("#scanCards").empty(); //clear out div in index.html

    collection.forEach(function (doc) {

      var scanCard =
        '<div id="card-' + doc.id + '"  class="scan-card mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title"><h2 class="mdl-card__title-text">' + doc.data().title + '</h2></div>' +
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

      var newScanCard =
      '<div id="card-' + doc.id + '"  class="detail-card mdl-card mdl-shadow--2dp mdl-card--border">'+
        '<div class="mdl-card__title">'+
          '<h2 class="mdl-card__title-text">'+doc.data().title+'</h2>'+
        '</div>'+
        '<div class="mdl-card__supporting-text">'+
          '<div id="cardDescription">' + doc.data().description + '</div>'+
          '<div>Category: <span id="cardCategory">' + doc.data().category + '</span></div>'+
          '<div>Size: <span id="cardObjectSize">'+Math.round(doc.data().objectBytes / 100000.0)/10 + ' mb</span></div>'+
        '</div>'+
        '<div class="mdl-card__actions mdl-card--border">'+
          '<button id="obj-' + doc.id + '" class="mdl-button mdl-js-button mdl-js-ripple-effect">'+
            '<i class="material-icons">cloud_download</i> Object'+
          '</button>'+
          '<button id="tex-' + doc.id + '" class="mdl-button mdl-js-button mdl-js-ripple-effect">'+
            '<i class="material-icons">cloud_download</i> Texture'+
          '</button>'+
        '</div>'+
        '<div class="mdl-card__menu">'+
          '<button id="share-' + doc.id + '" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
            '<i class="material-icons">share</i>'+
          '</button>'+
          '<button id="go-' + doc.id + '" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
            '<i class="material-icons">remove_red_eye</i>'+
          '</button>'+
        '</div>'+
      '</div>';

      $("#scanCards").append(newScanCard);

      $("#card-" + doc.id + " .mdl-card__title").css("background","url('"+doc.data().snipURL+"') center/cover");

      //Set button listeners here
      $("#go-" + doc.id).on('click', function () {
        window.open("viewer.html?scanId=" + doc.id);
      });
      $("#share-" + doc.id).on('click', function () {
        if (navigator.share) {
          navigator.share({
              title: 'FNL 3d Scan',
              text: 'Check out this awesome 3d scan — let it load in!',
              url: 'viewer.html?scanId=' + doc.id  //Might need location root?
          })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        }else{
          //different solution for desktop
          window.open("viewer.html?scanId=" + doc.id);
        }
      });
      $("#obj-" + doc.id).on('click', function () {
        window.open(doc.data().objectURL);
      });
      $("#tex-" + doc.id).on('click', function () {
        window.open(doc.data().textureURL);
      });

    });

    $("#scanCards").append("<div>Thank you for your support!</div>");
    $("#frontPage").hide();
    $("#mainLoadingBar").hide();
    $("#scanCards").show();
    
  });
};


