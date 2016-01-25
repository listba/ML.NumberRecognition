(function() {
  var apiKey, app, bodyParser, express, request, wsUrl;

  express = require('express');

  request = require('request');

  bodyParser = require('body-parser');

  app = express();

  app.engine('html', require('ejs').renderFile);

  app.use(express["static"]('public'));

  app.use(bodyParser.json());

  app.get('/', function(req, res) {
    return res.render('index.html');
  });

  app.post('/img', function(req, res) {
    var wsRequest;
    console.log("Receieved Number Request");
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

  wsUrl = 'https://ussouthcentral.services.azureml.net/workspaces/a85ddf947a0d405a88479716d397e9d6/services/715562c4fd3047198f6460ec5f6aae09/execute?api-version=2.0&details=true';

  apiKey = 'mhsFax1F6uyU/9384crjqbBIjFiS80Qrhel8egogSWwV2DyTV1LsAvWtlRr/zCOM7+JQENrStml8o/k9+N+bCQ==';

}).call(this);
