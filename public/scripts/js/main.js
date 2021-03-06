(function() {
  var RequestData, addClick, bindEvents, clear, clicks, convertToGrayscale, ctx, getPixel, init, paint, redraw, scaleImage, sendPostData, sendTrainingData, trainingCounts, unit;

  unit = 1;

  paint = false;

  clicks = new Array();

  ctx = {};

  trainingCounts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function() {
    return 0;
  });

  init = function() {
    var canvas, clearBtn, submitBtn;
    canvas = document.getElementById('NumberCanvas');
    ctx = canvas.getContext('2d');
    bindEvents(canvas);
    submitBtn = document.getElementById('submitNumber');
    submitBtn.addEventListener('click', function(e) {
      var action, ddlAction, imgData, pixelData, pixelMap, scaleCanvas, x, y;
      ddlAction = document.getElementById('action');
      action = ddlAction.options[ddlAction.selectedIndex].value;
      scaleCanvas = scaleImage(canvas, ctx);
      imgData = scaleCanvas.getContext('2d').getImageData(0, 0, 30, 30);
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
      pixelData = _.flatten(pixelMap);
      if (action === "11") {
        return sendPostData(new RequestData([pixelData]), scaleCanvas);
      } else {
        return sendTrainingData({
          data: pixelData,
          num: action
        });
      }
    });
    clearBtn = document.getElementById('clear');
    return clearBtn.addEventListener('click', function(e) {
      return clear(canvas);
    });
  };

  clear = function(canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return clicks = new Array();
  };

  bindEvents = function(canvas) {
    canvas.addEventListener('mousedown', function(e) {
      paint = true;
      addClick(e.offsetX, e.offsetY, false);
      redraw();
      return unit;
    });
    canvas.addEventListener('mousemove', function(e) {
      if (paint) {
        addClick(e.offsetX, e.offsetY, true);
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
    ctx.lineWidth = 12;
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

  scaleImage = function(canvas) {
    var scaleCanvas, scaleCtx;
    scaleCanvas = document.createElement('canvas');
    scaleCtx = scaleCanvas.getContext("2d");
    scaleCanvas.width = 30;
    scaleCanvas.height = 30;
    scaleCtx.scale(.2, .2);
    scaleCtx.drawImage(canvas, 0, 0);
    clear(canvas);
    return scaleCanvas;
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

  sendPostData = function(req, img) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/img', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
      var cell, data, pd, row, table, val;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        data = JSON.parse(xhttp.responseText);
        table = document.getElementById('results');
        row = document.createElement('tr');
        cell = document.createElement('td');
        cell.appendChild(img);
        row.appendChild(cell);
        if (data.statusCode === 200) {
          pd = data.body.Results.Number.value.Values[0];
          cell = document.createElement('td');
          val = pd[pd.length - 1];
          cell.innerHTML = val === 10 ? 0 : val;
          row.appendChild(cell);
          cell = document.createElement('td');
          cell.innerHTML = (Math.trunc(pd[val - 1] * 10000) / 100) + "%";
          row.appendChild(cell);
        } else {
          console.log('failed to predict');
          cell = document.createElement('td');
          cell.innerHTML = 'failed to predict';
          row.appendChild(cell);
          cell = document.createElement('td');
          cell.innerHTML = 'N/A';
          row.appendChild(cell);
          row.className = "danger";
        }
        if (table.childNodes.length === 0) {
          return table.appendChild(row);
        } else {
          return table.insertBefore(row, table.childNodes[0]);
        }
      }
    };
    return xhttp.send(JSON.stringify(req));
  };

  sendTrainingData = function(req) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/train', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
      var container, data, ul;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        data = JSON.parse(xhttp.responseText);
        console.log(data.response + " for " + req.num);
        trainingCounts[req.num] += 1;
        container = document.getElementById('trainingResults');
        container.innerHTML = '';
        ul = document.createElement('ul');
        _.forEach(trainingCounts, function(v, k) {
          var li;
          li = document.createElement('li');
          if (k === 10) {
            k = 0;
          }
          li.innerHTML = k + ":" + v;
          return ul.appendChild(li);
        });
        return container.appendChild(ul);
      }
    };
    return xhttp.send(JSON.stringify(req));
  };

  RequestData = function(values) {
    this.Inputs = {
      Number: {
        Values: values
      }
    };
    this.GlobalParameters = {};
    return unit;
  };

  window.addEventListener('load', init, false);

}).call(this);
