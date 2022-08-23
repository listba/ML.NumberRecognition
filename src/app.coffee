express = require 'express'
request = require 'request'
bodyParser = require 'body-parser'
ejs = require('ejs')
fs = require('fs');
nconf = require('nconf');

#Get Config Driven Data
nconf.argv().env().file { file: './config.json' }
apiKey = nconf.get 'apiKey'
wsUrl = nconf.get 'wsUrl'

app = express()
app.engine 'html', ejs.renderFile
app.use express.static('./src/public')
app.use bodyParser.json()
app.set('views', './src/views/')
# Fetch index page
app.get '/', (req, res) ->
	res.render 'index.html'

# Gets Training Data form API Request and appends it to a csv file
app.post '/train', (req,res) ->
	console.log "Training Request Receieved for #{req.body.num}"
	fs.appendFile 'trainingData.csv', "#{req.body.data.join(',')},#{req.body.num}\n", encoding='utf8', (err) ->
		if (err)
			console.log "Error Writing to csv #{err}"
			res.send err
		else
			res.send {response:"Success!"}

# Predict Value from API Request
app.post '/img', (req,res) ->
	console.log 'Receieved Number Request'
	wsRequest = request({
		uri: wsUrl,
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