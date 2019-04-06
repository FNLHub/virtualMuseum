// Basic scene for WHS

const app = new WHS.App([
    new WHS.ElementModule({
        container: document.getElementById('app')
    }),

    new WHS.SceneModule(),
    new WHS.CameraModule({
        position: {
            y: 10,
            z: 50
        }
    }),

    new WHS.RenderingModule({
        bgColor: 0x151515,

        renderer: {
            antialias: true,
            shadowmap: {
                type: THREE.PCFSoftShadowMap
            }
        }
    },
        { shadow: true }),
    new WHS.OrbitControlsModule(),
    new WHS.ResizeModule()]);

// My Code --------------------------------------------------------------------------------------------------------
const handObjURL = sessionStorage.getItem("object-file");
const imageURL = sessionStorage.getItem("material-image");

const model = new EModel({
    imageURL: imageURL,
    modelURL: handObjURL,
    roughness: 1,
    position: new THREE.Vector3(0, 5, 0)
});
model.addTo(app);

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