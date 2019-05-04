// Basic scene for WHS

const app = new WHS.App([
    new WHS.ElementModule(), // Apply to DOM.
    new WHS.SceneModule(), // Create a new THREE.Scene and set it to app.

    new WHS.DefineModule('camera', new WHS.PerspectiveCamera({ // Apply a camera.
        position: new THREE.Vector3(0, 0, 50)
    })),

    new WHS.RenderingModule({ bgColor: 0x162129 }), // Apply THREE.WebGLRenderer
    new WHS.ResizeModule() // Make it resizable.
]);

// My Code --------------------------------------------------------------------------------------------------------
const ObjURL = sessionStorage.getItem("object-file");
const imageURL = sessionStorage.getItem("material-image");

const model = new EModel({
    imageURL: imageURL,
    modelURL: ObjURL,
    roughness: 1,
    position: new THREE.Vector3(0, 5, 0)
});
model.addTo(app);


var controls = new ArcBallControls();
controls.Setup(model);

// My Code --------------------------------------------------------------------------------------------------------

// Lights
new WHS.PointLight({
    light: {
        intensity: 0.8,
        distance: 100
    },


    shadow: {
        fov: 90
    },


    position: new THREE.Vector3(0, 10, 10)
}).addTo(app);

new WHS.AmbientLight({
    light: {
        intensity: 3.5
    }
}).addTo(app);

// Start the app
app.start();
