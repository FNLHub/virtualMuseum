
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
      
      //get the 3d model
      var objURL = "https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/NewUploads%2FURE4AzRxu5MSRzMrLndu%2Flucy.obj?alt=media&token=fd4fa76d-21ad-44f2-9982-af619d5d221f";
      var texURL = "https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/NewUploads%2FURE4AzRxu5MSRzMrLndu%2Flucy.jpg?alt=media&token=542882c2-1cc2-49c3-a9d7-4d407d63ef55";
      OnAuthentication(objURL, texURL);

    } else {
      // User is signed out.
    }
    
  });


  $("#showAllScansBtn").on('click',function(){
    $(".mdl-layout__tab:eq(1) span").click(); //click second tab
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
    $("#mainLoadingBar").hide();
    $("#scanCards").show();
    
  });
};


