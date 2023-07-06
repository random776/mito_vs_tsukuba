// 回帰直線を求める（最小二乗法）
const lsm = (coordinates) => {
  const n = coordinates.length;
  const sigX = coordinates.reduce((acc, c) => acc + c.x, 0);
  const sigY = coordinates.reduce((acc, c) => acc + c.y, 0);
  const sigXX = coordinates.reduce((acc, c) => acc + c.x * c.x, 0);
  const sigXY = coordinates.reduce((acc, c) => acc + c.x * c.y, 0);
  // a(傾き)を求める
  const a = (n * sigXY - sigX * sigY) / (n * sigXX - Math.pow(sigX, 2));
  // b(切片)を求める
  const b = (sigXX * sigY - sigXY * sigX) / (n * sigXX - Math.pow(sigX, 2));
  return { a, b };
};

const lsm2 = (coordinates2) => {
  const n2 = coordinates2.length;
  const sigX2 = coordinates2.reduce((acc, c) => acc + c.x, 0);
  const sigY2 = coordinates2.reduce((acc, c) => acc + c.y, 0);
  const sigXX2 = coordinates2.reduce((acc, c) => acc + c.x * c.x, 0);
  const sigXY2 = coordinates2.reduce((acc, c) => acc + c.x * c.y, 0);
  // a(傾き)を求める
  const c = (n2 * sigXY2 - sigX2 * sigY2) / (n2 * sigXX2 - Math.pow(sigX2, 2));
  // b(切片)を求める
  const d =
    (sigXX2 * sigY2 - sigXY2 * sigX2) / (n2 * sigXX2 - Math.pow(sigX2, 2));
  return { c, d };
};

const canvas = document.getElementById("graph");
if (canvas.getContext) {
  const ctx = canvas.getContext("2d");

  // ｘ軸の描画
  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.lineTo(100, 500);
  ctx.stroke();
  // ｙ軸の描画
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(500, 400);
  ctx.stroke();

  const coordinates = [
    //つくばの人口
    { x: 50, y: 244.433 },
    { x: 100, y: 249.451 },
    { x: 150, y: 253.739 },
  ];
  const coordinates2 = [
    //水戸の人口
    { x: 50, y: 270.335 },
    { x: 100, y: 269.776 },
    { x: 150, y: 268.423 },
  ];
  // サンプルデータの点を描画
  ctx.fillStyle = "rgb(0, 0, 255)";
  coordinates.forEach((c) => {
    ctx.fillRect(c.x + 100, -c.y + 400, 3, 3);
  });

  ctx.fillStyle = "rgb(0, 0, 255)";
  coordinates2.forEach((c) => {
    ctx.fillRect(c.x + 100, -c.y + 400, 3, 3);
  });

  // 回帰直線の描画
  let { a, b } = lsm(coordinates);
  ctx.strokeStyle = "rgb(255, 0, 0)";
  ctx.beginPath();
  ctx.moveTo(-100 + 100, -(-100 * a + b) + 400);
  ctx.lineTo(400 + 100, -(400 * a + b) + 400);
  ctx.stroke();

  let { c, d } = lsm2(coordinates2);
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.beginPath();
  ctx.moveTo(-100 + 100, -(-100 * c + d) + 400);
  ctx.lineTo(400 + 100, -(400 * c + d) + 400);
  ctx.stroke();

  /**
   * 2点の線分（座標）から交点を求める
   * @param {{start:{x:number,y:number},end:{x:number,y:number}}} line1 1つ目の直線
   * @param {{start:{x:number,y:number},end:{x:number,y:number}}} line2 2つ目の直線
   * @return {{x:number,y:number}|false} 交点する座標を返し、平行の場合はfalseを返す
   */
  var getIntersectionLineSegments = function (line1, line2) {
    var x0 = line1.start.x,
      y0 = line1.start.y,
      x1 = line1.end.x,
      y1 = line1.end.y,
      x2 = line2.start.x,
      y2 = line2.start.y,
      x3 = line2.end.x,
      y3 = line2.end.y;

    var a0 = (y1 - y0) / (x1 - x0),
      a1 = (y3 - y2) / (x3 - x2);

    var x = (a0 * x0 - y0 - a1 * x2 + y2) / (a0 - a1),
      y = ((y1 - y0) / (x1 - x0)) * (x - x0) + y0;

    if (Math.abs(a0) === Math.abs(a1)) return false;

    if (
      x > Math.max(x0, x1) ||
      x > Math.max(x2, x3) ||
      y > Math.max(y0, y1) ||
      y > Math.max(y2, y3) ||
      x < Math.min(x0, x1) ||
      x < Math.min(x2, x3) ||
      x < Math.min(x0, x1) ||
      y < Math.min(y2, y3)
    )
      return false;

    return { x: x, y: y };
  };
  // 直線1
  var line1 = {
    start: { x: 0, y: b }, // 始点
    end: { x: 500, y: a * 500 + b }, // 終点
  };

  // 直線2
  var line2 = {
    start: { x: 0, y: d }, // 始点
    end: { x: 500, y: c * 500 + d }, // 終点
  };

  var point = getIntersectionLineSegments(line1, line2);

  const tsukubaTime = Math.floor((2020 + point.x / 50 - 1970) * 365.25 * 24 * 60 * 60 * 1000);
  

  const date = new Date();
  const getMiliSeconds = tsukubaTime - date.getTime();
  date.setSeconds(date.getSeconds() + getMiliSeconds / 1000);
  // 画面上の表示
  const n = 3; // 小数点第n位まで残す
  const content = document.getElementById("content");
  content.textContent = `つくばの人口が水戸の人口に追いつくのは${
    Math.floor((2020 + point.x / 50) * Math.pow(10, n)) / Math.pow(10, n)
  }年だと想定されます。`;

alert( date );
}
