unit = 1

# Variables
paint = false
clicks = new Array()
ctx = {}
trainingCounts = [0..10].map -> 0
# Public Functions
init = () ->
	canvas = document.getElementById 'NumberCanvas'
	ctx = canvas.getContext('2d')
	bindEvents canvas

	submitBtn = document.getElementById 'submitNumber'
	submitBtn.addEventListener('click', (e) ->
		ddlAction = document.getElementById 'action'
		action = ddlAction.options[ddlAction.selectedIndex].value

		scaleCanvas = scaleImage(canvas,ctx);
		imgData = scaleCanvas.getContext('2d').getImageData(0, 0, 30, 30)
		pixelMap = 
			for x in [0..imgData.width-1]
				for y in [0..imgData.height-1]
					convertToGrayscale(getPixel(imgData, x, y))
		pixelData = _.flatten pixelMap
		if action == "11"
			sendPostData new RequestData([pixelData]), scaleCanvas
		else
			sendTrainingData {data: pixelData, num: action}
	)

	clearBtn = document.getElementById 'clear'
	clearBtn.addEventListener 'click', (e) ->
		clear canvas

clear = (canvas) ->
	#clear drawing area
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	clicks = new Array()

bindEvents = (canvas) ->
	canvas.addEventListener('mousedown', (e) ->
		paint = true
		addClick e.offsetX, e.offsetY, false
		redraw()
		unit
	)
	canvas.addEventListener('mousemove', (e) ->
		if paint
			addClick e.offsetX, e.offsetY, true
			#addClick e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true
			redraw()
		unit
	)
	canvas.addEventListener('mouseup', (e) ->
		paint = false
		unit
	)
	canvas.addEventListener('mouseleave', (e) ->
		paint = false
		unit
	)
	canvas

addClick = (x, y, dragging) ->
	clicks.push {
		x: x,
		y: y
		drag: dragging
	}
	unit

redraw = () ->
	ctx.clearRect 0, 0, ctx.canvas.width, ctx.canvas.height
	ctx.strokeStyle = '#000000'
	ctx.lineJoin = 'round'
	ctx.lineWidth = 12

	_.forEach clicks, (v, k) ->
		ctx.beginPath()
		if v.drag and k
			ctx.moveTo clicks[k-1].x, clicks[k-1].y
		else
			ctx.moveTo v.x-1, v.y

		ctx.lineTo v.x, v.y
		ctx.closePath()
		ctx.stroke()
	unit

scaleImage = (canvas) ->
	#Create new canvas
	scaleCanvas = document.createElement('canvas')
	scaleCtx = scaleCanvas.getContext("2d");

	#Set Size
	scaleCanvas.width = 30
	scaleCanvas.height = 30

	#Scale Image
	scaleCtx.scale(.2,.2);
	scaleCtx.drawImage(canvas,0,0)

	clear canvas
	#return scaled down image
	scaleCanvas

getPixel = (imgData,x,y)  ->
	index = y*imgData.width+x
	i = index*4
	d = imgData.data
	color =
		r : d[i],
		g : d[i+1],
		b : d[i+2],
		a : d[i+3]

convertToGrayscale = (pixel) ->
	pixel.a/255
	#(((0.2125*pixel.r) + (0.7154 * pixel.g) + (0.0721 * pixel.b))/255).toString()
	
sendPostData = (req, img) ->
	
	xhttp = new XMLHttpRequest()
	xhttp.open "POST", '/img', true
	xhttp.setRequestHeader 'Content-Type', 'application/json'
	xhttp.onreadystatechange = () ->
		if xhttp.readyState == 4 && xhttp.status == 200
			data = JSON.parse xhttp.responseText
			table = document.getElementById 'results'
			row = document.createElement('tr')
			cell = document.createElement('td')
			cell.appendChild img
			row.appendChild cell
			if data.statusCode is 200
				pd = data.body.Results.Number.value.Values[0]

				cell = document.createElement('td')
				val = pd[pd.length-1]
				cell.innerHTML = if val is 10 then 0 else val
				row.appendChild cell

				cell = document.createElement('td')
				cell.innerHTML = "#{Math.trunc(pd[val-1] * 10000)/100}%"
				row.appendChild cell
			else
				console.log 'failed to predict'
				cell = document.createElement('td')
				cell.innerHTML = 'failed to predict'
				row.appendChild cell

				cell = document.createElement('td')
				cell.innerHTML = 'N/A'
				row.appendChild cell

				row.className = "danger"

			if table.childNodes.length == 0
				table.appendChild row
			else
				table.insertBefore row, table.childNodes[0]

	xhttp.send JSON.stringify req
	

sendTrainingData = (req) ->
	#req.data = _.map [0..900], (v) -> v.toString()
	#req.num = "Number"
	xhttp = new XMLHttpRequest()
	xhttp.open "POST", '/train', true
	xhttp.setRequestHeader 'Content-Type', 'application/json'
	xhttp.onreadystatechange = () ->
		if xhttp.readyState == 4 && xhttp.status == 200
			data = JSON.parse xhttp.responseText
			console.log "#{data.response} for #{req.num}"
			trainingCounts[req.num] += 1
			container = document.getElementById 'trainingResults'
			container.innerHTML = ''
			ul = document.createElement('ul')
			_.forEach trainingCounts, (v, k) ->
				li = document.createElement('li')
				k = 0 if k is 10
				li.innerHTML = "#{k}:#{v}"
				ul.appendChild li
			container.appendChild ul

	xhttp.send JSON.stringify req

RequestData = (values) ->
	this.Inputs =
		Number:
			Values: values
	this.GlobalParameters = {}
	unit

window.addEventListener('load', init, false)