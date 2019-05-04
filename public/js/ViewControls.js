// By Eric Marquez
// This view controller uses the "Arc Ball" implementation to rotate a given model

// Setup variables
var ArcBallControlsCallbackArray = [];

// Define callbacks
document.addEventListener('mousemove', EL_OnMouseMove, false);
document.addEventListener('mousedown', EL_OnMouseDown, false);
document.addEventListener('mouseup', EL_OnMouseUp, false);

// Class used to control a model using the "Arc ball" method
class ArcBallControls {
    constructor() {
        this.usingArcBall = false;
        this.lastPositon = new THREE.Vector2();
    }

    Setup(model) {
        this.ControlledModel = model;

        AddMouseCallbackFunctions(this);
    }

    OnMouseMove(mousePos) {
        if(this.usingArcBall) {
            // console.log('Mouse: [' + mousePos.x + ', ' + mousePos.y + ']');
            var a = GetArcBallVector(this.lastPositon);
            var b = GetArcBallVector(mousePos);

            var dot = a.x * b.x + a.y * b.y;
            var angle = Math.acos(Math.min(1.0, dot));

            // Find axis relative to camera
            var axis = Cross(a, b);
        }
    }

    OnMouseDown(button, mouse) {
        if(button != 1 || this.usingArcBall)
            return;

        this.usingArcBall = true;
        this.lastPositon.x = mouse.x;
        this.lastPositon.y = mouse.y;

        console.log('Using Arc ball: ' + this.usingArcBall);
    }

    OnMouseUp(button) {
        if(button != 1 || !this.usingArcBall)
            return;

        this.usingArcBall = false;
        console.log('Using Arc ball: ' + this.usingArcBall);
    }

    // Gets a normalized vector from the center of a virtual ball at (0,0) to point P
    GetArcBallVector(mouse) {
        var r_2 = (mouse.x * mouse.x) + (mouse.y * mouse.y);
        var P = new THREE.Vector3();
        P.x = mouse.x;
        P.y = mouse.y;

        if(r_2 <= 1.0) {
            P.z = Math.sqrt(1 - r_2);
        } else {
            P.normalize();
        }

        return P;
    }
}

// Callback function for when the mouse moves (x, y) in screen space
function EL_OnMouseMove(event) {
    event.preventDefault();
    var mouse = getScreenSpaceMouseCoords(event);   

    for (var key in ArcBallControlsCallbackArray) {
        if(isFunction(ArcBallControlsCallbackArray[key].OnMouseMove))
            ArcBallControlsCallbackArray[key].OnMouseMove(mouse); // run your function
    }
}

// Callback function for when a mouse button is pressed
function EL_OnMouseDown(event) {
    var button = getTriggeredMouseButton(event);
    var mouse = getScreenSpaceMouseCoords(event);

    for (var key in ArcBallControlsCallbackArray) {
        if(isFunction(ArcBallControlsCallbackArray[key].OnMouseDown))
            ArcBallControlsCallbackArray[key].OnMouseDown(button, mouse); // run your function
    }
}

// Callback function for when a mouse button is released
function EL_OnMouseUp(event) {
    var button = getTriggeredMouseButton(event);

    for (var key in ArcBallControlsCallbackArray) {
        if(isFunction(ArcBallControlsCallbackArray[key].OnMouseUp))
            ArcBallControlsCallbackArray[key].OnMouseUp(button); // run your function
    }
}

// Adds to the array of callback functions
function AddMouseCallbackFunctions(controls)
{
    ArcBallControlsCallbackArray.push(controls);
}

// Checks to see if a property is a valid function
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function getScreenSpaceMouseCoords(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    return mouse;
}

function getTriggeredMouseButton(event) {
    if ('which' in event) {
        // 1: LMB
        // 2: MMB
        // 3: RMB

        return event.which;
    }

    return 1;
}

function Cross(a, b) {
    var c = new THREE.Vector3();
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;

    return c;
}