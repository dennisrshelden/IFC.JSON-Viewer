
function setup() {
    _parameterList = ["GlobalId","Name", "Class", "Volume", "Color", "Opacity"]; // parameters to be displayed in edit table

    readClasses();
    setup3D();
    readModel();
    _objTable = new UITable(_BEList, _parameterList, document.getElementById("objTable"));
    // refreshObjectTable();
}

function readClasses() {
    $.getJSON("data/classes.json", function (data) {
        _classData = data;
        _BEClasses = jsonPath(_classData, "$.[Class]");
        console.log(_BEClasses);
    })

};

function readModel() {
    $.getJSON("data/data.json", function (data) {
        JSONARR_ORIG = data;
        console.log(JSONARR_ORIG);
        updateModel();
    })
};

function updateModel() {

    OBJARR = jsonPath(JSONARR_ORIG, "$..[?(@.RepresentationType=='OBJ')]");
    _OBJList = [];
    var i;
    var loader = new THREE.OBJLoader();
    for (i = 0; i < OBJARR.length; i++) {
        var myObj = OBJARR[i];
        var curMesh = loader.parse(myObj.Items[0]);
        var curObj = {GlobalID: myObj.GlobalId, Mesh:curMesh  };
        if (curObj) {
            _OBJList.push(curObj)
        }

    }


    JSONARR = jsonPath(JSONARR_ORIG, _selString);
    _BEList = [];
    _uniqueParams = new Set();
    _uniqueClasses = new Set();


    for ( i = 0; i < JSONARR.length; i++) {
        var itemObj = JSONARR[i];
        _uniqueClasses.add(itemObj.Class);
        if (_BEClasses.includes(itemObj.Class)) {
            try {
                var newBE = new BuildingElement(itemObj.Class, itemObj);
                // newBE.setData(itemObj);
                var myID = newBE.Representations[0].ref;
                var myOBJ = _OBJList.find(x => x.GlobalID === myID);
                //var foundMeshes = jsonPath(_OBJList, "$..[?(@.RepresentationType=='OBJ')]");
                newBE.Mesh = myOBJ.Mesh.clone();
                _BEList.push(newBE);
            }
            catch (e) {
                console.log("Some error in object creation");
             }
        }
    } // for
    _objTable.dataObjects = _BEList;
    _objTable.refreshObjectTable();
/*     console.log("Params: " + _uniqueParams); 
    console.log("Classes: " + _uniqueClasses);  */

    console.log(_uniqueParams); 
    console.log(_uniqueClasses); 
}

function onPathChanged() {
    _selString = document.getElementById("pathname").value;
    updateModel();

}