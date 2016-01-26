(function() {
  var apiKey, app, bodyParser, csvWriter, express, fs, request, writer, wsUrl;

  express = require('express');

  request = require('request');

  bodyParser = require('body-parser');

  csvWriter = require('csv-write-stream');

  fs = require('fs');

  app = express();

  app.engine('html', require('ejs').renderFile);

  app.use(express["static"]('public'));

  app.use(bodyParser.json());

  writer = csvWriter();

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

  wsUrl = 'https://ussouthcentral.services.azureml.net/workspaces/a85ddf947a0d405a88479716d397e9d6/services/9df76eb337174d21adb5ccab17316307/execute?api-version=2.0';

  apiKey = 'AZvmTwtOs2XnF50EW7Z8YXe/zXb/dkflx8ACmqGAZGqDDvkFbJnEmt2JSGMk1AaG5/xvek8uOdl/7x3g0ZIoxA==';

}).call(this);
