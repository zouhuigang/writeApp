# Spline Interpolation 样条插值

为了让一系列点变为平滑的笔画，需要重构这些骨架点之间的简单线段。三阶贝塞尔曲线是曲线插值的理想选择。贝塞尔曲线的控制点可以精确的控制曲线的形状。


# 贝塞尔曲线

贝塞尔曲线是由法国工程师皮埃尔·贝塞尔推广的，并给出了详细的计算公式，当初主要用来进行汽车的主题设计的。现在被各种做图软件以及动画效果广泛应用，如我经常使用的绘图软件Sketch、Html5的Canvas以及CSS的Animation效果都有Bezier曲线的身影。

特征：第一个控制点与第二个控制点的连线恰好是第一个控制点处的切线，而最后一个控制点和倒数第二个控制点的连线恰好是最后一个控制点处的切线。


## 曲线在骨架点的连续性
C0连续是指两端曲线在该点相连，C1连续说明两个相邻的曲线段方程在该点处有相同的一阶导数。G1连续要求稍微松一些，要求两个相邻的曲线段在该点处的导数方向相同，大小不必相等，即视觉上的平滑连续。

# 过滤
Lowpass Fiter 低筒滤波器
容许低频信号通过，但减弱频率高于截止频率的信号通过，可以用在平滑数据的数字算法上。

```
  velocity =  VELOCITY_FILTER_WEIGHT * velocity
    + (1 - VELOCITY_FILTER_WEIGHT) * lastVelocity
```

# 编程思路
核心部分的算法思路。

## 三阶贝塞尔曲线控制点计算
都是使用G1连续确定控制点的位置的。P0,P1,P2,P3四个点即可定义平面上的三阶贝塞尔曲线，其中P0,P3是起止点，P1,P2是控制点。

1. 第一种方法，使用刘老师提出来的方法
2. 第二种方法，使用UCLA的课程《The Mathematics of Computer Graphics》理论

```javascript
  // 使用三个轨迹点确定中间点的控制点
  _calculateCurveControlPoint = function(s1, s2, s3) {
    const dx1 = s1.x - s2.x;
    const dy1 = s1.y - s2.y;
    const dx2 = s2.y - s3.y;
    const dy2 = s2.y - s3.y;
    //第一条线段的中点
    const m1 = {
      x: (s1.x + s2.x) / 2,
      y: (s1.y + s2.y) / 2
    }
    //第二条线段的中点
    const m2 = {
      x: (s2.x + s3.x) /2,
      y: (s2.y + s3.y) /2
    }
    //第一条线段的长度
    const l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
    //第二条线段的长度
    const l2 = Math.sqrt((dx2 * dx2) + (dy2 * dy2));

    //两条线段的中点连接的中线向量
    const dxm = (m1.x - m2.x);
    const dym = (m1.y - m2.y);
    
    //两条线段的比例
    const k = l2 /(l1 / l2);
    //中线的等比例点
    const cm = {
      x: m2.x + (dxm * k),
      y: m2.y + (dxm * k)
    }
    //平移向量
    const tx = s2.x - cm.x;
    const ty = s2.y - cm.y;
    //返回控制点
    return {
      c1: new Point(m1.x + tx, m1.y + ty),
      c2: new Point(m1.x + tx, m2.y + ty)
    }
  }
```


```javascript
  //使用四个轨迹点确定控制点,利用同一条贝塞尔曲线上的控制点修正。
  TODO
```

## 单个贝塞尔曲线的绘制
每一个Beizer Curve是由四个点决定的，起始点和两个控制点。
所以可以这样表示一条曲线。

```
  const curve = new Beizer(point1, control1, control2, point2)
```

## 绘制每一个坐标

- 绘制为圆点

```javascript

  _drawPoint = function (x, y, size) {
    ctx.moveTo(x, y);
    ctx.arc(x, y, size, 0, 2 * Math.PI, false)
  }
```

- 填充为图片（笔刷模型）

```javascript

  _drawPoint = function (x, y, size, image) {
    ctx.drawImage(image, x, y, xw, yw)
  }
```

## 绘制两个骨架点之间的贝塞尔曲线
依据四个点的坐标以及宽度，绘制出毛笔笔迹。














