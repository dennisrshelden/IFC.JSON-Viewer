const express = require('express');
const fs = require('fs');
const serveIndex = require('serve-index')
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
const url = require('url');
var db;

const app = express();


app.use(bodyParser({ limit: '50mb' }));
//app.use(bodyParser.json());

app.use(express.static('static')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


app.get('/', function (req, res) {
  res.sendFile('static/index.html');
});


app.use('/filelist', express.static('static/data'), serveIndex('static/data', { 'icons': true }))


//Establish Connection
MongoClient.connect('mongodb://localhost:27017/mydb', function (err, database) {
  if (err)
    throw err
  else {
    db = database;
    console.log('Connected to MongoDB');
    //Start app only after connection is ready
    app.listen(8000, function () {
      console.log("Listening on port 8000!")
    });
  }
});


/* // makes a post entry point at /add for adding new JSON model files into /static/data 
app.post('/add', (req, res) => {
  var filename = req.body.name + ".json";
  var data = req.body.details;
  data = '[' + data + ']';
  fs.writeFileSync("static/data/" + filename, data);
  res.redirect('/draw');
}); */

app.post('/pushFile', function (req, res) {
  // Insert JSON straight into MongoDB
  console.log('Post! file');
  const queryObject = url.parse(req.url, true).query;
  var collectionName = "static/data/" + queryObject.collection + ".json";

  fs.writeFile(collectionName, JSON.stringify(req.body), (err) => {
    if (err) { console.log('error writing file'); throw err; }
    console.log('Data written to file');
  });

});

app.post('/pushModel', function (req, res) {
  // Insert JSON straight into MongoDB
  console.log('Post!');
  var dbo = db.db("mydb3");
  const queryObject = url.parse(req.url, true).query;
  var collectionName = queryObject.collection;
  console.log("collection name: " + collectionName);
  dbo.collection(collectionName).insertMany(req.body, function (err, res2) {
    if (err)
      res.send('Error');
    else
      //res.send("Success");
      res.status(200).send('Success')

  });
});




app.get('/mongodb', function (req, res) {

  console.log('Mongo!');

  var dbo = db.db("mydb3");
  const query = url.parse(req.url, true).query;
  var collectionName = query.collectionName;
  console.log("collection name: " + collectionName);
  var queryString = query.queryString;
  if (queryString == "") {
    queryString = '{"Class":"Space"}';
  }


  var queryObjects;
  if (queryString) queryObjects = JSON.parse(queryString);
 // queryObjects = null;

  if (queryObjects) {

    //var querywithOBJ = { RepresentationType: "OBJ" };
    var querywithOBJ = { $or: [  { RepresentationType: "OBJ" } , queryObjects] };
    console.log("queryString: " + JSON.stringify(querywithOBJ));
    dbo.collection(collectionName).find(querywithOBJ).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  }
  else {
    console.log("No queryString");
    dbo.collection(collectionName).find({}).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  }
});


// lists all the Mongo collections in the Mongo database
app.get('/collectionlist', function (req, res) {

  console.log('collectionlist!');

  var dbo = db.db("mydb3");
  //
  dbo.listCollections().toArray(function (err, result) {
    if (err) throw err;
    //console.log(result);
    var resJSON = [];
    resJSON.push("");
    result.forEach(function (item) {
      resJSON.push(item.name);
    });
    res.json(resJSON);
    //db.close();
  });
});




/* // makes a post entry point at /add for adding new JSON model files into /static/data
app.post('/add', (req, res) => {
  var filename = req.body.name + ".json";
  var data = req.body.details;
  data = '[' + data + ']';
  fs.writeFileSync("static/data/" + filename, data);
  res.redirect('/draw');
}); */