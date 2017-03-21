

Character.Control = function(drawingBoard, opts) {
  this.board = drawingBoard;
  this.opts = _.extend({}, this.defaults, opts);
  this.el = document.createElement('div');
  this.el.classList.add('Character-control');
  if (this.name) {
    this.el.classList.add('Character-control-' + this.name + 's');
  }
  this.initialize.apply(this, arguments);
  // return this;
};

Character.Control.prototype = {
  name: '',

  defaults: {},

  initialize: function() {

  },

  addToBoard: function() {
    this.board.addControl(this);
  },

  onBoardReset: function(opts) {

  }
};

Character.Control.extend = function(protoProps, staticProps) {
  var parent = this;
  var child;
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() {
      return parent.apply(this, arguments);
    };
  }
  _.extend(child, parent, staticProps);

  child.prototype = _.create(parent.prototype, protoProps);
  child.prototype.constructor = child;

  child.__super__ = parent.prototype;
  return child;

};
