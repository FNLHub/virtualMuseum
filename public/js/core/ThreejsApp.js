

class Module {
    constructor(params = {}) {
        this.content = this.build(params);
    }

    build(params) { return null; }

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
            this.renderer.setSize(window.innerWidth, window.innerHeight);

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

        this.elements = [];
    }

    add(element) {
        if (this.scene == null) {
            return;
        }

        if (element instanceof Module && element.content != null) {
            this.elements.push(element.content);
            this.scene.add(element.content);

        } else {
            this.elements.push(element);
            this.scene.add(element);
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