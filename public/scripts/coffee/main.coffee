unit = 1

# Variables
s = {}
paint = false
mouseX = {}
mouseY = {}
clicks = new Array()
ctx = {}

# Public Functions
init = () ->
	canvas = document.getElementById 'NumberCanvas'
	ctx = canvas.getContext('2d')
	bindEvents canvas

	scaleBtn = document.getElementById 'scale'
	scaleBtn.addEventListener('click', (e) ->
		imgData = scaleImage(canvas,ctx);
		pixelMap = 
			for x in [0..imgData.width-1]
				for y in [0..imgData.height-1]
					convertToGrayscale(getPixel(imgData, x, y))

		requestDataBase.Inputs.Number.Values = [_.flatten pixelMap]
		requestData.Inputs.Number.Values = [].push _.flatten pixelMap
		sendPostData requestDataBase
	);

# Private Functions
bindEvents = (canvas) ->
	canvas.addEventListener('mousedown', (e) ->
		mouseX = e.pageX - this.offsetLeft
		mouseY = e.pageY - this.offsetTop
		paint = true
		addClick e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false
		redraw()
		unit
	)
	canvas.addEventListener('mousemove', (e) ->
		if paint
			addClick e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true
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
	ctx.lineWidth = 9

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

scaleImage = () ->
	scale = document.getElementById 'ScaleCanvas'
	scaleCtx = scale.getContext("2d");
	tempCanvas = document.createElement('canvas')
	tempCanvas.width = 200
	tempCanvas.height = 200
	imageData = ctx.getImageData(0, 0, 200, 200);
	tempCanvas.getContext('2d').putImageData(imageData,0,0)
	scaleCtx.scale(.1,.1);
	scaleCtx.drawImage(tempCanvas,0,0)
	scaleCtx.getImageData(0, 0, 20, 20);

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
	
sendPostData = (req) ->
	xhttp = new XMLHttpRequest()
	xhttp.open "POST", '/img', true
	xhttp.setRequestHeader 'Content-Type', 'application/json'
	xhttp.onreadystatechange = () ->
		if xhttp.readyState == 4 && xhttp.status == 200
			data = JSON.parse xhttp.responseText
			if data.statusCode is 200
				pd = data.body.Results.Number.value.Values[0].slice(400)
				console.log pd
	xhttp.send JSON.stringify req


window.addEventListener('load', init, false)