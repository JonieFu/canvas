//获取元素
const canvas = document.getElementById("canvas");
const canvasWrapper = document.querySelector(".canvas-wrapper");
const color = document.querySelector(".color");
const input = document.querySelector("input");
const select = document.querySelector("#line-select");
const tool = document.querySelector(".tool-select");
const eraser = document.querySelector(".eraser");
const pencil = document.querySelector(".pencil");
const icon1 = document.querySelector(".icon1");
const icon2 = document.querySelector(".icon2");
const icon3 = document.querySelector(".icon3");
const icon4 = document.querySelector(".icon4");
const ws = getComputedStyle(canvasWrapper);
const padding = ws.padding.split("p")[0];
//设置画板宽高
const width = parseFloat(ws.width.split("p")[0]) - padding * 2;
const height = parseFloat(ws.height.split("p")[0]) - padding * 2;
canvas.width = width;
canvas.height = height;
//撤销
let step = -1;
let canvasHistory = [];

//画板初始值
let lineWidth = 1;
let ctx = canvas.getContext("2d");
let painting = false;
ctx.lineWidth = lineWidth;
ctx.strokeStyle = "black";
canvas.style.cursor = "crosshair";

let last;
window.devicePixelRatio ? setScale(window.devicePixelRatio) : setScale(4);
function setScale(d) {
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.height = height * d;
  canvas.width = width * d;
  ctx.scale(d, d);
}
// 线条选择器
select.onchange = () => {
  if (select.value) {
    ctx.lineWidth = select.value;
  } else {
    return;
  }
};
// input type = color
input.addEventListener("input", (e) => {
  ctx.strokeStyle = e.target.value;
});
// 颜色选择器与input互通
color.addEventListener("click", (e) => {
  const rgb = getComputedStyle(e.target)
    .backgroundColor.split("(")[1]
    .split(")")[0]
    .split(",");
  const hex = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
  input.value = hex;

  ctx.strokeStyle = getComputedStyle(e.target).backgroundColor;
});
tool.addEventListener("click", (e) => {
  if (e.target === icon1) {
    ctx.lineWidth = select.value;
    ctx.strokeStyle = input.value;
    pencil.style.border = "1px solid #3f48cc";
    eraser.style.border = "1px solid white";
    canvas.style.cursor = "crosshair";
    ctx.globalCompositeOperation = "source-over";
  } else if (e.target === icon2) {
    ctx.lineWidth = 20;
    eraser.style.border = "1px solid #3f48cc";
    pencil.style.border = "1px solid white";
    canvas.style.cursor = "pointer";
    ctx.globalCompositeOperation = "destination-out";
  } else if (e.target === icon3) {
    if (step >= 0) {
      step--;
      ctx.clearRect(0, 0, width, height);
      let canvasPic = new Image();
      canvasPic.src = canvasHistory[step];
      if (step === -1) {
        canvasPic.src = canvas.toDataURL();
      }
      canvasPic.onload = function () {
        ctx.drawImage(canvasPic, 0, 0);
      };
      console.log(step);
    } else {
      window.alert("不能再继续撤销了");
      return;
    }
  } else if (e.target === icon4) {
    if (step < canvasHistory.length - 1) {
      step++;
      let canvasPic = new Image();
      canvasPic.src = canvasHistory[step];
      canvasPic.addEventListener("load", () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(canvasPic, 0, 0);
      });
    } else {
      window.alert("已经是最新记录了");
    }
  }
});
//rgbToHex
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//划线
function drawLine(x1, y1, x2, y2) {
  step++;
  if (step < canvasHistory.length) {
    canvasHistory.length = step;
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.closePath();
  ctx.stroke();
  canvasHistory.push(canvas.toDataURL());
}
if (width < 500) {
  window.alert("为了不影响体验，请在PC端打开");
}
// PC端
canvas.onmousedown = (e) => {
  painting = true;
  last = [e.offsetX, e.offsetY];
};
canvas.onmouseup = () => {
  painting = false;
};
canvas.onmouseleave = () => {
  painting = false;
};
canvas.onmousemove = (e) => {
  if (painting === true) {
    drawLine(last[0], last[1], e.offsetX, e.offsetY);
  }
  last = [e.offsetX, e.offsetY];
};
