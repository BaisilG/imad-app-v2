var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
app.use('/ui', express.static(path.join(__dirname, 'ui')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var port = 8080;
app.listen(port, function () {
  console.log('NHS pay calculator listening on port ' + port + '!');
});
