express = require 'express'
app = express();
app.engine 'html', require('ejs').renderFile
app.use express.static('public')

app.get '/', (req, res) ->
	res.render 'index.html'


app.post '/img', (req,res) ->
	console.log req
	res.send "Request Receieved"	


app.listen 3000, () ->
	console.log 'Woot Woot!'
