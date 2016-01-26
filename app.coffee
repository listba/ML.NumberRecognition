express = require 'express'
request = require 'request'
bodyParser = require 'body-parser'
csvWriter = require('csv-write-stream')
fs = require('fs');
nconf = require('nconf');
nconf.argv()
   .env()
   .file({ file: './config.json' });

console.log('apiKey: ' + nconf.get('apiKey'))
console.log('wsUrl: ' + nconf.get('wsUrl'))

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