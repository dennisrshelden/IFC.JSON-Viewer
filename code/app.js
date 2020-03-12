const express = require('express');
const app = express();
app.use(express.static('static')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


app.get('/', function(req, res){
    res.sendFile('html/index.html');
  }); 

app.listen(3000, function(){
  console.log("Listening on port 3000!")
});