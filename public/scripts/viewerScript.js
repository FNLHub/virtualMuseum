

//objs
var handObjURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2Fhand%2Fhandcomplete.obj?alt=media&token=5cf5ba2e-6bba-4eca-86f9-6646f9a090bd';
var handMtlURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2Fhand%2Fhandcomplete.mtl?alt=media&token=a6a1454a-7415-4124-97e1-c9f3141c1fc2';
var handJpgURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2Fhand%2Fhand3.jpg?alt=media&token=f72056d9-d83c-460d-84fb-ab4c8f294746';



var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
//var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
camera.position.z = 30;
camera.position.x = 30;
camera.position.y = 30;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
//var scriptElement = document.querySelector(".progress");
//document.body.insertBefore(renderer.domElement, scriptElement);
document.body.appendChild( renderer.domElement );
//scriptElement.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.75);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.1);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.position.set(100, 0, -100).normalize();

var light = new THREE.AmbientLight(0xffffff, 1.0);
light.position.set(30,30,30);

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
scene.add(light);

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('assets/');
mtlLoader.setPath('assets/');
mtlLoader.load('handcomplete.mtl', function (materials) {
    
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load('handcomplete.obj', function (object) {

       $("#progress").hide();

        scene.add(object);
        //object.position.y;
        var boundingBox = new THREE.Box3();

        boundingBox.setFromObject( object );
        var center = boundingBox.getCenter();

        // set camera to rotate around center of object
        controls.target = center;

    });

});

var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};

animate();