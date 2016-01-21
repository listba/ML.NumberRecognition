unit = 1

draw = () ->
	canvas = document.getElementById 'NumberCanvas'
	ctx = canvas.getContext('2d')
	canvas.addEventListener("mousedown", (e) ->
		mouseX = e.pageX - this.offsetLeft
		mouseY = e.pageY - this.offsetTop
		paint = true
		unit
		#addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		#redraw();
	)