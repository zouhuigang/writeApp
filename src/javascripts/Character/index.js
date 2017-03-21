import _ from 'lodash'

const Character = function(id, opts, xml) {
  this.id = id;
  this.opts = this.mergeOptions(opts);
  this.strokeArray = [];
  this.img;
  this.brushes = [];
  this.points = [];
  this.r = 0;
  this.P = 2;
  this.isDrawing = false;
  this.xml = xml;
  this.el = document.getElementById(id);

  this.widthMethod = "gaussianCurve";

  var tpl = '<div class="Character-wrapper"><canvas class="Character-canvas"></canvas></div>';
  tpl = '<div class="Character-controls"></div>' + tpl;
  this.el.innerHTML = tpl;

  this.dom = {
    canvas: this.el.querySelector(".Character-canvas"),
    canvasWrapper: this.el.querySelector(".Character-wrapper"),
    controls: this.el.querySelector(".Character-controls")
  };
  this.preloadImg();
  this.initControls();

  this.mode = "brush";
  this.radio = "blank";
  // this.range = "gaussian";
  this.canvas = this.dom.canvas;

  this.context = this.canvas && this.canvas.getContext && this.canvas.getContext('2d') ? this.canvas.getContext('2d') : null;
  this.init();
  //这个是个动态的， 先这样处理， 有更好的方法再修改
  this.opts.charBoxWidth = this.canvas.width;

};

Character.prototype = {

  constructor: Character,


  mergeOptions: function(opts) {
    opts = _.assign({}, Character.defaultOpts, this.opts, opts);
    return opts;
  },

  changePosOpts: function(opts) {
    this.opts = _.assign({}, opts, {
      startPosition: {
        x: 0,
        y: 0
      },
      charBoxWidth: this.opts.charBoxWidth
    });
  },
  changeStrokeArray: function(strokeArray) {
    this.strokeArray = _.cloneDeep(strokeArray);
  },
  /**
   * 取得一个点得所有参数，以对象的方式存储。
   * @param  {Number} x      笔触的当前位置
   * @param  {Number} y      笔触的当前位置的y坐标
   * @param  {Array} points 当前的笔画数组，不断更新到画完，需要依靠前面的点计算得到
   * @return {Object}        笔触的当前点
   */
  setOnePoint: function(x, y, r, points) {
    var t, v, w, p, a, deltaTime, aa;
    t = Date.now();
    deltaTime = this._setDeltaTime(x, y, t, r, points);
    v = this._setVelocity(x, y, t, r, points);
    a = this._setAcceleration(x, y, t, r, points);
    w = this._setPointWidth(v, a, r, points, deltaTime);
    var point = {
      x: x,
      y: y,
      t: t,
      deltaTime: deltaTime,
      p: undefined,
      v: v,
      a: a,
      w: w
    };
    return point;
  },

  _setPressure: function(r, points) {
    if (r > 1) {
      point = points[r - 1];
      prePoint = points[r - 2];
      d1 = self.distance(point.x, point.y, prePoint.x, prePoint.y);
      sampleNumber = parseInt(d1 * 20);
      if (r == 2) {
        for (var u = 0; u < sampleNumber; u++) {
          var t = u / (sampleNumber - 1);
          var x1 = (1.0 - t) * prePoint.x + t * point.x;
          var y1 = (1.0 - t) * prePoint.y + t * point.y;
          if (lineWidth) {
            w1 = lineWidth;
          } else {
            w1 = (1.0 - t) * prePoint.w + t * point.w;
          }
        }
      }
      if (r > 2) {
        var xFirst = (points[r - 3].x + prePoint.x) * 0.5;
        var yFirst = (points[r - 3].y + prePoint.y) * 0.5;
        if (lineWidth) {
          wFirst = lineWidth;
        } else {
          wFirst = (points[r - 3].w + prePoint.w) * 0.5;
        }

        var xSecond = (point.x + prePoint.x) * 0.5;
        var ySecond = (point.y + prePoint.y) * 0.5;
        if (lineWidth) {
          wSecond = lineWidth;
        } else {
          wSecond = (point.w + prePoint.w) * 0.5;
        }
        //Now we perform a Beizer evaluation 	
        for (var u = 0; u < sampleNumber; u++) {
          var t = u / (sampleNumber - 1);

          var x1 = (1.0 - t) * (1.0 - t) * xFirst + 2 * t * (1 - t) * prePoint.x + t * t * xSecond;
          var y1 = (1.0 - t) * (1.0 - t) * yFirst + 2 * t * (1 - t) * prePoint.y + t * t * ySecond;
          if (lineWidth) {
            w1 = lineWidth;
          } else {
            w1 = (1.0 - t) * (1.0 - t) * wFirst + 2 * t * (1 - t) * prePoint.w + t * t * wSecond;
          }
        }
      }
    }
  },

  _setPointWidth: function(v, a, r, points, deltaTime) {
    var m, v2, w;
    var preWidth = 0,
      width1 = 0,
      width2 = 0;
    // a=this.opts.wmax/this.gaussian(0, this.opts.gaussian);
    // v2 = this.gaussian(v, this.opts.gaussian);
    if (r == 1) {
      return this.opts.wmax;
    } else {
      preWidth = points[r - 2].w;
      if (this.widthMethod === "gaussianCurve") {

        // m = this.opts.wmax/this.gaussian(0, this.opts.gaussian);
        // v2 = this.gaussian(v, this.opts.gaussian);

        var gaussian = this.opts.gaussian * 1;
        // width1 = this.opts.wmax*Math.pow(Math.E, -v*v/(2*gaussian*gaussian));
        width1 = this.opts.wmax * Math.pow(Math.E, -v * v / (2 * gaussian * gaussian));

        // width1 = this.opts.wmax*Math.pow(Math.E, -v*v/(2*gaussian*gaussian))*Math.pow(Math.E, 8*Math.atan(-a)/Math.PI*2);
        // width1 = this.opts.wmax*Math.pow(Math.E, -v*v/(2*gaussian*gaussian))*Math.pow(Math.E, -100*a*a*a);
        // width1 = this.opts.wmax*Math.pow(Math.E, -v*v/(2*gaussian*gaussian));
        // var alpha = .8;
        // w = this.opts.wmax - alpha*(this.opts.wmax-this.opts.wmin)*Math.pow(v, 0.5);
      } else if (this.widthMethod === "flatCurve") {
        var flat = this.opts.flat;
        if (v > 2) {
          v = 2;
        }
        var v = v * Math.PI / 2 / 2;
        width1 = this.opts.wmax * Math.sqrt((1 + flat * flat) / (1 + flat * flat * Math.pow(Math.cos(v), 2))) * Math.cos(v);
      } else if (this.widthMethod === "sigmoidCurve") {
        width1 = this.opts.wmax * 2 / (1 + Math.pow(Math.E, this.opts.sigmoid * v));
      }
      if (width1 < this.opts.wmin) {
        width1 = this.opts.wmin;
      }
      if (width1 > this.opts.wmax) {
        width1 = this.opts.wmax;
      }
      //加权递推平均滤波
      if (r == 2) {
        width1 = 1 / 3 * preWidth + 2 / 3 * width1;
      }

      if (r > 2) {
        width1 = 1 / 7 * points[r - 3].w + 1 / 7 * points[r - 2].w + 5 / 7 * width1;
      }

      // var width2 = preWidth - a * 100;
      // // var width2 = preWidth - (v - points[r-2].v);
      // if(width2 < this.opts.wmin){
      // 	width2 = this.opts.wmin;
      // }
      // if(width2 > this.opts.wmax){
      // 	width2 = this.opts.wmax;
      // }
      // // w = width1;
      // w = (1-b) * width1 + b * width2 ;
      // if(w < this.opts.wmin){
      // 	w = this.opts.wmin;
      // }
      // if(w > this.opts.wmax){
      // 	w = this.opts.wmax;
      // }
      return width1;
      // return w;
      // return (w + points[r-2].w)/2;
    }
  },

  /**
   * 取得当前点得宽度，由当前点得速度得到
   * @param  {Number} v      当前点得速度
   * @param  {Number} r      当前点的索引
   * @param  {Array} points 已绘制笔画的数组
   * @return {Number}        当前点得宽度
   */
  _setPointWidthByA: function(v, a, r, points, deltaTime) {
    var a, v2, w;
    if (r == 1) {
      // return this.opts.wmin/3 + this.opts.wmax/3*2;
      return this.opts.wmax;
    } else {

      w = points[r - 2].w;
      var m = deltaTime;
      var amplitude = a * m;

      // if(amplitude > a || amplitude < -a){
      // 	amplitude = a;
      // }
      w = w - amplitude;

      if (w < this.opts.wmin) {
        w = this.opts.wmin;
      }
      if (w > this.opts.wmax) {
        w = this.opts.wmax;
      }
      return w;
      // return (w + points[r-2].w)/2;
    }
  },

  _setPointWidthByTaylor: function(v, a, aa, aaa, r, points, deltaTime) {
    var a, v2, w, jounce;
    if (r == 1) {
      // return this.opts.wmin/3 + this.opts.wmax/3*2;
      return this.opts.wmax;
    } else {

      w = points[r - 2].w;
      // w =  w - a * deltaTime ;
      // var deltaTime = 30;
      var amplitude = 1 / 2 * aa * deltaTime * deltaTime + 1 / 6 * aaa * deltaTime * deltaTime * deltaTime;
      w = w - amplitude;


      if (w < this.opts.wmin) {
        w = this.opts.wmin;
      }
      if (w > this.opts.wmax) {
        w = this.opts.wmax;
      }
      return w;
    }
  },

  _setAcceleration: function(x, y, t, r, points) {
    var acceleration, v1, v2;
    if (r == 1) {
      return 0;
    } else {
      var prePoint = this.points[r - 2];
      var distance = this.distance(x, y, prePoint.x, prePoint.y);

      v1 = this.points[r - 2].v;
      v2 = this._setVelocity(x, y, t, r, points);
      var deltatime = t - this.points[r - 2].t;
      if (distance < 3) {
        acceleration = 0;
      } else {
        acceleration = (v2 - v1) / deltatime;
      }
      // acceleration = (v2-v1)/deltatime;
      // acceleration = (v2-v1)/deltatime;
      return acceleration;
    }


  },

  // 取得当前点的速度
  _setVelocity: function(x, y, t, r, points) {
    var velocity;
    if (r == 1) {
      return 0;
    } else {
      var prePoint = this.points[r - 2];
      var deltatime = t - this.points[r - 2].t;
      if (deltatime == 0) {
        velocity = prePoint.v;
      } else {
        velocity = this.distance(x, y, prePoint.x, prePoint.y) / deltatime;
      }
      return velocity;
    }
  },

  _setDeltaTime: function(x, y, t, r, points) {
    if (r == 1) {
      return 0;
    } else {
      var deltaTime = t - this.points[r - 2].t;
      return deltaTime;
    }
  },

  // _setPointWidth: function(v, a, aa,aaa, r, points, deltaTime) {
  // 	var w1 = this._setPointWidthByV(v, a, r, points, deltaTime);
  // 	var w2 = this._setPointWidthByA(v, a, r, points, deltaTime);
  // 	var w3 = this._setPointWidthByTaylor(v, a,aa,aaa, r, points, deltaTime)
  // 	var w = this._kalman(r, points, w1, w2);
  // 	return w1;
  // },



  _addPoint: function(point) {
    this.points.push(point);
  },
  _addStroke: function() {
    //slice函数可以拷贝数组
    if (this.isDrawing) {
      this.strokeArray.push(this.points.slice());
      // points.splice(0,points.length);
      this.points.length = 0;
    }

    this.isDrawing = false;
    this.r = 0;
  },

  drawAllPoints: function(canvas, strokeArray) {
    var colorID;
    var ctx = canvas.getContext("2d");
    if (this.mode === "animation") {
      this.drawAnimation();
    } else {

      // var ctx = this.canvas.getContext("2d");

      var i, j;
      for (i = 0; i < strokeArray.length; i++) {
        if (this.mode === "strokeColor") {
          colorID = i % 4;
        } else {
          colorID = 0;
        }

        for (j = 1; j <= strokeArray[i].length; j++) {
          var points = strokeArray[i];
          //这两行代码是改变range后， 相应的参数变化。
          // if(){
          // 	var v = strokeArray[i][j-1].v;
          // 	points[j-1].w = this._setPointWidth(v, j, points);
          // }

          if (this.mode === "skeleton") {
            this._drawStrokeSkeleton(ctx, j, points);
            // this._drawPointCircles(ctx, j, points);
          } else if (this.mode === "uniformWidth") {
            this.draw(ctx, j, points, colorID, 8);
          } else {
            this.draw(ctx, j, points, colorID);
          }

        }
      }
    }
  },

  updateStrokeArray: function() {
    var i, j;
    for (i = 0; i < this.strokeArray.length; i++) {
      for (j = 1; j <= this.strokeArray[i].length; j++) {
        var points = this.strokeArray[i];
        // 这两行代码是改变range后， 相应的参数变化。
        var v = this.strokeArray[i][j - 1].v;
        var a = this.strokeArray[i][j - 1].a;
        var p = this.strokeArray[i][j - 1].p;
        var aa = this.strokeArray[i][j - 1].aa;
        var aaa = this.strokeArray[i][j - 1].aaa;
        var deltaTime = this.strokeArray[i][j - 1].deltaTime;
        points[j - 1].w = this._setPointWidth(v, a, aa, aaa, j, points, deltaTime);
      }
    }
  },

  saveImg: function(radio) {
    var img;
    // var strokeArray = _.cloneDeep(this.strokeArray);
    if (radio === "grid") {
      var img = new Image();
      img = this.canvas.toDataURL("images/png");
      this.img = img;
    }
    // 这种情况还没处理好，做个标签，之后处理
    else if (radio === "blank") {
      // var ctx = this.canvas.getContext("2d");

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawAllPoints(this.canvas, this.strokeArray);
      img = new Image();
      img = this.canvas.toDataURL("images/png");
      this.img = img;
    } else {
      return false;
    }
  },

  preloadImg: function() {
    for (var i = 0; i < this.opts.strokeColors.length; i++) {
      this.brushes[i] = new Image();
      this.brushes[i].src = "images/model-" + this.opts.strokeColors[i] + ".png";
    }
  },

  draw: function(ctx, r, points, colorID, lineWidth) {
    var self = this;
    var d1, sampleNumber;
    var point, prePoint;
    var color;
    var w1, wFirst, wSecond;
    var image;
    var i;
    var tempX, tempY, tempW;
    var c_a = 5;
    var x1, x2, x3, x4,
      y1, y2, y3, y4,
      w1, w2, w3, w4;
    //三次贝塞尔曲线的控制点
    var a1, a2, a3, b1, b2, b3;
    if (!colorID) {
      var colorID = 0;
    }

    image = this.brushes[colorID];

    if (r > 1) {
      point = points[r - 1];
      prePoint = points[r - 2];

      d1 = self.distance(point.x, point.y, prePoint.x, prePoint.y);
      sampleNumber = parseInt(d1 * 50);

      if (r < 3) {
        //too few points to draw
        return;
      }
      //当大于等于三个个点的时候，再绘制。
      //In the old code, when r==4, it draws twice, that is a waste
      x2 = points[r - 3].x;
      x3 = points[r - 2].x;
      x4 = points[r - 1].x;


      y2 = points[r - 3].y;
      y3 = points[r - 2].y;
      y4 = points[r - 1].y;


      v2 = points[r - 3].v;
      v3 = points[r - 2].v;
      v4 = points[r - 1].v;
      // w1 = points[r-4].w;
      // w2 = points[r-3].w;
      // w3 = points[r-2].w;
      // w4 = points[r-1].w;

      var controlAcc2 = Math.pow(Math.E, -c_a * points[r - 3].a);
      var controlAcc3 = Math.pow(Math.E, -c_a * points[r - 2].a);
      var controlAcc4 = Math.pow(Math.E, -c_a * points[r - 1].a);
      if (controlAcc2 > 1.2) {
        controlAcc2 = 1.2;
      }
      if (controlAcc2 < 0.8) {
        controlAcc2 = 0.8;
      }
      if (controlAcc3 > 1.2) {
        controlAcc3 = 1.2;
      }
      if (controlAcc3 < 0.8) {
        controlAcc3 = 0.8;
      }
      if (controlAcc4 > 1.2) {
        controlAcc4 = 1.2;
      }
      if (controlAcc4 < 0.8) {
        controlAcc4 = 0.8;
      }
        // w2 = this.opts.wmax*Math.pow(Math.E, -v2*v2/(2*this.opts.gaussian*this.opts.gaussian))*controlAcc2;
        // w3 = this.opts.wmax*Math.pow(Math.E, -v3*v3/(2*this.opts.gaussian*this.opts.gaussian))*controlAcc3;
        // w4 = this.opts.wmax*Math.pow(Math.E, -v4*v4/(2*this.opts.gaussian*this.opts.gaussian))*controlAcc4;

      //    w2 = this.opts.wmax * 2 / (1 + Math.pow(Math.E, this.opts.sigmoid * v2))*controlAcc2;
      //    w3 = this.opts.wmax * 2 / (1 + Math.pow(Math.E, this.opts.sigmoid * v3))*controlAcc3;
      //    w4 = this.opts.wmax * 2 / (1 + Math.pow(Math.E, this.opts.sigmoid * v4))*controlAcc4;
      if (v2 > 8) {
        v2 = 8;
      }
      if (v3 > 8) {
        v3 = 8;
      }
      if (v4 > 8) {
        v4 = 8;
      }
      var v1;
      var v2 = v2 / 48 * Math.PI;
      var v3 = v3 / 48 * Math.PI;
      var v4 = v4 / 48 * Math.PI;
      var flat = this.opts.flat;
      w2 = this.opts.wmax * Math.cos(flat * v2) * controlAcc2;
      w3 = this.opts.wmax * Math.cos(flat * v3) * controlAcc3;
      w4 = this.opts.wmax * Math.cos(flat * v4) * controlAcc4;

      var dis23 = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2));
      var dis34 = Math.sqrt((x4 - x3) * (x4 - x3) + (y4 - y3) * (y4 - y3));
      var dis24 = Math.sqrt((x4 - x2) * (x4 - x2) + (y4 - y2) * (y4 - y2));


      if (r == 3) {
        var disAvg = dis23 / (3.0 * dis24);
        b2 = {
          x: x3 - disAvg * (x4 - x2),
          y: y3 - disAvg * (y4 - y2),
          v: v3 - (v4 - v2) / 6,
          w: w3 - (w4 - w2) / 6
        }
        a2 = {
          x: b2.x - (x3 - x2) / 3,
          y: b2.y - (y3 - y2) / 3,
          v: b2.v - (v3 - v2) / 3,
          w: b2.w - (w3 - w2) / 3
        }
      } else {
        x1 = points[r - 4].x;
        y1 = points[r - 4].y;
        v1 = points[r - 4].v;
        w1 = this.opts.wmax * Math.pow(Math.E, -v1 * v1 / (2 * this.opts.gaussian * this.opts.gaussian));
        // w1 = this.opts.wmax * 2 / (1 + Math.pow(Math.E, this.opts.sigmoid * v4));       
        var dis13 = Math.sqrt((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1));
        var dis12 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var disAvg = dis23 / (3.0 * dis13);
        //每次都绘制第二条线段
        //Note that the v is acutally an independent dimension
        // so the cubic Bezier here is one dimensonal. that is why times 1/6
        var factor = 1 / 6;
        a2 = {
          x: x2 + disAvg * (x3 - x1),
          y: y2 + disAvg * (y3 - y1),
          w: w2 + (w3 - w1) * factor,
          v: v2 + (v3 - v1) * factor
        }
        disAvg = dis34 / (3.0 * dis24);
        b2 = {
            x: x3 - disAvg * (x4 - x2),
            y: y3 - disAvg * (y4 - y2),
            w: w3 - (w4 - w2) * factor,
            v: v3 - (v4 - v2) * factor
          }
          //Here comes the tricky part, to make sure the central control segment parallel to the xy2-xy3

        var perpA = ((x3 - x1) * (x3 - x2) + (y3 - y1) * (y3 - y2)) / (dis23 * dis13); //cosine of the angle
        var perpB = ((x2 - x4) * (x2 - x3) + (y2 - y4) * (y2 - y3)) / (dis23 * dis24);
        if (perpA > perpB) {

          //sine value                      
          perpA = (dis23 / 3) * Math.sqrt(1 - perpA * perpA);
          perpA = perpA / Math.sqrt(1 - perpB * perpB);
          b2.x = x3 - perpA * (x4 - x2) / dis24;
          b2.y = y3 - perpA * (y4 - y2) / dis24;
        } else {
          //sine value                      
          perpB = (dis23 / 3) * Math.sqrt(1 - perpB * perpB);
          perpB = perpB / Math.sqrt(1 - perpA * perpA);
          a2.x = x2 + perpA * (x3 - x1) / dis13;
          a2.y = y2 + perpA * (y3 - y1) / dis13;

        }

      }


      for (var u = 0; u < sampleNumber; u++) {
        var t = u / (sampleNumber - 1);
        tempX = (1 - t) * (1 - t) * (1 - t) * x2 +
          t * (1 - t) * (1 - t) * 3 * a2.x +
          t * t * (1 - t) * 3 * b2.x +
          t * t * t * x3;
        tempY = (1 - t) * (1 - t) * (1 - t) * y2 +
          t * (1 - t) * (1 - t) * 3 * a2.y +
          t * t * (1 - t) * 3 * b2.y +
          t * t * t * y3;
        tempW = (1 - t) * (1 - t) * (1 - t) * w2 +
          t * (1 - t) * (1 - t) * 3 * a2.w +
          t * t * (1 - t) * 3 * b2.w +
          t * t * t * w3;
        // tempV = (1-t)*(1-t)*(1-t)*v2
        // 				+t*(1-t)*(1-t)*3*a2.v
        //   					+t*t*(1-t)*3*b2.v
        // 				+t*t*t*v3;
        // tempW = this.opts.wmax*Math.pow(Math.E, -tempV*tempV/(2*this.opts.gaussian*this.opts.gaussian));

        if (tempW < this.opts.wmin) {
          tempW = this.opts.wmin
        }
        if (tempW > this.opts.wmax) {
          tempW = this.opts.wmax
        }
        ctx.drawImage(image, tempX - tempW, tempY - tempW, 2 * tempW, 2 * tempW);
      }

      if (r == points.length) {
        //绘制最后一条线段
        //如果是最后一个线段，则x5=x4,y5=y4

        //Draw the segment between xy3 and xy4, this helps the sharp ending !!!

        var disAvg = dis34 / (3.0 * dis24);

        a3 = {
          x: x3 + (x4 - x2) * disAvg,
          y: y3 + (y4 - y2) * disAvg,
          w: w3 + (w4 - w3) / 3,
          v: v3 + (v4 - v3) / 3
        };
        b3 = {
          x: a3.x + (x4 - x3) / 3,
          y: a3.y + (y4 - y3) / 3,
          v: a3.v + (v4 - v3) / 3,
          w: a3.w + (w4 - w3) / 3
        }
        for (var u = 0; u < sampleNumber; u++) {
          var t = u / (sampleNumber - 1);
          tempX = (1 - t) * (1 - t) * (1 - t) * x3 +
            t * (1 - t) * (1 - t) * 3 * a3.x +
            t * t * (1 - t) * 3 * b3.x +
            t * t * t * x4;
          tempY = (1 - t) * (1 - t) * (1 - t) * y3 +
            t * (1 - t) * (1 - t) * 3 * a3.y +
            t * t * (1 - t) * 3 * b3.y +
            t * t * t * y4;
          tempW = (1 - t) * (1 - t) * (1 - t) * w3 +
            t * (1 - t) * (1 - t) * 3 * a3.w +
            t * t * (1 - t) * 3 * b3.w +
            t * t * t * w4;
          //	tempV = (1-t)*(1-t)*(1-t)*v3
          //					+t*(1-t)*(1-t)*3*a3.v
          //					+t*t*(1-t)*3*b3.v
          //					+t*t*t*v4;
          //	tempW = this.opts.wmax*Math.pow(Math.E, -tempV*tempV/(2*this.opts.gaussian*this.opts.gaussian));
          if (tempW < this.opts.wmin) {
            tempW = this.opts.wmin
          }
          if (tempW > this.opts.wmax) {
            tempW = this.opts.wmax
          }
          ctx.drawImage(image, tempX - tempW, tempY - tempW, 2 * tempW, 2 * tempW);
        }
      }
    }

  },

  _drawStrokeSkeleton: function(ctx, r, points, color) {
    // var x = parseInt(points[r-1].x);
    var x = points[r - 1].x;
    // var y = parseInt(points[r-1].y);
    var y = points[r - 1].y;
    //每个点绘制前都需要beginPath和moveTo, 否则笔画的字不会直。
    if (r == 1) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (r !== points.length && r >= 2) {
      ctx.beginPath();
      ctx.moveTo(points[r - 2].x, points[r - 2].y);
      ctx.lineTo(x, y);
    } else {
      ctx.beginPath();
      ctx.moveTo(points[r - 2].x, points[r - 2].y);
      ctx.lineTo(x, y);
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  },
  _drawPointCircles: function(ctx, r, points) {
    ctx.beginPath();
    ctx.arc(points[r - 1].x, points[r - 1].y, this.opts.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  },
  _drawClickedPoint: function() {
    ctx.beginPath();
    for (var m = 0; m < strokeArrayXML.length; m++) {
      for (var n = 0; n < strokeArrayXML[m].length; n++) {
        if (m != i && n != j) {
          ctx.arc(strokeArrayXML[m][n].x, strokeArrayXML[m][n].y, RADIUS, 0, 2 * Math.PI, false);

        }

      }
    }
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(strokeArrayXML[i][j].x, strokeArrayXML[i][j].y, RADIUS, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  },

  drawAnimation: function() {
    var ctx = this.canvas.getContext("2d");
    var self = this;
    if (this.strokeArray.length != 0) {

      var intervalID;
      var i = 0;
      var j = 1;
      var points = this.strokeArray[i];
      intervalID = setInterval(
        function() {
          self.draw(ctx, j, points);
          //其实可以单独写一个update参数的，但是因为不清楚函数间传参的规律，待完成。
          if (j < self.strokeArray[i].length) {
            j++;
          } else {
            i++;
            j = 1;
          }
          points = self.strokeArray[i];
          if (i === self.strokeArray.length) {
            clearInterval(intervalID);
          }

        },
        33
      );
    }
  },


  distance: function(x1, y1, x2, y2) {
    return (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
  },

  getRangeValue: function(ele) {
    // var input = ele.getElementsByClassName("scale-range")[0];
    return parseFloat(ele.value);
  },

  parseXML: function(xmlFile) {
    var i, j;
    var xmlDoc = this.loadXML(xmlFile);

    var stroke = xmlDoc.getElementsByTagName("Stroke");
    for (i = 0; i < stroke.length; i++) {
      var points = [];
      for (j = 0; j < stroke[i].childNodes.length; j++) {
        var t, point = {};
        var x = Number(stroke[i].childNodes[j].getAttribute("x"));
        var y = Number(stroke[i].childNodes[j].getAttribute("y"));
        var p = Number(stroke[i].childNodes[j].getAttribute("pressure"));
        if (j == 0) {
          t = 0.0;
        } else {
          t = (this.points[j - 1].t + Number(stroke[i].childNodes[j].getAttribute("deltaTime")) / this.opts.timeScale);
        }

        //这里根据时间计算得到速度
        var deltaTime = this._setDeltaTime(x, y, t, j + 1, this.points);
        var v = this._setVelocity(x, y, t, j + 1, this.points);
        var a = this._setAcceleration(x, y, t, j + 1, this.points);
        
        // var w = this._setPointWidth(v, a,aa,aaa, j+1, this.points, deltaTime);

        point = {
            x: x,
            y: y,
            p: p,
            deltaTime: deltaTime,
            t: t,
            v: v,
            a: a,
            aa: aa,
            aaa: aaa,
            // w : w,
          }
          // if(j>0){
          // 	var prePoint = this.points[j-1];
          // 	var distance = this.distance(x, y, prePoint.x, prePoint.y);
          // }

        this.points.push(point);
      }
      this.strokeArray.push(this.points.slice());
      this.points.length = 0;

    }
    this.points.length = 0;
  },
  


};



export default Character;