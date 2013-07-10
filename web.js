var express = require('express');

var idxfile = require('fs');
idxfile = fs.readFileSync('index.html');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(indexfile);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
