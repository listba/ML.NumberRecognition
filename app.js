(function() {
  var app, express;

  express = require('express');

  app = express();

  app.engine('html', require('ejs').renderFile);

  app.use(express["static"]('public'));

  app.get('/', function(req, res) {
    return res.render('index.html');
  });

  app.post('/img', function(req, res) {
    console.log(req);
    return res.send("Request Receieved");
  });

  app.listen(3000, function() {
    return console.log('Woot Woot!');
  });

}).call(this);
