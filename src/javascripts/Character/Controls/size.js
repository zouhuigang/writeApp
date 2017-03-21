Character.Control.Size = Character.Control.extend({
  name: 'size',

  defaults: {
    type: "auto",
    // gaussian: {
    // 	dropdownValue: [0.1, .4, .7, .8, 1, 2, 3],
    // 	min: 0.1,
    // 	max: 3,
    // 	step: 0.1,
    // 	size: 1.3
    // },
    wmax: {
      dropdownValue: [4, 5, 7, 8, 10, 20],
      min: 4,
      max: 20,
      step: 1,
      size: 13
    },
    wmin: {
      dropdownValue: [.5, 1, 3, 4],
      min: 0.5,
      max: 5,
      step: .1,
      size: 2
    },
    timeScale: {
      dropdownValue: [5, 10, 15, 20, 25],
      min: 5,
      max: 25,
      step: 1,
      size: 15
    }
  },

  types: ['dropdown', 'range'],



  initialize: function() {
    this.updateView();

    if (this.opts.type == 'range' || this.opts.type == 'auto') {
      this._rangeTemplate();
    }

    // if(this.opts.gaussian.type == 'dropdown') {
    // 	this._dropdownTemplet();
    // }
    var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('.Character-control-size input'), 0);
    buttonArray.forEach(function(element) {
      element.addEventListener("change", function(e) {
        var range = e.currentTarget.getAttribute('data-range');
        this.board.opts[range] = this.board.getRangeValue(e.currentTarget);
        this.board.updateStrokeArray();
        this.board.initGrid();
        this.board.drawAllPoints(this.board.canvas, this.board.strokeArray);
      }.bind(this), false);
    }.bind(this));

  },
  _rangeTemplate: function() {

    var tpl = '';
    var that = this;
    ["wmax", "wmin", "timeScale"].forEach(function(element, index, array) {
      if (element) {
        tpl = tpl + '<div class="Character-control-size Character-control-size-' + element + '" >' +
          '<div class="Character-control-inner" title="' + that.opts[element].size + '">' +
          '<span>' + element + '</span>' +
          '<input type="range" min="' + that.opts[element].min + '" max="' + that.opts[element].max + '" value="' + that.opts[element].size +
          '" step="' + that.opts[element].step + '" class="Character-control-size-range-input" data-range="' + element + '">' +
          '<span class="Character-control-size-range-current"></span>' +
          '</div></div>'
      }
    });
    this.el.innerHTML = tpl;
  },
  //这个方法暂时闲置吧~  以后需要扩展再用
  _dropdownTemplet: function() {
    var tpl = '';
    var that = this;
    ["gaussian", "wmax", "wmin", "timeScale"].forEach(function(element, index, array) {
      if (element) {
        tpl = tpl + '<div class="Character-control-size-' + element + '">' +
          '<div class="Character-control-inner" title="' + that.opts[element].size + '">' +
          '<input type="dropdown" min="' + that.opts[element].min + '" max="' + that.opts[element].max + '" value="' + that.opts[element].size +
          '" step="' + that.opts[element].step + '" class="Character-control-size-dropdown-input">' +
          '<span class="Character-control-size-dropdown-current"></span>' +
          '</div></div>'
      }
    });
    this.el.innerHTML = tpl;
  },
  onBoradReset: function(opts) {
    this.updateView();
  },
  updateView: function() {
  },

});