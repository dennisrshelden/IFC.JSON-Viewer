
var _OBJList = [];           // The main list of all BuildingElements to be displayed
var _BEList = [];           // The main list of all BuildingElements to be displayed
var _BEClasses = [];        // The list of all non-abstract classes. User MUST list these in userDraw() [Chair, Column, ...]
//var _BEClassesByNames = []; // [{"Chair" : Chair}, {"Column" : Column}, ...]
//var _currentBEClass;        // When a class is user selected for object creation, a reference to the Class is stored here 
var _parameterList;         // The list of parameters to be rendered in the BE object table. User defined: ["name", "type", "level", ...]


var _dynamicPoints = [];    // The list of points that is collected when in element creation mode: 1 for PointElements, 2 for LinearElements, ...
var _orthoMode = false;     // Sets whether new user created points are restricted to orthnogoal to the last points or can be anyhere
var _currentRotation = 0;   // Orientation (0...3) based on user keying LEFT_ARROW or ','  RIGHT_ARROW or '.' Sets the orientation for new objects

var _selectedElement;       // If an element is selected, a reference to it is stored here
var _selectedID;            // The selected element's position (0...n) in _BEList. Useful for deleting it from _BEList, etc.
var _currentLevel;          // User set current level from UI. Used to set level for newly created entities
var _backgroundColor2D;     // Used for rendering the P5 scene

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
var _objTable;