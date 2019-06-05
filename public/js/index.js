
//Globals here
var app;
var curScanID;
var curCategory;

$(document).ready(function () {

  initViewerCanvas();

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
      getCategories();

    } else {
      // User is signed out.
    }
    
  });


  $("#showAllScansBtn").on('click',function(){
    $(".mdl-layout__tab:eq(1) span").click(); //click second tab
    $("#mainLoadingBar").show();
    displayScans("all");
  });

  //Nav Buttons
  $("#homeNav").on('click',function(e){
    e.preventDefault();
    $(".mdl-layout__tab:eq(0) span").click(); //click tab 1
    document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
  });

});


//Scan page stuff here *****************
var cats = {};
function getCategories(){
  let query = firebase.firestore().collection('NewUploads').where("published", "==", true).orderBy('category', 'asc');
  query.get().then(function(collection){

    collection.forEach(function(doc){
      //Make a list of categories and the number of scans for each
      cats[doc.data().category] ? cats[doc.data().category]++ : cats[doc.data().category]=1;
   
    });

    $("#catsUI").html("<em>Scan Categories</em><br>");

    for([key,value] of Object.entries(cats) ){
      //TODO: append buttons to app
      var catBtnHtml =
      '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" onclick="displayScans(\''+key+'\')">'+
        '<i class="material-icons">forward</i> '+ key + ' scans: '+value+
      '</button><br>';

      $("#catsUI").append(catBtnHtml);
    }

  });

}

function displayScans(argCategory) {

  var query;
  if(argCategory=="all")
    query = firebase.firestore().collection('NewUploads').where("published", "==", true).orderBy('title', 'asc');
  else
    query = firebase.firestore().collection('NewUploads').where("category", "==", argCategory).where("published", "==", true).orderBy('title', 'asc');
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
        //window.open("viewer.html?scanId=" + doc.id);
        //Eric need to clear old model?? Hacky!!!
        $("#scanLoadingBar").show();
        viewNewModel(doc.data().objectURL, doc.data().textureURL);
        $(".mdl-layout__tab:eq(2) span").click(); //click third tab
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

    //$("#scanCards").append("<br><div>Thank you for your support!</div>");
    $("#mainLoadingBar").hide();
    $("#scanCards").show();
    $(".mdl-layout__tab:eq(1) span").click(); //click second tab
    
  });
};



//Viewer Stuff here ******************
function initViewerCanvas(){
  app = new ThreejsApp('#viewCanvas');

  var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.75);
  keyLight.position.set(-100, 0, 100);

  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.1);
  fillLight.position.set(100, 0, 100);

  var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(100, 0, -100).normalize();

  var light = new THREE.AmbientLight(0xffffff, 1.0);
  light.position.set(30, 30, 30);

  app.add(keyLight);
  app.add(fillLight);
  app.add(backLight);
  app.add(light);

  var animate = function () {
      requestAnimationFrame(animate);
      app.update();
  };

  animate();
}

function viewNewModel(modelURL, textureURL) {
  model = new Model({
      modelURL: modelURL,
      textureURL: textureURL,
      callback: OnModelLoaded,
  });
  //NOTE: Eric should we delete the old model?  Or is it overwritten??
  app.add(model);
}
function OnModelLoaded(center) {
  app.setFocus(center);
  $("#scanLoadingBar").hide();
}


//Utility Function for URL parameters---------------------------------------------------------------
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

