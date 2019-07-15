let THREE = require('three');
let OrbitControls = require('three-orbit-controls')(THREE);
let domEditor = require('../domInteraction/domEditor.js');

let activeScene = false;

let scene = null;
let camera = null;
let controls = null;
let renderer = null;

let canvas = null;

let cpx = null;
let cpy = null;
let cpz = null;

let crx = null;
let cry = null;
let crz = null;

let cRotation = null;

let watchCamera = null;

let width = window.innerWidth;
let height = window.innerHeight;

let raycaster = null;
let mouse = null;

module.exports = {
    setVenue : function (venue) {
        if(venue != null) {
            domEditor.setVenue(venue);
            if(scene == null) {
                if(!renderer) {
                    initScene();
                    setScene(venue);
                }
                    watchCameraChange(venue);

            }
        } else {
            domEditor.unsetVenue();
            clearScene();
        }
    }
};

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, -1.2);
    //controls = new OrbitControls( camera );
    //controls.update();

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    window.addEventListener("resize", function () {
        windowChange();
    });
    activeScene = true;

    //https://threejs.org/docs/index.html#api/core/Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

function setScene(venue)
{
    addContainer();
    addText(venue);
    addRating(venue.rating);

    /*
    use https://stackoverflow.com/questions/13350875/three-js-width-of-view/13351534#13351534 instead
    let backgroundDimensions = new THREE.Box3().setFromObject(background).getSize();
    console.log(backgroundDimensions);

    let backgroundPos = {};
    backgroundPos.z = 0;
    backgroundPos.x = (backgroundDimensions.x / width);
    backgroundPos.y = (backgroundDimensions.y / height);
    console.log(backgroundPos);*/

    canvas.addEventListener("click", function (e) {
        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        // calculate objects intersecting the picking ray
        let obs = scene.children;
        let intersects = raycaster.intersectObjects( obs,true );

        for ( let i = 0; i < intersects.length; i++ ) {
            switch (intersects[i].object.name) {
                case "tile":
                    domEditor.reveal();
                break;
            }
        }
    });

    animateScene();
}

async function addContainer() {
    let backgroundS = new THREE.BoxGeometry(2,0.8,0.0001);
    let backgroundM = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    let background = new THREE.Mesh(backgroundS, backgroundM);
    background.name = "tile";
    scene.add(background);
}

async function addText(venue) {
    let loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        let textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000} );
        let titleGeo = new THREE.TextGeometry( venue.name, {
            font: font,
            size: 0.1,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0,
            bevelSize: 0,
            bevelSegments: 0
        } );
        let title = new THREE.Mesh(titleGeo,textMaterial);
        title.name = "Title";
        title.rotateY(degToRad(180));

        //directions reversed (+ = left)
        title.position.x = title.position.x + 0.85;
        title.position.y = title.position.y + 0.2;
        // needs geometry behind (text box) for interaction
        scene.add(title);

        let descGeo = new THREE.TextGeometry( venue.description, {
            font: font,
            size: 0.05,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0,
            bevelSize: 0,
            bevelSegments: 0
        } );
        let description = new THREE.Mesh(descGeo,textMaterial);
        description.name = "Description";
        description.rotateY(degToRad(180));

        description.position.x = description.position.x + 0.85;
        description.position.y = description.position.y + 0;

        scene.add(description);
    } );
}

async function addRating(rating) {
    let count = rating / 0.5;
    const startX = 0.79;
    let currentX = startX;
    const yPos = -0.2;

    let starShapeArr = [];
    let starGeoArr = [];
    let starMeshArr = [];
    let starMaterial = new THREE.MeshBasicMaterial( { color: 0xffd700 } );
    let extrusionSettings = {
        size: 0.1, height: 0.1, curveSegments: 3,
        bevelThickness: 0, bevelSize: 0, bevelEnabled: false,
        material: 0, extrudeMaterial: 1
    };
    let starGroup = new THREE.Group();

    for(let i = 0; i<count; i++){
        if(isEven(i)){
            let points = [];

            points.push( new THREE.Vector2 ( 0, 0 ));
            points.push( new THREE.Vector2 ( 0, 0.05 ));
            points.push( new THREE.Vector2 ( 0.01, 0.01 ));
            points.push( new THREE.Vector2 ( 0.04, 0.01 ));
            points.push( new THREE.Vector2 ( 0.02, -0.01 ));
            points.push( new THREE.Vector2 ( 0.03, -0.05 ));
            points.push( new THREE.Vector2 ( 0, -0.03 ));
            points.push( new THREE.Vector2 ( 0, 0));

            starShapeArr[i] = new THREE.Shape(points);

            starGeoArr[i] = new THREE.ExtrudeGeometry( starShapeArr[i], extrusionSettings );
            starMeshArr[i] = new THREE.Mesh( starGeoArr[i], starMaterial );
            starMeshArr[i].position.set(currentX,yPos,0);
            scene.add( starMeshArr[i] );
        }else{
            let points = [];

            points.push( new THREE.Vector2 ( 0, 0 ));
            points.push( new THREE.Vector2 ( 0, -0.03 ));
            points.push( new THREE.Vector2 ( -0.03, -0.05 ) );
            points.push( new THREE.Vector2 ( -0.02, -0.01 ) );
            points.push( new THREE.Vector2 ( -0.04,  0.01 ) );
            points.push( new THREE.Vector2 ( -0.01,  0.01 ) );
            points.push( new THREE.Vector2 ( 0, 0.05 ));
            points.push( new THREE.Vector2 ( 0, 0));

            starShapeArr[i] = new THREE.Shape(points);

            starGeoArr[i] = new THREE.ExtrudeGeometry( starShapeArr[i], extrusionSettings );
            starMeshArr[i] = new THREE.Mesh( starGeoArr[i], starMaterial );
            starMeshArr[i].position.set(currentX,yPos,0);
            scene.add( starMeshArr[i] );
            currentX -= 0.1;
        }
    }
}

/*async function addButtons() {
    let textureLoader = new THREE.TextureLoader();
    let x = 0.1;
    let y = 0.1;
    textureLoader.load(
        'textures/showMoreButton.png',
        function (texture) {
            texture.repeat.set(1,1);
            let showMoreGeo = new THREE.BoxGeometry(x,y,0.01);
            let showMoreMaterial = new THREE.MeshBasicMaterial( { map: texture } );
            let showMoreButton = new THREE.Mesh(showMoreGeo,showMoreMaterial);
            showMoreButton.name = "showMore";
            showMoreButton.position.set(-0.3,-0.2,0);
            scene.add(showMoreButton);

        },
        undefined,
        function (err) {
            console.log(err);
        }
    );
}*/

function animateScene() {
    requestAnimationFrame(animateScene);
    if(activeScene) {
        if(camera.getWorldDirection()){
            cRotation = camera.getWorldDirection();
        }
        cRotation.x = - crx;
        camera.lookAt(cRotation);
        // required if controls.enableDamping or controls.autoRotate are set to true
        //controls.update();
        renderer.render(scene, camera);
    }
}

function clearScene() {
    if(scene != null){
        cancelAnimationFrame(animateScene);
        activeScene = false;
        clearInterval(watchCamera);
        scene = null;
        camera = null;
        controls = null;
        renderer = null;
        document.body.removeChild(canvas);
        canvas = null;
    }
}

function watchCameraChange(venue) {
    if(venue != undefined) {
        watchCamera = setInterval(async function () {
            /*Rotation*/
            crx = degToRad(venue.difference);
        }, 1);
    }
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function windowChange() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function isEven(x) {
    return x % 2 == 0;
}