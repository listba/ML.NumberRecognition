(function() {
  var apiKey, app, bodyParser, ejs, express, fs, nconf, request, wsUrl;

  express = require('express');

  request = require('request');

  bodyParser = require('body-parser');

  ejs = require('ejs');

  fs = require('fs');

  nconf = require('nconf');

  nconf.argv().env().file({
    file: './config.json'
  });

  apiKey = nconf.get('apiKey');

  wsUrl = nconf.get('wsUrl');

  app = express();

  app.engine('html', ejs.renderFile);

  app.use(express["static"]('public'));

  app.use(bodyParser.json());

  app.get('/', function(req, res) {
    return res.render('index.html');
  });

  app.post('/train', function(req, res) {
    var encoding;
    console.log("Training Request Receieved for " + req.body.num);
    return fs.appendFile('trainingData.csv', (req.body.data.join(',')) + "," + req.body.num + "\n", encoding = 'utf8', function(err) {
      if (err) {
        console.log("Error Writing to csv " + err);
        return res.send(err);
      } else {
        return res.send({
          response: "Success!"
        });
      }
    });
  });

  app.post('/img', function(req, res) {
    var wsRequest;
    console.log('Receieved Number Request');
    return wsRequest = request({
      url: wsUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + apiKey
      },
      json: req.body
    }, function(error, response, body) {
      if (error) {
        console.log(error);
        return res.send(error);
      } else {
        return res.send(response);
      }
    });
  });

  app.listen(3000, function() {
    return console.log('Server Started');
  });

}).call(this);
