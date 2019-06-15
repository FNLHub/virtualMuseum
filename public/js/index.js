//Globals here
var app;
var model;
var curScanID;
var curCategory;

$(document).ready(function () {

  initViewerCanvas();

  //first step to sign in for database security.
  firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    console.log(error.code);
    console.log(error.message)
  });
  // auth change listener
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in and can read the database
      //var isAnonymous = user.isAnonymous;
      //var uid = user.uid;
      console.log("user: " + user.isAnonymous);

      //get the 3d model
      getCategories();

    } else {
      // User is signed out.
    }

  });


  $("#showAllScansBtn").on('click', function () {
    $(".mdl-layout__tab:eq(1) span").click(); //click second tab
    $("#mainLoadingBar").show();
    displayScans("all");
  });

  //Nav Buttons
  $("#homeNav").on('click', function (e) {
    e.preventDefault();
    $(".mdl-layout__tab:eq(0) span").click(); //click tab 1
    document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
  });

  $("#viewerSettings>button").click(function () {
    $("#settingsPanel").slideToggle("fast");
  });
  $("#hideTexture").on('input', function () {
    model.toggleMaterial();
    $("#brightSlider").get(0).MaterialSlider.change(0);
    light.intensity = 1;
  });
  $("#wireframe").on('input', function () {
    model.toggleWireframe();
    $("#brightSlider").get(0).MaterialSlider.change(0);
    light.intensity = 1;
  });
  $("#brightSlider").on('input', function () {
    light.intensity = 1+this.value/25;
  });

});


//Scan page stuff here *****************
var cats = {};
function getCategories() {
  let query = firebase.firestore().collection('NewUploads').where("published", "==", true).orderBy('category', 'asc');
  query.get().then(function (collection) {

    collection.forEach(function (doc) {
      //Make a list of categories and the number of scans for each
      cats[doc.data().category] ? cats[doc.data().category]++ : cats[doc.data().category] = 1;

    });

    $("#catsUI").html("<em>Scan Categories</em><br>");

    for ([key, value] of Object.entries(cats)) {
      //TODO: append buttons to app
      var catBtnHtml =
        '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" onclick="displayScans(\'' + key + '\')">' +
        '<i class="material-icons">forward</i> ' + key + ' scans: ' + value +
        '</button><br>';

      $("#catsUI").append(catBtnHtml);
    }

  });

}

function displayScans(argCategory) {

  var query;
  if (argCategory == "all")
    query = firebase.firestore().collection('NewUploads').where("published", "==", true).orderBy('title', 'asc');
  else
    query = firebase.firestore().collection('NewUploads').where("category", "==", argCategory).where("published", "==", true).orderBy('title', 'asc');
  //Real time listener set here
  query.onSnapshot(function (collection) {

    $("#splash").fadeOut();
    $("#scanCards").empty(); //clear out div in index.html

    collection.forEach(function (doc) {

      var newScanCard =
        '<div id="card-' + doc.id + '"  class="detail-card mdl-card mdl-shadow--2dp mdl-card--border">' +
        '<div class="mdl-card__title">' +
        '<h2 class="mdl-card__title-text">' + doc.data().title + '</h2>' +
        '</div>' +
        '<div class="mdl-card__supporting-text">' +
        '<div id="cardDescription">' + doc.data().description + '</div>' +
        '<div>Category: <span id="cardCategory">' + doc.data().category + '</span></div>' +
        '<div>Size: <span id="cardObjectSize">' + Math.round(doc.data().objectBytes / 100000.0) / 10 + ' mb</span></div>' +
        '</div>' +
        '<div class="mdl-card__actions mdl-card--border">' +
        '<button id="obj-' + doc.id + '" class="mdl-button mdl-js-button mdl-js-ripple-effect">' +
        '<i class="material-icons">cloud_download</i> Object' +
        '</button>' +
        '<button id="tex-' + doc.id + '" class="mdl-button mdl-js-button mdl-js-ripple-effect">' +
        '<i class="material-icons">cloud_download</i> Texture' +
        '</button>' +
        '</div>' +
        '<div class="mdl-card__menu">' +
        '<button id="share-' + doc.id + '" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
        '<i class="material-icons">share</i>' +
        '</button>' +
        '<button id="go-' + doc.id + '" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
        '<i class="material-icons">remove_red_eye</i>' +
        '</button>' +
        '</div>' +
        '</div>';

      $("#scanCards").append(newScanCard);

      $("#card-" + doc.id + " .mdl-card__title").css("background", "url('" + doc.data().snipURL + "') center/cover");

      //Set button listeners here
      $("#go-" + doc.id).on('click', function () {
        $("#scanTitle").html(doc.data().title);
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
        } else {
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
window.addEventListener('resize', onWindowResize, false);

var light;
function initViewerCanvas() {
  app = new ThreejsApp('#viewCanvas');

  // This loads a default cube
  model = new Model({
    modelURL: 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/Uploads%2F3dObjects%2F5ad8KrKG0GlRpdtaJQI4%2FCookie.obj?alt=media&token=9c894765-e49e-401b-bae7-575cde91a368',
    textureURL: 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/Uploads%2F3dTextures%2F5ad8KrKG0GlRpdtaJQI4%2FCookie.jpg?alt=media&token=689c8ccf-c85a-4cea-815d-dfef095ab060',
    callback: OnModelLoaded
  });

  var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.75);
  keyLight.position.set(-100, 0, 100);

  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.1);
  fillLight.position.set(100, 0, 100);

  var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(100, 0, -100).normalize();

  light = new THREE.AmbientLight(0xffffff, 1.5);
  light.position.set(30, 30, 30);

  app.add(keyLight);
  app.add(fillLight);
  app.add(backLight);
  app.add(light);
  app.add(model);


  var animate = function () {
    requestAnimationFrame(animate);
    app.update();
  };

  animate();

}
function changeAmbientLightIntensity(value){
  console.log(value);
  light.intensity = value;
}

// Loads a new model to the viewer, keeping it's previous lighing settings
function viewNewModel(modelURL, textureURL) {

  app.removeAll();

  // returns true if the urls were valid
  if (model.loadNewModel(modelURL, textureURL, OnModelLoaded)) {
    // Do something here 
  }
}

function OnModelLoaded(center) {
  console.log('model loaded?');
  
  app.setFocus(center);
  $("#scanLoadingBar").hide();
}

function onWindowResize() {
  app.onWindowResize();
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

