(function() {
  var addClick, bindEvents, clicks, convertToGrayscale, ctx, getPixel, init, mouseX, mouseY, paint, redraw, s, scaleImage, sendPostData, unit;

  unit = 1;

  s = {};

  paint = false;

  mouseX = {};

  mouseY = {};

  clicks = new Array();

  ctx = {};

  init = function() {
    var canvas, scaleBtn;
    canvas = document.getElementById('NumberCanvas');
    ctx = canvas.getContext('2d');
    bindEvents(canvas);
    scaleBtn = document.getElementById('scale');
    return scaleBtn.addEventListener('click', function(e) {
      var imgData, pixelMap, x, y;
      imgData = scaleImage(canvas, ctx);
      pixelMap = (function() {
        var j, ref, results;
        results = [];
        for (x = j = 0, ref = imgData.width - 1; 0 <= ref ? j <= ref : j >= ref; x = 0 <= ref ? ++j : --j) {
          results.push((function() {
            var l, ref1, results1;
            results1 = [];
            for (y = l = 0, ref1 = imgData.height - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; y = 0 <= ref1 ? ++l : --l) {
              results1.push(convertToGrayscale(getPixel(imgData, x, y)));
            }
            return results1;
          })());
        }
        return results;
      })();
      requestDataBase.Inputs.Number.Values = [_.flatten(pixelMap)];
      requestData.Inputs.Number.Values = [].push(_.flatten(pixelMap));
      return sendPostData(requestDataBase);
    });
  };

  bindEvents = function(canvas) {
    canvas.addEventListener('mousedown', function(e) {
      mouseX = e.pageX - this.offsetLeft;
      mouseY = e.pageY - this.offsetTop;
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
      redraw();
      return unit;
    });
    canvas.addEventListener('mousemove', function(e) {
      if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
      return unit;
    });
    canvas.addEventListener('mouseup', function(e) {
      paint = false;
      return unit;
    });
    canvas.addEventListener('mouseleave', function(e) {
      paint = false;
      return unit;
    });
    return canvas;
  };

  addClick = function(x, y, dragging) {
    clicks.push({
      x: x,
      y: y,
      drag: dragging
    });
    return unit;
  };

  redraw = function() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    _.forEach(clicks, function(v, k) {
      ctx.beginPath();
      if (v.drag && k) {
        ctx.moveTo(clicks[k - 1].x, clicks[k - 1].y);
      } else {
        ctx.moveTo(v.x - 1, v.y);
      }
      ctx.lineTo(v.x, v.y);
      ctx.closePath();
      return ctx.stroke();
    });
    return unit;
  };

  scaleImage = function() {
    var imageData, scale, scaleCtx, tempCanvas;
    scale = document.getElementById('ScaleCanvas');
    scaleCtx = scale.getContext("2d");
    tempCanvas = document.createElement('canvas');
    tempCanvas.width = 200;
    tempCanvas.height = 200;
    imageData = ctx.getImageData(0, 0, 200, 200);
    tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
    scaleCtx.scale(.1, .1);
    scaleCtx.drawImage(tempCanvas, 0, 0);
    return scaleCtx.getImageData(0, 0, 20, 20);
  };

  getPixel = function(imgData, x, y) {
    var color, d, i, index;
    index = y * imgData.width + x;
    i = index * 4;
    d = imgData.data;
    return color = {
      r: d[i],
      g: d[i + 1],
      b: d[i + 2],
      a: d[i + 3]
    };
  };

  convertToGrayscale = function(pixel) {
    return pixel.a / 255;
  };

  sendPostData = function(req) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/img', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
      var data, pd;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        data = JSON.parse(xhttp.responseText);
        if (data.statusCode === 200) {
          pd = data.body.Results.Number.value.Values[0].slice(400);
          return console.log(pd);
        }
      }
    };
    return xhttp.send(JSON.stringify(req));
  };

  window.addEventListener('load', init, false);

}).call(this);
