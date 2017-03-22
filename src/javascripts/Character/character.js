import _ from 'lodash';
import Point from './point';
import Bezier from './bezier'

const Character = function(id, opts) {
	// DOM id
	this.id = id;
	this.opts = this.mergeOptions(opts);
	// 笔画数组
	this.strokeArray = [];
	// 单笔画的骨架点
	this.points = [];
	// 单笔画的骨架点，控制点和起止点宽度。
	this.curves = [];
	// 单个笔画骨架点的索引
	this.index = 0;
	// 模块元素
	this.el = document.getElementById(id);

	var tpl = '<div class="Character-wrapper"><canvas class="Character-canvas"></canvas></div>';
  tpl = '<div class="Character-controls"></div>' + tpl;
  this.el.innerHTML = tpl;

  this.dom = {
  	canvas: this.el.querySelector(".Character-canvas"),
    canvasWrapper: this.el.querySelector(".Character-wrapper"),
    controls: this.el.querySelector(".Character-controls")
  }
  this.canvas = this.dom.canvas;
  this.context = this.canvas && this.canvas.getContext && this.canvas.getContext('2d') ? this.canvas.getContext('2d') : null;
  this.init();
}

Character.prototype = {
	constructor: Character,

	mergeOptions: function(opts) {
		const newOpts = _.assign({}, Character.defaultOpts, this.opts, opts);
		return newOpts;
	},

	init: function() {
		var self = this;
		var canvas = this.canvas;
		var xml = this.xml;

		this.canvas.width = this.dom.canvasWrapper.clientWidth;
    this.canvas.height = this.dom.canvasWrapper.clientHeight;
    this.initGrid();
    this._reset();

    if (!this.opts.isXML) {
      this.initEvents();
    }
    // 绘制xml文件
    if (this.opts.xmlFile) {
      this.strokeArray.length = 0;
      this.initGrid();
      this.mode = "brush";
      this.parseXML();
      this.changeXY(this.strokeArray, this.opts, 1);
      this.drawAllPoints(this.canvas, this.strokeArray);
    }
    if (xml) {
      xml.addEventListener("change", function() {
        self.strokeArray.length = 0;
        self.initGrid();
        self.mode = "brush";
        self.parseXML(xml.files[0]);
        self.changeXY(self.strokeArray, self.opts, 1);
        self.drawAllPoints(self.canvas, self.strokeArray);
      }, false);
    }
	},

	_reset: function() {
		this.points.length = 0;
		this.curves.length = 0;
		this._lastVelocity = 0;
		this._lastWidth = (this.opts.minWidth + this.opts.maxWidth) /2;
	},

	// 绘制Canvas背景图案
	initGrid: function() {
		var ctx = this.canvas.getContext("2d");
		var ctx = this.canvas.getContext("2d");

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, ctx.canvas.height / 2);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
    ctx.moveTo(ctx.canvas.width / 2, 0);
    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
    ctx.stroke();
    ctx.lineWidth = 0.5;
    ctx.closePath();
    this._drawDottedLine(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, 10);
    this._drawDottedLine(ctx, 0, ctx.canvas.height, ctx.canvas.width, 0, 10);
	},

	_drawDottedLine: function(context, x1, y1, x2, y2, dashLength) {
    dashLength = dashLength === undefined ? 5 : dashLength;
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
    context.beginPath();
    for (var i = 0; i < numDashes; ++i) {
      context[i % 2 === 0 ? 'moveTo' : 'lineTo']
        (x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
    }
    context.closePath();
    context.stroke();
  },

	_createPoint: function(x, y, time, index) {
		return new Point(
			x,
			y,
			time || new Date().getTime(),
			index
		)
	},

	_calculateCurveControlPoints: function(s1, s2, s3) {
		const dx1 = s1.x - s2.x;
	  const dy1 = s1.y - s2.y;
	  const dx2 = s2.x - s3.x;
	  const dy2 = s2.y - s3.y;

	  const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
	  const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

	  const l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
	  const l2 = Math.sqrt((dx2 * dx2) + (dy2 * dy2));

	  const dxm = (m1.x - m2.x);
	  const dym = (m1.y - m2.y);

	  const k = l2 / (l1 + l2);
	  const cm = { x: m2.x + (dxm * k), y: m2.y + (dym * k) };

	  const tx = s2.x - cm.x;
	  const ty = s2.y - cm.y;

	  return {
	    c1: new Point(m1.x + tx, m1.y + ty),
	    c2: new Point(m2.x + tx, m2.y + ty),
	  };
	},

	_addPoint: function(point) {
		this.points.push(point);
	},

	_addCurve: function(lastPointFlag) {
		const points = this.points;
		let controlPoint;
		// 从第三个点还是绘制
		if(points.length > 2) {
			let lastPoints;
			if(points.length == 3) {
				lastPoints = points.slice();
				lastPoints.unshift(lastPoints[0]);
			}else if (lastPointFlag) {
				lastPoints = points.slice(-3);
				lastPoints.push(lastPoints[2]);
			}else {
				lastPoints = points.slice(-4);
			}
			controlPoint = this._calculateCurveControlPoints(
				lastPoints[0], 
				lastPoints[1], 
				lastPoints[2]
			);
			// 该段贝塞尔曲线的第一个控制点
			const c1 = controlPoint.c2;
			controlPoint = this._calculateCurveControlPoints(
				lastPoints[1],
				lastPoints[2],
				lastPoints[3]
			);
			// 该段贝塞尔曲线的第二个控制点
			const c2 = controlPoint.c1;
			// 第一个点和第二个点之间的贝塞尔曲线。
			const curve = new Bezier(lastPoints[1], c1, c2, lastPoints[2]);
			// console.log(curve);
			// TODO
			const widths = this._calculateCurveWidths(curve);
			this.curves.push({curve, widths});
		}
	},

	_addStroke: function() {
		if(this.isDrawing) {
			this.strokeArray.push(this.points.slice());
			this._reset();
		}
		this.isDrawing = false;
		this.index = 0;
	},

	_drawCurve: function(ctx, index, curves) {
		// 第三个点开始绘制第一条贝塞尔曲线
		if(index > 1) {
			const curve = curves[index - 2].curve;
			const widths = curves[index -2].widths;
			const widthDelta = widths.end - widths.start;
			const drawSteps = Math.floor(curve.length());
			console.log(drawSteps)

			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.fillStyle = 'black';
			ctx.lineWidth = 3;
			// ctx.moveTo(curve.startPoint.x, curve.startPoint.y);
			for(let i = 0; i < drawSteps; i++) {
				const t = i / drawSteps;
		    const tt = t * t;
		    const ttt = tt * t;
		    const u = 1 - t;
		    const uu = u * u;
		    const uuu = uu * u;

		    let x = uuu * curve.startPoint.x;
		    x += 3 * uu * t * curve.control1.x;
		    x += 3 * u * tt * curve.control2.x;
		    x += ttt * curve.endPoint.x;

		    let y = uuu * curve.startPoint.y;
		    y += 3 * uu * t * curve.control1.y;
		    y += 3 * u * tt * curve.control2.y;
		    y += ttt * curve.endPoint.y;
		    const width = widths.start + (ttt * widthDelta);
		    ctx.moveTo(x, y);
		    ctx.arc(x, y, width, 0, 2 * Math.PI, false);
			}
			ctx.closePath();
			ctx.fill();
		}
	},

	_pointWidth: function(velocity) {
		return Math.max(this.opts.maxWidth * this._gaussian(velocity), this.opts.minWidth);
	},

	_calculateCurveWidths: function(curve) {
		const startPoint = curve.startPoint;
		const endPoint = curve.endPoint;

		const widths = { start: null, end: null };
		const velocity = (this.opts.velocityFilterWeight * endPoint.velocityFrom(startPoint)) + ((1 - this.opts.velocityFilterWeight) * this._lastVelocity);

		const newWidth = this._pointWidth(velocity);
		
		widths.start = this._lastWidth;
		widths.end = newWidth;

		this._lastVelocity = velocity;
		this._lastWidth = newWidth;
		console.log(widths)
		return widths;
	},

  // 绘制带骨架点的字形骨架
  _drawPoints: function(ctx, index, points) {
		const point = points[index];
  	ctx.beginPath();
  	ctx.strokeStyle = 'gray';
  	ctx.fillStyle = 'gray';
  	ctx.lineWidth = 2;
  	if(index > 0) {
  		const prePoint = points[index - 1];
  		ctx.arc(point.x, point.y, 2, 2 * Math.PI, false);
  		ctx.moveTo(prePoint.x, prePoint.y);
  		ctx.lineTo(point.x, point.y);
  	} else {
  		ctx.arc(point.x, point.y, 2, 2 * Math.PI, false);
  	}

  	ctx.closePath();
  	ctx.stroke();
  	ctx.fill();
  },


  // 绘制直线段
  // _drawCurve: function(ctx, index, points) {
  // 	const point = points[index];
  // 	ctx.beginPath();
  // 	ctx.fillStyle = 'black';
  // 	ctx.moveTo(point.x, point.y);
  // 	ctx.arc(point.x, point.y, 3, 2 * Math.PI, false);
  // 	ctx.closePath();
  // 	ctx.fill();  		
  // },


  addListenerMulti: function(el, s, fn) {
    var evts = s.split(' ');
    for (var i = 0, iLen = evts.length; i < iLen; i++) {
      el.addEventListener(evts[i], fn.bind(this), false);
    }
  },

	initEvents: function() {
		this.addListenerMulti(this.canvas, 'mousedown touchstart', function(e) {
		  this._onInputStart(e, this._getInputCoords(e));
		});
		this.addListenerMulti(this.canvas, 'touchmove mousemove', function(e) {
		  this._onInputMove(e, this._getInputCoords(e));
		});
		this.addListenerMulti(this.canvas, 'mouseout touchend mouseup', function(e) {
		  this._onInputStop(e);
		});
	},

	_getInputCoords: function(e) {
	  var touch = ("createTouch" in document);
	  var UIEvent = touch ? e.touches[0] : e;
	  var x = UIEvent.clientX - this.canvas.getBoundingClientRect().left;
	  var y = UIEvent.clientY - this.canvas.getBoundingClientRect().top;
	  return {
	    x: x,
	    y: y
	  };
	},

	_onInputStart: function(e, coords) {
	  var x = coords.x;
	  var y = coords.y;
	  this.isDrawing = true;
	  var point = this._createPoint(x, y, undefined, this.index);
	  this._addPoint(point);
	  this._addCurve();
	  this._drawCurve(this.context, this.index, this.curves);
	  this._drawPoints(this.context, this.index, this.points);

	  e.stopPropagation();
	  e.preventDefault();
	},

	_onInputMove: function(e, coords) {
	  if (this.isDrawing) {
	    var x = coords.x;
	    var y = coords.y;
	    this.index++;
	    var point = this._createPoint(x, y, undefined, this.index);
	    this._addPoint(point);
	    // 如果是第三个点，则添加第一个点和第二个点的曲线
	    this._addCurve();
	    this._drawCurve(this.context, this.index, this.curves);
	    this._drawPoints(this.context, this.index, this.points);
	    e.stopPropagation();
	    e.preventDefault();
	  }
	},

	_onInputStop: function(e) {
		if (this.isDrawing) {
			// 添加和绘制最后一线段的曲线
			this.index++;
			this._addCurve(1);
	    this._drawCurve(this.context, this.index, this.curves);
		  this._addStroke();
		}
	  e.stopPropagation();
	  e.preventDefault();
	},

	_gaussian: function(v) {
	  return  Math.pow(Math.E, -(v * v) / (2 * this.opts.gaussian * this.opts.gaussian));
	},

	getXML: function(xml) {
	  if (xml.files[0]) {
	    return this.xml.files[0];
	  }
	},

	loadXML: function(xmlFile) {
	  var xmlDoc, url, xmlhttp, xmlString, domParser;
	  if (!this.opts.xmlFile) {
	    url = window.URL.createObjectURL(xmlFile);
	    xmlhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
	    xmlhttp.open("GET", url, false);
	    xmlhttp.onload = function() {
	      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        xmlDoc = xmlhttp.responseXML;
	      }
	    }
	    xmlhttp.send(null);
	    return xmlDoc;
	  } else {
	    xmlhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
	    url = encodeURI("getxml.php?name=" + this.opts.fileName);
	    xmlhttp.open("GET", url, false);

	    xmlhttp.onload = function() {
	      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        xmlString = xmlhttp.responseText;
	      }
	    }
	    xmlhttp.send(null);


	    domParser = new DOMParser();
	    xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
	    return xmlDoc;
	  }

	},

	changeXY: function(strokeArray, opts, charScale, flag) {
	  var charAspectRatio;

	  var minX = strokeArray[0][0].x;
	  var minY = strokeArray[0][0].y;
	  var maxX = strokeArray[0][0].x;
	  var maxY = strokeArray[0][0].y;

	  //Find the global bounding box
	  for (var i = 0; i < strokeArray.length; i++) {
	    for (var j = 0; j < strokeArray[i].length; j++) {
	      if (minX > strokeArray[i][j].x) {
	        minX = strokeArray[i][j].x;
	      }
	      if (minY > strokeArray[i][j].y) {
	        minY = strokeArray[i][j].y;
	      }
	      if (maxX < strokeArray[i][j].x) {
	        maxX = strokeArray[i][j].x;
	      }
	      if (maxY < strokeArray[i][j].y) {
	        maxY = strokeArray[i][j].y;
	      }
	    }
	  }
	  var widthX = maxX - minX;
	  var heightY = maxY - minY;
	  var centerX = (minX + maxX) * 0.5;
	  var centerY = (minY + maxY) * 0.5;
	  // 保存长宽比，不然显示出来的就是1：1

	  var charAspectRatio = widthX / heightY;


	  //字在区域内显示的比例
	  var scale = opts.charRatio;
	  //if the width is larger, make sure it is within range
	  if (charAspectRatio > 1.0) {
	    scale /= charAspectRatio;
	  }

	  var charBoxWidth = opts.charBoxWidth;
	  var charBoxHeight = opts.charBoxWidth * opts.aspectRatio;

	  for (var i = 0; i < strokeArray.length; i++) {
	    for (var j = 0; j < strokeArray[i].length; j++) {
	      //normalize the coordinates into [-0.5,0.5]	
	      strokeArray[i][j].x = (strokeArray[i][j].x - centerX) * scale / widthX;
	      strokeArray[i][j].y = (strokeArray[i][j].y - centerY) * scale / heightY;
	      //map to canvas space
	      // 缩放需要对应字的比例，固定比例为字的原始比例。
	      strokeArray[i][j].x = (strokeArray[i][j].x * charAspectRatio + 0.5) * charBoxWidth + opts.startPosition.x;
	      //字要缩放一样的倍数，然后平移1/2画布高度。
	      strokeArray[i][j].y = strokeArray[i][j].y * charBoxWidth + 0.5 * charBoxHeight + opts.startPosition.y;
	      // arr[i][j].y=(arr[i][j].y+0.5)*charBoxHeight;
	      // 
	      if (!flag) {
	        strokeArray[i][j].w = strokeArray[i][j].w / charScale;
	      } else {
	        strokeArray[i][j].w = strokeArray[i][j].w * charScale;
	      }

	    }
	  }
	},
}

Character.defaultOpts = {
  controls: [
    'Size',
    'DisplayMode',
    'Navigation',
    'Curve'
  ],

  velocityFilterWeight: 1,


  gaussian: 2,
  sigmoid: 0.3,
  flat: 2.0,
  maxWidth: 6,
  minWidth: 2,
  timeScale: 15,

  withGrid: true,
  radius: 5,
  lineWidth: 1.2,
  strokeColors: ['black', 'gray3', 'gray2', 'gray1'],

  isXML: false,
  xmlFilePath: "",
  background: "#fff",

  charRatio: 0.85,
  aspectRatio: 4 / 3,
  startPosition: {
    x: 0,
    y: 0
  },
};

export default Character;