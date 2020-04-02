//----------------------------- Setup -----------------------------------//
function setup() {
    _parameterList = ["GlobalId", "Name", "Class", "Volume", "Color", "Opacity"]; // parameters to be displayed in edit table

    _BEList = [];

    _objTable = new UITable(_BEList, _parameterList, document.getElementById("objTable"));
    //readClasses
    $.getJSON("cfg/classes.json", function (data) {
        _classData = data;
        _BEClasses = jsonPath(_classData, "$.[Class]");
        //console.log(_BEClasses);
    })

    setup3D();

    setModelServerType("FILESYSTEM");
    setupFilterList("JSONPath_Query");
}


//------------------------------------- Callbacks -----------------------------------------//

//----------------------- setModelServerType - on server radio change ---------------------//
function setModelServerType(atype) {
    _modelServerType = atype;

    if (_modelServerType == "FILESYSTEM") {
        $.getJSON("/filelist", function (data) {
            //console.log(data);
            _backgroundColor = 0xcccccc;
            setupModelList(data);
        });
    }
    else if (_modelServerType == "MONGO") {
        $.getJSON("/collectionlist", function (data) {
            //console.log(data);
            _backgroundColor = 0x333388;
            setupModelList(data);
        });
    }
}

//----------------------- setModelServerType - on server radio change ---------------------//
function setupModelList(filenames) {
    //var filenames = FNAMELIST.split(',');
    var selObj = document.getElementById("fileSelect");
    selObj.options.length = 0;

    var option = document.createElement("option");
    option.text = "";
    selObj.add(option);

    for (var i = 0; i < filenames.length; i++) {
        var option = document.createElement("option");
        option.text = filenames[i];
        selObj.add(option);
    }
}

function modelSelectChange() {
    var selObj = document.getElementById("fileSelect");
    _selFileName = selObj.options[selObj.selectedIndex].text;
    document.getElementById("modelName").value = _selFileName.split('.')[0];

    if (_modelServerType == "MONGO") {

        $.getJSON("mongodb?collectionName=" + _selFileName, function (data) {
            JSONARR_ORIG = data;
            updateModel();

        })

    }
    else {
        //$.getJSON("data/data.json", function (data) {
        $.getJSON("data/" + _selFileName, function (data) {
            JSONARR_ORIG = data;
            console.log(JSONARR_ORIG);
            updateModel();

        })
    }
}


function updateModel() {
    OBJARR = jsonPath(JSONARR_ORIG, "$..[?(@.RepresentationType=='OBJ')]");
    _MeshesByID = [];
    _IfcJSONSubsetList = [];
    var i;
    var loader = new THREE.OBJLoader();
    for (i = 0; i < OBJARR.length; i++) {
        var myObj = OBJARR[i];
        var curMesh = loader.parse(myObj.Items[0]);
        var curObj = { GlobalId: myObj.GlobalId, Mesh: curMesh, IfcJSON: myObj };
        if (curObj) {
            _MeshesByID.push(curObj);
        }
    }


    if (_selFilterType=="JSONPath_Query") JSONARR = jsonPath(JSONARR_ORIG, _selString);
    else JSONARR = JSONARR_ORIG;
    _BEList = [];



    for (i = 0; i < JSONARR.length; i++) {
        var elem = JSONARR[i];
        if (elem && elem.Class && _BEClasses.includes(elem.Class)) {
            try {
                var classname = elem.Class;
                elem.Color = _classData.find(x => x.Class === classname).Color;
                elem.Opacity = _classData.find(x => x.Class === classname).Opacity;

                var myID = elem.Representations[0].ref; // the ID of the Geometry Ref
                var myOBJ = _MeshesByID.find(x => x.GlobalId === myID); // find the ref by ID
                if (myOBJ) {
                    elem.Mesh = myOBJ.Mesh.clone();
                    _IfcJSONSubsetList.push(myOBJ.IfcJSON)
                }

                _BEList.push(elem);
            }
            catch (e) {
                console.log("Some error in object creation");
            }
        }
    } // for 
    if (_objTable) {
        _objTable.dataObjects = _BEList;
        _objTable.refreshObjectTable();
    }
    update3D();
}


function saveModel() {

    _BEList.forEach(elem => {
        if (elem.Mesh) {
            delete elem.Mesh;
        }
        if (elem.GlobalId) {
            elem._id = elem.GlobalId;
        }
    });

    _IfcJSONSubsetList.forEach(elem => {
/*         if (elem.Mesh) {
            delete elem.Mesh;
        } */
        if (elem.GlobalId) {
            elem._id = elem.GlobalId;
        }
    });


    var newlist = _BEList.concat(_IfcJSONSubsetList);   // The list we will send


    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.onreadystatechange = function () {
        var a = this.responseText;
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("result").innerHTML =
                this.responseText;
        }
    };
    var collectionName = document.getElementById("modelName").value;
    console.log("collectionName: " + collectionName);
    if (_modelServerType == "FILESYSTEM") {
        var uristring = "http://127.0.0.1:8000/pushFile?collection=" + collectionName;
    }
    else {
        var uristring = "http://127.0.0.1:8000/pushModel?collection=" + collectionName;
    }
    xmlhttp.open("POST", uristring);
    //xmlhttp.open("POST", "http://127.0.0.1:8000/test");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.send(JSON.stringify(newlist));

}

//----------------------- filter actions  ---------------------//

function onFilterChange() {
    _selString = document.getElementById("filterName").value;
    if (_selFilterType == "Mongo_Query") {
        $.getJSON("mongodb?collectionName=" + _selFileName + "&queryString=" + _selString
        , function (data) {
            JSONARR_ORIG = data;
            updateModel();
        });

    }
    else     updateModel();


}

function setFilterType (filterName) { // mongo query vs. schema, etc.
    setupFilterList(filterName);

}

function setupFilterList(filterName) {
    _selFilterType = filterName;
    //var filenames = FNAMELIST.split(',');
    var selObj = document.getElementById("filterSelect");
    selObj.options.length = 0;

    var option = document.createElement("option");
    option.text = "";
    selObj.add(option);
    var aset = _savedQueries[filterName];

    for (var i = 0; i < aset.length; i++) {
        var option = document.createElement("option");
        option.text = aset[i];
        selObj.add(option);
    }
}

function filterSelectChange() {
    var selObj = document.getElementById("filterSelect");
    _selString = selObj.options[selObj.selectedIndex].text;
    document.getElementById("filterName").value = _selString;
    onFilterChange();
/* 
    if (_modelServerType == "MONGO") {

        $.getJSON("mongodb?collectionName=" + selFilterName, function (data) {
            JSONARR_ORIG = data;
            updateModel();

        })

    }
    else {
        //$.getJSON("data/data.json", function (data) {
        $.getJSON("data/" + selFilterName, function (data) {
            JSONARR_ORIG = data;
            console.log(JSONARR_ORIG);
            updateModel();

        })
    } */
}