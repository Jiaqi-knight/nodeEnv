import React from 'react';
import Matrix4 from '@/lib/cuon-matrix'
import {getWebGLContext,initShaders} from '@/lib/cuon-utils'
export default class HelloPoint1 extends React.Component {
  componentDidMount() {
    main();
  }
  render() {
    return (
      <div className="upload">
        <canvas id="TheBookOfShadersRandom2D"/>
        <div className="summary" >2d随机</div>
      </div>
    );
  }
}
// 顶点着色器程序
let VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + // attribute variable
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec2 u_resolution;\n'+
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' + // Set the vertex coordinates of the point
  '  u_resolution = gl_Position.xy;\n'+
  '}\n';

// 片元着色器程序
let FSHADER_SOURCE =
  'precision mediump float;\n'+
  'varying vec2 u_resolution;\n'+
  'float random (vec2 st) {\n' +
  '    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);\n' +
  '}'+
  'void main() {\n' +
  '  vec2 st = gl_FragCoord.xy/u_resolution.xy;\n'+
  '  float rnd = random( st );\n'+
  '  gl_FragColor = vec4(vec3(rnd),1.0);\n' +
  '}\n';

//定义一个矩形体：混合构造函数原型模式
function Cuboid(minX, maxX, minY, maxY, minZ, maxZ) {
  this.minX = minX;
  this.maxX = maxX;
  this.minY = minY;
  this.maxY = maxY;
  this.minZ = minZ;
  this.maxZ = maxZ;
}

Cuboid.prototype = {
  constructor: Cuboid,
  CenterX: function () {
    return (this.minX + this.maxX) / 2.0;
  },
  CenterY: function () {
    return (this.minY + this.maxY) / 2.0;
  },
  CenterZ: function () {
    return (this.minZ + this.maxZ) / 2.0;
  },
  LengthX: function () {
    return (this.maxX - this.minX);
  },
  LengthY: function () {
    return (this.maxY - this.minY);
  }
}

let currentAngle = [0.0, 0.0]; // 绕X轴Y轴的旋转角度 ([x-axis, y-axis])
let curScale = 1.0;   //当前的缩放比例
let gl,canvas,cuboid,n
function main() {
  // 获取 <canvas> 元素
  canvas = document.getElementById('TheBookOfShadersRandom2D');
  canvas.width = canvas.width * 2
  canvas.height = canvas.height * 2
  // 获取WebGL渲染上下文
  gl = getWebGLContext(canvas);


  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 设置顶点位置
  cuboid = new Cuboid(399589.072, 400469.072, 3995118.062, 3997558.062, 732, 1268);
  n = initVertexBuffers(gl, cuboid);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  //注册鼠标事件
  initEventHandlers(canvas);

  // 指定清空<canvas>的颜色
  gl.clearColor(0.0, 0.0, 0.0, 0.1);

  // 开启深度测试
  gl.enable(gl.DEPTH_TEST);

  //开始绘制
  tick();

  // 绘制矩形体
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
function tick() {
  //设置MVP矩阵
  setMVPMatrix(gl, canvas, cuboid);

  //清空颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //绘制矩形体
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

/**
 * 注册鼠标事件
 * @param {HTMLCanvasElement} canvas
 */
function initEventHandlers(canvas) {
  let dragging = false;         // Dragging or not
  let lastX = -1, lastY = -1;   // Last position of the mouse

  //鼠标按下
  canvas.onmousedown = function (ev) {
    let x = ev.clientX;
    let y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    let rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;
    }
    tick();
  };

  //鼠标离开时
  canvas.onmouseleave = function () {
    dragging = false;
  };

  //鼠标释放
  canvas.onmouseup = function () {
    dragging = false;
  };

  //鼠标移动
  canvas.onmousemove = function (ev) {
    let x = ev.clientX;
    let y = ev.clientY;
    if (dragging) {
      let factor = 100 / canvas.height; // The rotation ratio
      let dx = factor * (x - lastX);
      let dy = factor * (y - lastY);
      currentAngle[0] = currentAngle[0] + dy;
      currentAngle[1] = currentAngle[1] + dx;
    }
    lastX = x
    lastY = y
    tick();
  };

  //鼠标缩放
  canvas.onmousewheel = function (event) {
    if (event.wheelDelta > 0) {
      curScale = curScale * 1.1;
    } else {
      curScale = curScale * 0.9;
    }
    tick()
  };
}

//设置MVP矩阵
function setMVPMatrix(gl, canvas, cuboid) {
  // Get the storage location of u_MvpMatrix
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  //模型矩阵
  let modelMatrix = new Matrix4();
  modelMatrix.scale(curScale, curScale, curScale);
  modelMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
  modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
  modelMatrix.translate(-cuboid.CenterX(), -cuboid.CenterY(), -cuboid.CenterZ());

  //投影矩阵
  let fovy = 60;
  let projMatrix = new Matrix4();
  projMatrix.setPerspective(fovy, canvas.width / canvas.height, 1, 10000);

  //计算lookAt()函数初始视点的高度
  let angle = fovy / 2 * Math.PI / 180.0;
  let eyeHight = (cuboid.LengthY() * 1.2) / 2.0 / angle;

  //视图矩阵
  let viewMatrix = new Matrix4();  // View matrix
  viewMatrix.lookAt(0, 0, eyeHight, 0, 0, 0, 0, 1, 0);

  //MVP矩阵
  let mvpMatrix = new Matrix4();
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

  //将MVP矩阵传输到着色器的uniform变量u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
}

//
function initVertexBuffers(gl, cuboid) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // 顶点坐标和颜色
  let verticesColors = new Float32Array([
    cuboid.maxX, cuboid.maxY, cuboid.maxZ, 1.0, 1.0, 1.0,  // v0 White
    cuboid.minX, cuboid.maxY, cuboid.maxZ, 1.0, 0.0, 1.0,  // v1 Magenta
    cuboid.minX, cuboid.minY, cuboid.maxZ, 1.0, 0.0, 0.0,  // v2 Red
    cuboid.maxX, cuboid.minY, cuboid.maxZ, 1.0, 1.0, 0.0,  // v3 Yellow
    cuboid.maxX, cuboid.minY, cuboid.minZ, 0.0, 1.0, 0.0,  // v4 Green
    cuboid.maxX, cuboid.maxY, cuboid.minZ, 0.0, 1.0, 1.0,  // v5 Cyan
    cuboid.minX, cuboid.maxY, cuboid.minZ, 0.0, 0.0, 1.0,  // v6 Blue
    cuboid.minX, cuboid.minY, cuboid.minZ, 1.0, 0.0, 1.0   // v7 Black
  ]);

  //顶点索引
  let indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // 前
    0, 3, 4, 0, 4, 5,    // 右
    0, 5, 6, 0, 6, 1,    // 上
    1, 6, 7, 1, 7, 2,    // 左
    7, 4, 3, 7, 3, 2,    // 下
    4, 7, 6, 4, 6, 5     // 后
  ]);

  let FSIZE = verticesColors.BYTES_PER_ELEMENT;   //数组中每个元素的字节数

  // 创建缓冲区对象
  let vertexColorBuffer = gl.createBuffer();
  let indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 向缓冲区对象写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  //获取着色器中attribute变量a_Position的地址
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  // 将顶点索引写入到缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
