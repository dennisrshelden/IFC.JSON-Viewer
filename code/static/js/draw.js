
// 3D Main: main THREE.js view creation and management functions. Some might be edited by users - with care

// set up: create and position camera3d, create renderer, control view size, place in div, etc.
// setup
function setup3D() {
    div3D = document.getElementById("div3D");
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.shadowMap.enabled = true; /////////////
    renderer.shadowMap.type = THREE.PCFShadowMap;
    div3D.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0xcccccc);

    //camera3d = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
    //camera3d = new THREE.OrthographicCamera(-80, 80, 60, -60, -5, 10000);
    camera3d = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 5000);
    camera3d.up = new THREE.Vector3(0, 0, 1);
    camera3d.position.set(-560, 785, 700);

    var controls = new THREE.OrbitControls(camera3d, renderer.domElement);
    var focusPt = new THREE.Vector3(50, -50, 20.0);
    camera3d.lookAt(focusPt);
    controls.target = focusPt;
    controls.target0 = focusPt;
    controls.enableZoom = true;

    var ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(50%, 50%, 50%)'))
    scene.add(ambientLight);

    var shadowRes = 2048 * 4;
    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 0%, 75%)'), 1.50);
    keyLight.position.set(-50, -50, 30);
    keyLight.shadow.camera.left = -500;
    keyLight.shadow.camera.bottom = -500;
    keyLight.shadow.camera.top = 500;
    keyLight.shadow.camera.right = 500;
    keyLight.shadow.mapSize.width = shadowRes;
    keyLight.shadow.mapSize.height = shadowRes;
    keyLight.castShadow = true;
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 0%, 75%)'), 0.3);
    fillLight.position.set(50, -150, 130);
    fillLight.shadow.camera.left = -500;
    fillLight.shadow.camera.bottom = -500;
    fillLight.shadow.camera.top = 500;
    fillLight.shadow.camera.right = 500;
    fillLight.shadow.mapSize.width = shadowRes;
    fillLight.shadow.mapSize.height = shadowRes;
    fillLight.castShadow = true;
    scene.add(fillLight);

    // axes
    var axes = new THREE.AxesHelper(50);
    scene.add(axes);

    isSetup3d = true;
}


function draw3D() {
    if (!isSetup3d) return;
    cleanMeshes();

    if (_BEList.length > 0) {
        for (var i = 0; i < _BEList.length; i++) {
            var retlist = _BEList[i].draw3D();
            if (retlist != undefined) {
                for (var j = 0; j < retlist.length; j++) {
                    meshArr.push(retlist[j]);
                }
            }

        }
    }

    for (var i = 0; i < meshArr.length; i++) {
        scene.add(meshArr[i]);
    }
    onWindowResize();
    render();
}


function cleanMeshes() {
    for (var i = 0; i < meshArr.length; i++) {
        if (meshArr[i].geometry) meshArr[i].geometry.dispose();
        if (meshArr[i].material) meshArr[i].material.dispose();
        scene.remove(meshArr[i]);
        delete (meshArr[i]);
    }
    meshArr = [];
}

// window resize
function onWindowResize() {
    camera3d.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera3d.updateProjectionMatrix();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
}

// renderer
function render() {
    renderer.render(scene, camera3d);
}



