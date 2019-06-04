

class Module {
    constructor(params = {}) {
        this.content = this.build(params);
    }

    build(params) { return null; }

    setWorld(world) {
        this.world = world;
    }

    // Checks to see if a property is a valid function
    isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
}

class ThreejsApp {
    constructor(embedElement = null, renderer = null, camera = null) {
        this.scene = new THREE.Scene();

        if (camera == null) {
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            this.camera.position.z = 30;
            this.camera.position.x = 30;
            this.camera.position.y = 30;
        } else {
            this.camera = camera;
        }

        if (renderer == null) {
            this.renderer = new THREE.WebGLRenderer();
            //NOTE: Eric Seems like we could get the size of embedElement instead of window here?
            this.renderer.setSize(window.innerWidth ,  window.innerHeight-100);

            if (embedElement != null)
                document.querySelector(embedElement).appendChild(this.renderer.domElement);
        } else {
            this.renderer = renderer;
        }

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.50;
    }

    add(element) {
        if (this.scene == null) {
            return;
        }

        if (element instanceof Module && element.content != null) {
            element.setWorld(this);
            this.scene.add(element.content);

        } else {
            this.scene.add(element);
        }
    }

    remove(element) {
        if (this.scene == null) {
            return;
        }

        if (element instanceof Module && element.content != null) {
            element.setWorld(this);
            this.scene.remove(element.content);
        }
    }

    setFocus(point) {
        this.controls.target = point;
    }

    update() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        console.log('WindowResize');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}