

//objs
var handObjURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2Fhand%2Fhandcomplete.obj?alt=media&token=5cf5ba2e-6bba-4eca-86f9-6646f9a090bd';
var jawObjURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2Fjaw%2Fjawsmaller.obj?alt=media&token=9d46470e-d589-44c1-9023-d80cb3662a76';

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

//mtlLoader.setTexturePath('/assets/');
var arg = 'fnlvirtualmuseum.appspot.com/o/3dObjects%2Fhand%2Fhandcomplete.mtl?alt=media&token=f85bb660-2e8a-4552-a124-2889a3f138e1';
var argjaw = 'fnlvirtualmuseum.appspot.com/o/3dObjects%2Fjaw%2Fjawsmaller.mtl?alt=media&token=a2693954-0dd4-4877-8123-ab8f1d98b6d9'
//https://firebasestorage.googleapis.com/v0/b/
//

mtlLoader.setPath('https://firebasestorage.googleapis.com/v0/b/');
//mtlLoader.setResourcePath('');
mtlLoader.setCrossOrigin('https://firebasestorage.googleapis.com');

mtlLoader.load(argjaw, function (materials) {
    
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    //objLoader.setPath('');
    objLoader.load(jawObjURL, function (object) {

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