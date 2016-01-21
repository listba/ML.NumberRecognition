(function() {
  var draw, unit;

  unit = 1;

  draw = function() {
    var canvas, ctx;
    canvas = document.getElementById('NumberCanvas');
    ctx = canvas.getContext('2d');
    return canvas.addEventListener("mousedown", function(e) {
      var mouseX, mouseY, paint;
      mouseX = e.pageX - this.offsetLeft;
      mouseY = e.pageY - this.offsetTop;
      paint = true;
      return unit;
    });
  };

}).call(this);
