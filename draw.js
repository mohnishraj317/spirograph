import { cnv, ctx, getClientCoords } from "./utils.js";
import { MainScale } from "./classes.js";
import { startEditMode } from "./edit.js";

let active = false;
let flag = false;
let startX = null;
let startY = null;
let r = null;

function startDraw(e) {
  if (!active) return;

  flag = true;
  const [x, y] = getClientCoords(e);
  
  startX = x;
  startY = y;

  MainScale.selected?.unselect();
}

function draw(e) {
  if (!flag) return;

  const [x, y] = getClientCoords(e);
  const c = ctx.preview;
  r = ~~Math.hypot(startX - x, startY - y);

  c.clearRect(0, 0, cnv.preview.width, cnv.preview.height);

  c.save();
  c.beginPath();
  c.arc(startX, startY, r, 0, Math.PI * 2);
  c.lineTo(startX, startY);
  c.fillText(r, startX + r / 2, startY - 10);
  c.strokeStyle = "black";
  c.stroke();
  c.restore();
}

function stopDraw() {
  flag = false;
  ctx.preview.clearRect(0, 0, cnv.preview.width, cnv.preview.height);

  if (!(startX && startY && r)) return;

  const scale = MainScale.create(startX, startY, r);
  startEditMode();
  scale.select();
  startX = startY = r = null;
}

document.querySelector(".btn-add-circle")
  .addEventListener("click", () => {
    active = !active;
    document.body.classList.toggle("mode-circle", active);
  });

cnv.preview.addEventListener("mousedown", startDraw);
cnv.preview.addEventListener("mousemove", draw);
cnv.preview.addEventListener("mouseup", stopDraw);

cnv.preview.addEventListener("touchstart", startDraw);
cnv.preview.addEventListener("touchmove", draw);
cnv.preview.addEventListener("touchend", stopDraw);
