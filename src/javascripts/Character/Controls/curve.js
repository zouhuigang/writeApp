

Character.Control.Curve = Character.Control.extend({
  name: 'Curve',

  defaults: {
    // expCurve: true,
    gaussianCurve: true,
    flatCurve: true,
    sigmoidCurve: true,
    // sinCosCurve : true

  },

  initialize: function() {
    var divRange = document.createElement('div');
    var newRange = document.createElement('div');
    divRange.className = 'character-control-curev-ranges';
    var that = this;
    var tpl = '<select name="curve-select" id="curve-select">';

    var arr = [];
    for (var key in this.opts) {
      if (this.opts.hasOwnProperty(key) && this.opts[key]) {
        arr.push(key)
      }
    }


    arr.forEach(function(element, index) {
      tpl = tpl + '<option value="' + element + '" data-mode="' + element + '">' + that.capitalizeFirstLetter(element) + '  </option>'
    });

    tpl = tpl + '</select>';

    // tpl = tpl + '<input type="range" min="0.1" max="3" value="1.3" step="0.1" class="character-control-curve-range-input" data-range="gaussian" />'
    // tpl = '<select></select>'
    this.el.innerHTML = tpl;
    this.el.appendChild(divRange);
    divRange.innerHTML = 'gaussian<input type="range" min="0.1" max="5" value="1.3" step="0.1" class="character-control-curve-range-input" data-range="gaussian" />';


    var curveSelect = this.el.querySelector('#curve-select');
    curveSelect.addEventListener('change', function(e) {
      var option = this.options[this.selectedIndex];
      var value = option.value;

      if (value === "sigmoidCurve") {
        divRange.innerHTML = 'sigmoidCurve<input type="range" min="0.4" max="1.5" value=".6" step="0.1" class="character-control-curve-range-input" data-range="sigmoid" />';
        that.board.widthMethod = "sigmoidCurve";
        that.board.updateStrokeArray();
        that.board.initGrid();
        that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
        e.preventDefault();
      } else if (value === "flatCurve") {
        divRange.innerHTML = 'flatCurve<input type="range" min="0.4" max="3" value="1.0" step="0.1" class="character-control-curve-range-input" data-range="flat" />';
        that.board.widthMethod = "flatCurve";
        that.board.updateStrokeArray();
        that.board.initGrid();
        that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
        e.preventDefault();
      } else if (value === "gaussianCurve") {
        divRange.innerHTML = 'gaussian<input type="range" min="0.1" max="5" value="1.3" step="0.1" class="character-control-curve-range-input" data-range="gaussian" />';

        that.board.widthMethod = "gaussianCurve";
        that.board.updateStrokeArray();
        that.board.initGrid();
        that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
        e.preventDefault();
      }
      // if (e.target) {}
    }, false);

    divRange.addEventListener('change', function(e) {
      var range = e.target.getAttribute('data-range');
      if (range === "gaussian") {
        that.board.opts[range] = parseFloat(e.target.value);
        that.board.updateStrokeArray();
        that.board.initGrid();
        that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
      } else if (range === "flat") {

        that.board.opts[range] = parseFloat(e.target.value);
        that.board.updateStrokeArray();
        that.board.initGrid();
        that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
      } else if (range === "sigmoid") {
        that.board.opts[range] = parseFloat(e.target.value);
        that.board.updateStrokeArray();
        that.board.initGrid();
        that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
      }
    }, false);
  },




  changeCurve: function() {
    var curveTpl = '';
  },

  capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

});