express = require 'express'
request = require 'request'
bodyParser = require 'body-parser'
csvWriter = require('csv-write-stream')
fs = require('fs');

app = express()
app.engine 'html', require('ejs').renderFile
app.use express.static('public')
app.use bodyParser.json()
writer = csvWriter()

app.get '/', (req, res) ->
	res.render 'index.html'

app.post '/train', (req,res) ->
	console.log "Training Request Receieved for #{req.body.num}"
	fs.appendFile('trainingData.csv', "#{req.body.data.join(',')},#{req.body.num}\n", encoding='utf8', (err) ->
		if (err)
			console.log "Error Writing to csv #{err}"
			res.send err
		else
			res.send {response:"Success!"}
	)

app.post '/img', (req,res) ->
	console.log 'Receieved Number Request'
	wsRequest = request({
		url: wsUrl,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': "Bearer #{apiKey}"
		}
		json: req.body
	}, (error, response, body) ->
		if error 
			console.log error
			res.send error
		else
			res.send response
	)

app.listen 3000, () ->
	console.log 'Server Started'

#wsUrl = 'https://ussouthcentral.services.azureml.net/workspaces/a85ddf947a0d405a88479716d397e9d6/services/715562c4fd3047198f6460ec5f6aae09/execute?api-version=2.0'
#apiKey = 'mhsFax1F6uyU/9384crjqbBIjFiS80Qrhel8egogSWwV2DyTV1LsAvWtlRr/zCOM7+JQENrStml8o/k9+N+bCQ=='

wsUrl = 'https://ussouthcentral.services.azureml.net/workspaces/a85ddf947a0d405a88479716d397e9d6/services/9df76eb337174d21adb5ccab17316307/execute?api-version=2.0'
apiKey = 'AZvmTwtOs2XnF50EW7Z8YXe/zXb/dkflx8ACmqGAZGqDDvkFbJnEmt2JSGMk1AaG5/xvek8uOdl/7x3g0ZIoxA=='