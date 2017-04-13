import getFoldingFanPos from './template/folding_fan'
import getPoetryPos from './template/poetry'
import CharBox from './charBox'

var Chars = function(id, opts) {
  this.opts = this.mergeOptions(opts);
  this.charArray = [];
  this.charsBox = [];
  this.charNum = -1; //指向当前操作的字
  this.charPointer = -1;
  this.el = document.getElementById(id);

  var tpl = '<div class="chars-wrapper"><canvas class="chars-canvas"></canvas></div>';
  tpl = '<div class="chars-controls"></div>' + tpl;
  this.el.innerHTML = tpl;
  this.charPos = [];
  this.dom = {
    canvas: this.el.querySelector(".chars-canvas"),
    canvasWrapper: this.el.querySelector(".chars-wrapper"),
    controls: this.el.querySelector(".chars-controls")
  };
  this.canvas = this.dom.canvas;
  this.initControls();
  this.context = this.canvas && this.canvas.getContext && this.canvas.getContext('2d') ? this.canvas.getContext('2d') : null;

  this.init();
  this.opts.viewportWidth = this.canvas.width;
};

Chars.prototype = {
  constructor: Chars,

  mergeOptions: function(opts) {
    opts = _.assign({}, Chars.defaultOpts, this.opts, opts);
    return opts;
  },

  addChar: function(strokeArray, img, opts) {
    if (strokeArray.length) {
      this.charArray[this.charPointer] = {
        strokeArray: _.cloneDeep(strokeArray),
        img: img,
        opts: _.cloneDeep(opts)
      };
    }
  },

  initCharBoxes: function() {
    var self = this;
    var charPos = (function(){
      return {
        folding_fan: getFoldingFanPos(),
        poetry: getPoetryPos()
      }
    }())[this.opts.template[this.opts.templateIndex]]
    for (var i = 0; i <= charPos.length - 1; i++) {
      var box = new CharBox(self, charPos[i]);
      self.charsBox.push(box);
      self.charNum++;
      box.init(i);
    }
  },

  addCharBox: function() {
    var box = new CharBox(this);
    this.charsBox.push(box);
    this.charNum++;
    box.id = this.charNum;
  },



  getCharPos: function() {
    // var charPos = [

    // ];
    // 一个简单的问题想那么复杂，编程经验真是太少了！
    this.charPos.length = 0;
    var pos;
    for (var i = 0; i < this.charsBox.length; i++) {
      pos = {
        x: this.charsBox[i].opts.startPosX,
        y: this.charsBox[i].opts.startPosY,
        r: this.charsBox[i].opts.rotation,
        w: this.charsBox[i].opts.charBoxWidth,
      }
      this.charPos.push(pos);
    }
    var charPos = this.charPos;
    return charPos;
  },
  mergeCharOptions: function(opts, charOpts) {
    var opts = _.assign({}, opts, charOpts);
    return opts;
  },

  clearChar: function() {

    var charsBox = this.charsBox;
    var charArray = this.charArray;
    for (var i = 0; i < charsBox.length; i++) {
      if (charsBox[i].flag === true) {
        charsBox.splice(i, 1);
        charArray.splice(i, 1);
        this.charNum--;

      }
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < charsBox.length; i++) {
      // charsBox[i].drawRotationHandle(true);
      charsBox[i].drawRect(i);
      // charsBox[i].drawAnchor(true);
    }
  },

  updateChar: function(strokeArray, img, opts) {
    var charsBox = this.charsBox;
    var charArray = this.charArray;
    var removedCharBox;
    var removedCharArray;
    var isflag = 0;
    for (var i = 0; i < charsBox.length; i++) {
      if (charsBox[i].flag === true) {
        removedCharBox = charsBox.splice(i, 1);
        removedChar = charArray.splice(i, 1);
        isflag = 1;
        charsBox.push(removedCharBox[0]);
        // charArray.push(removedChar);
      }
    }
    if (!isflag) {
      alert("have no charBox selected!");
      return;
    }

    this.charArray[this.charNum] = {
      strokeArray: _.cloneDeep(strokeArray),
      img: img,
      opts: opts
    };
    this.charPos = this.getCharPos();
    console.log(this.charPos);

  },

  init: function() {
    var self = this;
    var canvas = this.canvas;
    canvas.width = this.dom.canvasWrapper.clientWidth;
    // canvas.height = this.dom.canvasWrapper.clientHeight;
    canvas.height = this.dom.canvasWrapper.clientWidth;
    var context = this.canvas.getContext('2d');
    // canvas.style.background = this.opts.background;
    canvas.style.backgroundImage = "url(" + this.opts.backgroundImage + ")";
    canvas.style.backgroundRepeat = "no-repeat";
    canvas.style.backgroundSize = "contain";

    this.initCharBoxes();
    this.initEvent();

  },

  initEvent: function() {
    this.canvas.addEventListener('click', function(e) {
      this.handleClick(e);
    }.bind(this), false);
  },

  handleClick: function(e) {
    var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
    var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
    this.clickImage(mouseX, mouseY);
  },

  draw: function() {
    var charsBox = this.charsBox;
    var charArray = this.charArray;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < charsBox.length; i++) {
      if(charArray[i]) {
        charsBox[i].drawImg(charArray[i].img);
      }else {
        charsBox[i].drawRect(i);
      }

    }
  },

  clickImage: function(x, y) {
    var charsBox = this.charsBox;
    for (var i = charsBox.length - 1; i >= 0; i--) {
      var charW = charsBox[i].opts.charBoxWidth;
      var charH = charsBox[i].opts.charBoxWidth * charsBox[i].opts.charBoxRatio;
      var charStartX = charsBox[i].opts.startPosX + charsBox[i].opts.referencePoint.x;
      var charStartY = charsBox[i].opts.startPosY + charsBox[i].opts.referencePoint.y;
      var index;
      if (((x - charStartX) * (x - charStartX) + (y - charStartY) * (y - charStartY) <= charW / 2 * charW / 2)) {
        console.log("you click:", i);
        this.charPointer = i;
      }
      // this.draw();

    }
  },

  initControls: function() {
    this.controls = {};
    if (!this.opts.controls.length || !Chars.Control)
      return false;
    for (var i = 0; i < this.opts.controls.length; i++) {
      var c = null;
      if (typeof this.opts.controls[i] == "string") {
        c = new Chars['Control'][this.opts.controls[i]](this);
      } else if (typeof this.opts.controls[i] == "object") {
        for (var controlName in this.opts.controls[i]) break;
        c = new Chars['Control'][controlName](this, this.opts.controls[i][controlName]);
      }
      if (c) {
        this.dom.controls.appendChild(c.el);
        if (!this.controls) {
          this.controls = [];
        }
        this.controls[this.opts.controls[i]] = c;
      }
    }

  },

  addControl: function(control) {
    this.dom.controls.appendChild(control.el);
    if (!this.controls)
      this.controls = {};
    this.controls.push(control);
  }
};

Chars.defaultOpts = {
  controls: [
    'Edit'
  ], //这个参数可以先留着，用于展示工具栏。

  background: "#ccc",
  backgroundImage: "images/shanzi1.png",

  template: ['poetry', 'folding_fan'],
  templateIndex: 1,
};




Chars.Control = function(board, opts) {
  this.board = board;
  this.opts = _.extend({}, this.defaults, opts);
  this.el = document.createElement('div');
  this.el.classList.add('chars-control');
  if (this.name) {
    this.el.classList.add('chars-control-' + this.name);
  }
  this.initialize.apply(this, arguments);
};

Chars.Control.prototype = {
  name: '',

  defaults: {},

  initialize: function() {

  }

};

Chars.Control.extend = function(protoProps, staticProps) {
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

Chars.Control.Edit = Chars.Control.extend({
  name: 'edit',

  defaults: {
    add: true,
    clear: true,
    save: false,
    delete: false
  },

  initialize: function() {
    // var tpl = '';
    // tpl = tpl + '<button class="control-edit-clear" data-edit="edit">clear</button>'
    // this.el.innerHTML = tpl;

    // var div = document.createElement('div');
    // var tplClear = '';
    // var tplAdd = '';

    // if (this.opts.clear) {
    //   tplClear = tplClear + '<button class="control-edit-clear" data-edit="edit">delete</button>';
    //   div.innerHTML = tplClear;
    //   this.el.appendChild(div.firstChild);
    // }
    // if (this.opts.add) {
    //   tplAdd = tplAdd + '<button class="control-edit-add" data-edit="add">addBox</button>';
    //   div.innerHTML = tplAdd;
    //   // this.el.appendChild(div.firstChild);
    // }

    // var buttonClear = this.el.querySelector('.control-edit-clear');
    // buttonClear.addEventListener("click", function(e) {
    //   this.board.clearChar();
    // }.bind(this), false);

  }
});

export default Chars;