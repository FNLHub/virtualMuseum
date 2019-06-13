// Author: Eric Marquez
// Description: Model class that can be easily used to lood an OBJ(wavefront)
// as well as its texture image from web URLs.

// This class MUST be used with a ThreejsApp wrapper class

class Model extends Module {

    constructor(params = {}) {
        super(params);
        this.bshowingMaterial = true;
    }

    // Starts the build process given the required params, called automatically by the Module base class
    build(params) {
        this.mesh = new THREE.Mesh();

        // Creates a diffuse based texture
        this.material = new THREE.MeshPhysicalMaterial({
            color: (params.color) ? params.color : 0xFFFFFF,
            roughness: (params.roughness) ? params.roughness : 0.8,
        });

        // Creates a white material
        this.clearMaterial = new THREE.MeshPhysicalMaterial({
            color: (params.color) ? params.color : 0xFFFFFF,
            roughness: (params.roughness) ? params.roughness : 0.8,
        });

        // Load basic cube if any the urls were invalid
        if(!this.loadNewModel(params.modelURL, params.textureURL, params.callback))
        {
            this.mesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 10, 10),
                this.material
            );
        }

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
        this.clearMaterial.wireframe = !this.clearMaterial.wireframe;
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

    loadNewModel(modelURL, textureURL, callback) {

        if(modelURL == '' || textureURL == '')
            return false;

        // Load the image if it exists
        LoadImagesFromLink(textureURL, textures => {
            this.material.map = textures.diffuse;
            this.material.needsUpdate = true;
        });

        // Load the mesh from the URL
        var meshLoader = new THREE.OBJLoader();
        meshLoader.load(modelURL, model => {
            // If this model has already been added to a world,
            // remove it, modify it, and add it back.
            if (this.world) {
                this.world.remove(this.mesh);
                this.mesh = model;
                this.world.add(this.mesh);
            } else {
                this.mesh = model;
            }

            if (!this.bshowingMaterial) {
                this.setMaterial(this.clearMaterial);
            } else {
                this.setMaterial(this.material);
            }

            if (this.isFunction(callback))
                callback(this.getCenter());
        });

        return true;
    }
}

//loads textures using an image URL
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