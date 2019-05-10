
window.addEventListener( 'resize', onWindowResize, false );

// LUCY URLS are the Default
var lucyObjURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2FyG5ioP3k8TbFhv1y2iyD%2FHigh_Res.obj?alt=media&token=14b9b670-d665-43cd-8608-d3021c77f182';
var lucyTextureURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2FyG5ioP3k8TbFhv1y2iyD%2Fmaterial.jpg?alt=media&token=1eb7963e-e877-4e76-9701-1ad1a3d2be04';

//If scanID coming in from URL use that
var scanID = getParameterByName('scanId');
var model = null;

// Three JS stuff--------------------------------------------------------------------------------
var app = new ThreejsApp('#viewCanvas');

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

function onWindowResize() {
    app.onWindowResize();
}

// State change functions--------------------------------------------------------------------------
$(document).ready(function () {

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
            if (scanID) { //get the URLs from the database entry
                firebase.firestore().collection("scanUploads").doc(scanID).get().then(function (doc) {
                    if (doc.exists) {
                        OnAuthentication(doc.data().objectURL, doc.data().textureURL);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });

            } else { //loads default if scanID is not in URL
                OnAuthentication(lucyObjURL, lucyTextureURL);
            }

        } else {
            // User is signed out.
        }
    });
});

function OnAuthentication(modelURL, textureURL) {
    model = new Model({
        modelURL: modelURL,
        textureURL: textureURL,
        callback: OnModelLoaded,
    });

    app.add(model);
}

function OnModelLoaded(center) {
    app.setFocus(center);
    $("#progress").hide();
}

function ChangeBrightness(value) {
    keyLight.intensity = value/100;
}

$("#brightSlider").on('input', function () {
    ChangeBrightness(this.value);
});

$("#hideTexture").on('input', function () {
    model.toggleMaterial();
});

$("#wireframe").on('input', function () {
    model.toggleWireframe();
});

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