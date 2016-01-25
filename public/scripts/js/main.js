(function() {
  var addClick, apiKey, bindEvents, clicks, convertToGrayscale, ctx, getPixel, init, mouseX, mouseY, paint, redraw, s, scaleImage, sendPostData, unit, wsUrl;

  unit = 1;

  s = {};

  paint = false;

  mouseX = {};

  mouseY = {};

  clicks = new Array();

  ctx = {};

  wsUrl = "https://ussouthcentral.services.azureml.net/workspaces/a85ddf947a0d405a88479716d397e9d6/services/715562c4fd3047198f6460ec5f6aae09/execute?api-version=2.0&details=true";

  apiKey = "mhsFax1F6uyU/9384crjqbBIjFiS80Qrhel8egogSWwV2DyTV1LsAvWtlRr/zCOM7+JQENrStml8o/k9+N+bCQ==";

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
      sendPostData();
      debugger;
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
    ctx.strokeStyle = '#df4b26';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
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
    tempCanvas.width = 100;
    tempCanvas.height = 100;
    imageData = ctx.getImageData(0, 0, 100, 100);
    tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
    scaleCtx.scale(.2, .2);
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
    return (0.2125 * pixel.r) + (0.7154 * pixel.g) + (0.0721 * pixel.b);
  };

  sendPostData = function() {
    debugger;
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/img', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        return console.log(xhttp.responseText);
      }
    };
    return xhttp.send(requestData);
  };

  window.addEventListener('load', init, false);

}).call(this);
