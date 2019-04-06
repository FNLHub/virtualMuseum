// Author: Eric Marquez
// Description: Model class that can be easily used to lood an OBJ(wavefront)
// as well as its texture image from web URLs. This implements WHS (Whitestorm JS)

// Eric Model :P
// Sphere was the only thing I could inherit to stop WHS from crashing :/ It works so dont question it.
class EModel extends WHS.Sphere {

    // Required by WHS
    static defaults = {
        imageURL: '',
        modelURL: '',
        roughness: 1,
    };

    // Constructor required by WHS
    constructor(params = {}) {
        super(params, BasicSphere.defaults);
    }

    // Build required by WHS. Since Js uses garbage collection, it's variables are all refrences.
    // This allows callback functions to modify old variables and still have the changes take place
    build(params) {
        var loader = new THREE.OBJLoader();
        var mesh = new THREE.Mesh();
        var material = new THREE.MeshStandardMaterial({
            color: (params.color) ? params.color : 0xFFFFFF,
            roughness: params.roughness
        });

        // Load basic cube if no model url is given
        if(params.modelURL == '') {
            return new THREE.Mesh(
                new THREE.BoxGeometry( 10, 10, 10 ),
                material
            );
        }

        // Load the image if it exists
        if (params.imageURL != '') {
            LoadImagesFromLink(imageURL, images => {
                material.map = images.diffuse;
                material.needsUpdate = true;
            });
        }

        // Load the mesh from the URL
        loader.load(params.modelURL, model => {
            mesh.copy(model);

            // Go through every mesh in this object and set its material
            mesh.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                    child.needsUpdate = true;
                }
            });
        });

        return mesh;
    }
}

// Regardless of using WHS.js, this is how I got the material to load correctly from the URL
// Basically, the process was to re-create the image locally after downloading the image "Blob" from the URL
function LoadImagesFromLink(imageURL, callback) {
    fetch(imageURL).then(res => res.blob()).then(imageBlob => {
        var texture = new THREE.Texture();
        var url = URL.createObjectURL(imageBlob);

        var image = new Image();
        image.src = url;
        image.onload = function () {
            texture.image = image;
            texture.needsUpdate = true;
        };

        var images = {
            diffuse: texture,
        }

        callback(images);
    });
}