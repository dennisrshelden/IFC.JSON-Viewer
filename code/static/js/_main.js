
function setup() {
    //_BEClasses = [Wall, Space, Slab, Column, FurnishingElement, Footing ]; // !!MUST DO: ADD NEW CLASSES TO THIS ARRAY:
    // _BEClasses = [Column]; // !!MUST DO: ADD NEW CLASSES TO THIS ARRAY:
    _parameterList = ["GlobalId","Name", "Class", "Color", "Opacity"]; // parameters to be displayed in edit table

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
    JSONARR = jsonPath(JSONARR_ORIG, _selString);
    _BEList = [];
    _uniqueParams = new Set();

    for (var i = 0; i < JSONARR.length; i++) {
        var itemObj = JSONARR[i];
        if (_BEClasses.includes(itemObj.Class)) {
            try {
                var newBE = new BuildingElement(itemObj.Class, itemObj);
                // newBE.setData(itemObj);
                _BEList.push(newBE);
            }
            catch (e) {
                console.log("Some error in object creation");
             }
        }
    } // for
    _objTable.dataObjects = _BEList;
    _objTable.refreshObjectTable();
    console.log(_uniqueParams); 
}

function onPathChanged() {
    _selString = document.getElementById("pathname").value;
    updateModel();

}