
//Globals here
var defaultScanID = "YNKHn4fL5UJ2fi2yOXzc";
var curScanID = "";

var snipFile, textureFile, objectFile;
var snipFileURL, textureFileURL, objectFileURL;

$(document).ready(function () {

  curScanID = getParameterByName('scanId');

  if (!curScanID) {
    newScanUpload();
  } else {
    $("#scanInfoLoading").show();
    setDocListener();
  }

  $("#saveScanInfoBtn").on('click', saveScanInfo);
  $("#snipBtn").on('click', uploadSnip);
  $("#textureBtn").on('click', uploadTexture);
  $("#objectBtn").on('click', uploadObject);

  $("#previewBtn").on('click',function(){
    window.open("viewer.html?scanId=" + curScanID);
  })
  $("#prevBtn").on('click',function(){
    window.open("viewer.html?scanId=" + curScanID);
  })
  $("#shareBtn").on('click',function(){
    //only for mobile
    if (navigator.share) {
      navigator.share({
          title: 'FNL 3d Scan',
          text: 'Check out this awesome 3d scan — let it load in!',
          url: 'viewer.html?scanId=' + curScanID
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }else{
      //different solution for desktop
      window.open("viewer.html?scanId=" + curScanID);
    }
  })

  
  $("#objDownloadBtn").on('click',function(){
    window.open(objectFileURL);
  })
  $("#texDownloadBtn").on('click',function(){
    window.open(textureFileURL, "_blank");
  })


  //file system listeners
  $("#snipFileInput").on('change', function (evt) {
    var files = evt.delegateTarget.files;
    snipFile = files[0];
    $("#snipBtn").show();
  });
  $("#textureFileInput").on('change', function (evt) {
    var files = evt.delegateTarget.files;
    textureFile = files[0];
    $("#textureBtn").show();
  });
  $("#objectFileInput").on('change', function (evt) {
    var files = evt.delegateTarget.files;
    objectFile = files[0];
    $("#objectBtn").show();
  });

  //buttons

  $("#newBtn").on('click',function(){
    //TODO: make this less blunt
    //location.reload();
    window.open("detail.html");
  })

});


function saveScanInfo() {
  $("#saveScanInfoBtn").hide();
  $("#scanInfoLoading").show();

  let userTitle = $("#titleInput").val();
  let userCat = $("#categoryInput").val();
  let userDesc = $("#descriptionInput").val();

  //send to database
  if (!curScanID) {
    // Add a new document with a generated id.
    firebase.firestore().collection("NewUploads").add({
      title: userTitle,
      category: userCat,
      description: userDesc,
      published: $('#scanPublished').prop('checked'),
    }).then(function (docRef) {
      curScanID = docRef.id;
      setDocListener();
    });

  } else {
    // Add a new document with a generated id fires real time database
    firebase.firestore().collection("NewUploads").doc(curScanID).update({
      title: userTitle,
      category: userCat,
      description: userDesc,
      published: $('#scanPublished').prop('checked'),
    });

  }

}



function uploadSnip(e) {
  e.preventDefault();
  $("#snipLoading").show();
  $("#snipBtn").hide();
  if(snipFileURL){
    var tempRef = firebase.storage().refFromURL(snipFileURL);
    tempRef.delete();
  }

  //Now save the files to storage with this docRef.id in URL
  firebase.storage().ref().child('NewUploads/' + curScanID + "/" + snipFile.name).put(snipFile).then(function (fileSnapshot) {
    // Now get the download URL for this object
    fileSnapshot.ref.getDownloadURL().then(function (url) {
      //now save url to the firebase database (firestore)
      firebase.firestore().collection("NewUploads").doc(curScanID).update({
        snipURL: url
      }).then(function(){
        //turn off the loading bar
        $("#snipLoading").hide();
        $("#detailSnipURL").html(url);
      });

    });
  });
}

function uploadTexture(e) {
  e.preventDefault();
  $("#textureLoading").show();
  $("#textureBtn").hide();
  if(textureFileURL){
    var tempRef = firebase.storage().refFromURL(textureFileURL);
    tempRef.delete();
  }

  //Now save the files to storage with this docRef.id in URL
  firebase.storage().ref().child('NewUploads/' + curScanID + "/" + textureFile.name).put(textureFile).then(function (fileSnapshot) {
    // Now get the download URL for this object
    fileSnapshot.ref.getDownloadURL().then(function (url) {
      //now save url to the firebase database (firestore)
      firebase.firestore().collection("NewUploads").doc(curScanID).update({
        textureURL: url
      }).then(function(){
        $("#textureLoading").hide();
        $("#detailTextureURL").html(url);
      });

    });
  });
}

function uploadObject(e) {
  e.preventDefault();
  $("#objectLoading").show();
  $("#objectBtn").hide();
  if(objectFileURL){
    var tempRef = firebase.storage().refFromURL(objectFileURL);
    tempRef.delete();
  }

  //Now save the files to storage with this docRef.id in URL
  firebase.storage().ref().child('NewUploads/' + curScanID + "/" + objectFile.name).put(objectFile).then(function (fileSnapshot) {
    // Now get the download URL for this object
    fileSnapshot.ref.getDownloadURL().then(function (url) {
      //now save url to the firebase database (firestore)
      firebase.firestore().collection("NewUploads").doc(curScanID).update({
        objectURL: url,
        objectBytes: fileSnapshot.totalBytes
      }).then(function(){
        $("#objectLoading").hide();
        $("#detailObjectURL").html(url);
      });

    });
  });
}

function newScanUpload() {
  //unsubscribeDocListener();
  curScanID = "";
  snipFileURL="";
  textureFileURL="";
  objectFileURL="";
  $("#titleInput").val("");
  $("#categoryInput").val("");
  $("#descriptionInput").val("");

  $("#scanInfoLoading").hide();
  $("#scanFiles").hide();
  $("#saveScanInfoBtn").html("New Scan Info");

}

var unsubscribeDocListener;
function setDocListener() {
  //assumes global id is set
  unsubscribeDocListener = firebase.firestore().collection("NewUploads").doc(curScanID)
    .onSnapshot(function (docRef) {
      
      
      //preview card work
      docRef.data().title ? $(".mdl-card__title-text").html(docRef.data().title): $(".mdl-card__title-text").html("Title");
      var bacURL = docRef.data().snipURL?docRef.data().snipURL:'img/default.PNG';
      $(".mdl-card__title").css('background','url('+bacURL+') center / cover');
      docRef.data().description ? $("#cardDescription").html(docRef.data().description):$("#cardDescription").html("Scan Description");
      docRef.data().category ? $("#cardCategory").html(docRef.data().category):$("#cardCategory").html("Scan Category");
      docRef.data().objectBytes ? $("#cardObjectSize").html( Math.round(docRef.data().objectBytes / 100000.0)/10 + ' mb'): $("#cardObjectSize").html('Scan Size');

      //Input card wark
      snipFileURL = docRef.data().snipURL;
      $("#detailSnipURL").html(docRef.data().snipURL);
      textureFileURL = docRef.data().textureURL;
      $("#detailTextureURL").html(docRef.data().textureURL);
      objectFileURL = docRef.data().objectURL;
      $("#detailObjectURL").html(docRef.data().objectURL);

      document.querySelector('.t1').MaterialTextfield.change(docRef.data().title);
      document.querySelector('.t2').MaterialTextfield.change(docRef.data().category);
      document.querySelector('.t3').MaterialTextfield.change(docRef.data().description);

      $("#pubCheckBox").html("Publish: " + curScanID);
      docRef.data().published ? document.querySelector('#scanPublished').parentElement.MaterialCheckbox.check() : document.querySelector('#scanPublished').parentElement.MaterialCheckbox.uncheck();



      $("#scanInfoLoading").hide();
      $("#scanFiles").show();

      $("#saveScanInfoBtn").html("Update Scan Info");
      $("#saveScanInfoBtn").show();
    });
}



//Util Function
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}