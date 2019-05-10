// Author: Eric Marquez
// Description: Model class that can be easily used to lood an OBJ(wavefront)
// as well as its texture image from web URLs. This implements WHS (Whitestorm JS)

// Sphere was the only thing I could inherit to stop WHS from crashing :/ It works so dont question it.
class Model extends Module {

    // Constructor required by WHS
    constructor(params = {}) {
        super(params);
        this.bshowingMaterial = false;
    }

    // Build required by WHS. Since Js uses garbage collection, it's variables are all refrences.
    // This allows callback functions to modify old variables and still have the changes take place
    build(params) {
        var loader = new THREE.OBJLoader();
        this.mesh = new THREE.Mesh();
        this.material = new THREE.MeshPhysicalMaterial({
            color: (params.color) ? params.color : 0xFFFFFF,
            roughness: (params.roughness) ? params.roughness : 0.8,
        });

        this.clearMaterial = new THREE.MeshPhysicalMaterial({
            color: (params.color) ? params.color : 0xFFFFFF,
            roughness: (params.roughness) ? params.roughness : 0.8,
        });

        // Load basic cube if no model url is given
        if (params.modelURL == '') {
            return new THREE.Mesh(
                new THREE.BoxGeometry(10, 10, 10),
                this.material
            );
        }

        // Load the image if it exists
        if (params.textureURL != '') {
            LoadImagesFromLink(params.textureURL, textures => {
                this.material.map = textures.diffuse;
                this.material.needsUpdate = true;
                this.bshowingMaterial = true;
            });
        }

        // Load the mesh from the URL
        loader.load(params.modelURL, model => {

            // If this model has already been added to a world,
            // remove it, modify it, and add it back.
            if(this.world) {
                this.world.remove(this.mesh);
                this.mesh = model;
                this.world.add(this.mesh);
            } else {
                this.mesh = model;
            }

            this.setMaterial(this.material);

            if (this.isFunction(params.callback))
                params.callback(this.getCenter());

        });

        return this.mesh;
    }

    getCenter() {
        var boundingBox = new THREE.Box3();
        boundingBox.setFromObject(this.mesh);

        return boundingBox.getCenter();
    }

    toggleMaterial() {
        this.bshowingMaterial = !this.bshowingMaterial;

        if (!this.bshowingMaterial) {
            this.setMaterial(this.clearMaterial);
        } else {
            this.setMaterial(this.material);
        }
    }

    toggleWireframe() {
        this.material.wireframe = !this.material.wireframe;
        this.clearMaterial.wireframe =  !this.clearMaterial.wireframe;
    }

    setMaterial(material) {
        // Go through every mesh in this object and set its material
        this.mesh.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.needsUpdate = true;
            }
        });
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