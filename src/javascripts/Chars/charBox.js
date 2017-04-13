var CharBox = function(board, opts) {
  this.board = board;
  this.canvas = board.canvas;
  this.ctx = board.context;
  this.opts = this.mergeOptions(opts);
  this.img;
  this.id;
  this.isDown = false;
  this.isDragging = false;
  this.flag = false;

  this.isHitImage = false;
  this.withAnchor = false;
};

CharBox.prototype = {

  constructor: CharBox,

  mergeOptions: function(opts) {
    opts = _.assign({}, CharBox.defaultOpts, opts);
    return opts;
  },

  init: function(i) {
    this.drawRect(i);
  },

  drawImg: function(img) {
    var imageData = img;
    this.img = new Image();
    this.img.src = imageData;
    this.img.onload = function () {
      var w = this.img.width;
      var h = this.img.height;
      var ctx = this.ctx;
      var lineWidth = 2;

      var charW = this.opts.charBoxWidth;
      var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
      var charStartX = this.opts.startPosX;
      var charStartY = this.opts.startPosY;
      var refX = this.opts.referencePoint.x;
      var refY = this.opts.referencePoint.y;

      ctx.save();
      ctx.translate(refX, refY);
      ctx.translate(charStartX, charStartY);
      ctx.rotate(this.opts.rotation);
      ctx.drawImage(this.img, 0, 0, w, h, -charW / 2, -charH / 2, charW, charH);
      ctx.restore();
    }.bind(this);
  },


  drawRect: function(number) {
    // var w = this.img.width;
    // var h = this.img.height;
    var ctx = this.ctx;
    var lineWidth = 2;

    var charW = this.opts.charBoxWidth;
    var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
    var charStartX = this.opts.startPosX;
    var charStartY = this.opts.startPosY;
    var refX = this.opts.referencePoint.x;
    var refY = this.opts.referencePoint.y;

    ctx.save();
    ctx.translate(refX, refY);
    ctx.translate(charStartX, charStartY);
    ctx.rotate(this.opts.rotation);
    // ctx.rect(-charW/2,-charH/2, charW, charH); 
    ctx.font = '50px serif';
    ctx.strokeText(number + 1, -10, 15);
    ctx.stroke();
    // ctx.drawImage(this.img, 0, 0, w, h, -charW / 2, -charH / 2, charW, charH);
    ctx.restore();

  },

  hitImage: function(x, y) {
    var charW = this.opts.charBoxWidth;
    var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
    var charStartX = this.opts.startPosX + this.opts.referencePoint.x;
    var charStartY = this.opts.startPosY + this.opts.referencePoint.y;

    return (x - charStartX) * (x - charStartX) + (y - charStartY) * (y - charStartY) <= charW / 2 * charW / 2;
  },



  hitAnchor: function(x, y) {
    var charW = this.opts.charBoxWidth;
    var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
    var charStartX = this.opts.startPosX + this.opts.referencePoint.x;
    var charStartY = this.opts.startPosY + this.opts.referencePoint.y;
    var r = this.opts.radius;


    return (x > charStartX + charW / 2 - r &&
      x < charStartX + charW / 2 + r &&
      y > charStartY + charH / 2 - r &&
      y < charStartY + charH / 2 + r
    );
  },


  handleMouseDown: function(e) {
    var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
    var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);

    this.opts.mouseStartX = mouseX;
    this.opts.mouseStartY = mouseY;

    if (this.flag) {
      this.isDragging = this.hitImage(this.opts.mouseStartX, this.opts.mouseStartY);
      this.drawAnchor(false);
      this.isResizing = this.ctx.isPointInPath(mouseX, mouseY);
      this.drawRotationHandle(false);
      this.isDown = this.ctx.isPointInPath(mouseX, mouseY);
    }

    // this.isResizing = this.hitAnchor(this.opts.mouseStartX, this.opts.mouseStartY);

  },

  handleMouseUp: function(e) {
    this.isDown = false;
    this.isDragging = false;
    this.isResizing = false;
    this.board.draw();
  },

  handleMouseOut: function(e) {
    this.isDown = false;
    this.isDragging = false;
    this.isResizing = false;
    this.board.draw();
  },

  // handleDblClick: function(e) {
  // 	var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
  // 	var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
  // 	console.log([mouseX, mouseY]);
  // 	this.dblClickImage(mouseX, mouseY);

  // 	// if(this.isHitImage){
  // 	// 	this.flag = (this.flag === true ? false : true);
  // 	// }

  // 	// console.log(this.isHitImage);
  // 	// console.log(this.flag);

  // },

  handleMouseMove: function(e) {
    var refX = this.opts.referencePoint.x;
    var refY = this.opts.referencePoint.y;


    var startX = this.opts.mouseStartX;
    var startY = this.opts.mouseStartY;

    if (this.isDragging) {
      var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
      var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);

      var dx = mouseX - startX;
      var dy = mouseY - startY;

      this.opts.startPosX += dx;
      this.opts.startPosY += dy;

      this.opts.mouseStartX = mouseX;
      this.opts.mouseStartY = mouseY;

      this.board.draw();
    } else if (this.isDown) {
      // this.flag = false;
      var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
      var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);

      var cx = refX + this.opts.startPosX;
      var cy = refY + this.opts.startPosY;

      var dx = mouseX - cx;
      var dy = mouseY - cy;
      this.opts.rotation = Math.atan2(dy, dx);
      this.board.draw();

    } else if (this.isResizing) {
      var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
      var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
      var deltaX = mouseX - startX;
      var deltaY = mouseY - startY;
      var newDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

      // var newDeltaY = this.opts.charBoxWidth/2 * this.opts.charBoxRatio + deltaY;

      // this.opts.charBoxWidth = Math.sqrt(newDeltaX * newDeltaX + newDeltaY * newDeltaY);

      this.opts.charBoxWidth += newDelta;

      this.opts.mouseStartX = mouseX;
      this.opts.mouseStartY = mouseY;

      this.board.draw();

    }
    this.board.getCharPos();

  },
};
CharBox.defaultOpts = {
  //这里发现了一个参数使用对象的一个弊端，一个对象的更改，会引发另外一个对象的更改。目前还没有想象到如何去解决这个问题。所以先将参数设置为常值。
  // startPos: {
  // 	x: 0,
  // 	y: 0
  // },
  startPosX: 0,
  startPosY: 0,
  rotation: 0,
  charBoxWidth: 100,
  charBoxRatio: 1,

  referencePoint: {
    x: 0,
    y: 0
  },


  lineWidth: 2,
  radius: 5,

  mouseStartX: 0,
  mouseStartY: 0,
  edit: {
    translation: true,
    rotatable: true,
    scalable: true
  }
};

export default CharBox;


