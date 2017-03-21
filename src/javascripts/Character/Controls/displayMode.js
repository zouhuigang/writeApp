Character.Control.DisplayMode = Character.Control.extend({
  name: 'displaymode',

  defaults: {
    brush: true,
    skeleton: true,
    strokeColor: true,
    animation: true,
    uniformWidth: true
  },

  initialize: function() {
    var that = this;
    var tpl = '';
    ["brush", "skeleton", "strokeColor", "animation", "uniformWidth"].forEach(function(element, index, array) {
      if (element) {
        tpl = tpl + '<button class="Character-control-displaymode control-displaymode-' + element + '-button" data-mode="' + element + '">' + element + '</button> ';
      }
    });
    this.el.innerHTML = tpl;
    var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-mode]'), 0);

    buttonArray.forEach(function(e) {
      e.addEventListener("click", function(e) {
        var value = e.currentTarget.getAttribute('data-mode');
        var mode = this.board.getMode();
        if (mode !== value) {
          this.board.setMode(value);
        }
        this.changeButtons(this.board.getMode());
        this.board.initGrid();
        this.board.drawAllPoints(this.board.canvas, this.board.strokeArray);
        e.preventDefault();
      }.bind(this), false);
    }.bind(this));
    this.changeButtons(this.board.getMode());


  },

  changeButtons: function(mode) {
    var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-mode]'), 0);
    buttonArray.forEach(function(element, index, array) {
      if (element) {
        var item = element;
        if (mode === item.getAttribute('data-mode')) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  }
});