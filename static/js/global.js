
var _MeshesByID = [];           // The main list of all BuildingElements to be displayed
var _IfcJSONSubsetList = [];    // List of only OBJs used in view
var _BEList = [];           // The main list of all BuildingElements to be displayed
var _BEClasses = [];        // The list of all non-abstract classes. User MUST list these in userDraw() [Chair, Column, ...]
//var _BEClassesByNames = []; // [{"Chair" : Chair}, {"Column" : Column}, ...]
//var _currentBEClass;        // When a class is user selected for object creation, a reference to the Class is stored here 
var _parameterList;         // The list of parameters to be rendered in the BE object table. User defined: ["name", "type", "level", ...]


var _selectedElement;       // If an element is selected, a reference to it is stored here
var _selectedID;            // The selected element's position (0...n) in _BEList. Useful for deleting it from _BEList, etc.
var _backgroundColor = 0xcccccc;     // Used for rendering the P5 scene

/// 3D Scene global variables
var scene, camera3d, renderer, controls, light, gridTexture;
var meshArr = [];   // the array of THREE meshes that are collected from draw3D() amd then rendered
var ang = 0.0;
var div3D;
var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH_PERCENT = .25;


var JSONARR_ORIG = [];   // an array of ALL data objects read from the stored files
var JSONARR = [];   // an array of ALL data objects read from the stored files

var OBJARR_ORIG = [];   // an array of ALL data objects read from the stored files
var OBJARR = [];   // an array of ALL data objects read from the stored files

var data;
var _classData;
var isSetup3d = false;
var _selString = "$.."
var _selFilterType = "JSONPath_Query";
var _objTable;
var _modelServerType = "FILESYSTEM"; // "FILESYSTEM" , "MONGO"
var ioType = "READ"; // "READ" , "WRITE"

var _savedQueries = {
    "JSONPath_Query": [
        "$..",
        "$..[?(@.Class=='Wall')]",
        "$..[?(@.Class=='Slab')]",
        "$..[?(@.Class=='Space')]",
        "$..[?(@.Class=='Window')]",
        "$..[?(@.Class=='FurnishingElement')]",
        
        "$..[?(@.Class == 'FurnishingElement' || @.Class == 'Space' || @.Class == 'Slab')]",
        "$..[?(@.Class == 'Slab' || @.Class == 'FurnishingElement' )]",
        
        "$..[?(@.PSet_Revit_Type_Other=='AccessibilityPerformance')]",
        "$..[?(@.PSet_Revit_Phasing=='New Construction')]",
        
        "$..[?(@.Volume==262924.86837177584)]",
        "$..[?(@.Volume<=50000.0)]",
        
        "$..[?(@.GlobalId=='32ca7e71-00a5-4a22-9043-3c8d01dd2444')]",
        
        "$..[?(@.Class == 'Wall' && @.Volume<=50000.0)]",
        
        "$..[?(@.CompositionType=='.ELEMENT.')]",
        "$..[?(@.isExternal==true)]",
        "$..[?(@.Level=='Level 2')]",
    ], 

    "Mongo_Query": [
        '{"Class":"Wall"}',
        '{"Class":"Space"}',
        '{"Volume":{"$gt":50000}}'
    ],

    "IfcJSON_Schema_Query": []
};