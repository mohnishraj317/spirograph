"use strict";
import './style.css';
import { MainScale, Circle } from "./classes.js"

const cnv = {
  grapher: document.querySelector(".cnv-grapher"),
  sheet: document.querySelector(".cnv-sheet"),
};

const ctx = {
  grapher: cnv.grapher.getContext("2d"),
  sheet: cnv.sheet.getContext("2d")
};

function resize(w = innerWidth, h = innerHeight) {
  cnv.grapher.height = h;
  cnv.grapher.width = w;
  cnv.sheet.height = h;
  cnv.sheet.width = w;
}

function fillCnv(cnv, ctx, color="#0002") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.restore();
}

const mainScale = new MainScale(innerWidth / 2, innerHeight / 2, 200);

resize();
addEventListener("resize", () => {
  resize();
  mainScale.x = innerWidth / 2;
  mainScale.y = innerHeight / 2;
});

const circle = new Circle(mainScale, 99);
circle.addPen(.5, "blue", 50);


let animId = null;

function animate() {
  fillCnv(cnv.grapher, ctx.grapher, "#fff");
  mainScale.draw(ctx.grapher);
  circle.update(ctx.grapher, ctx.sheet);

  animId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animId);
  }
}

let pause = null;

addEventListener("click", () => {
  if (!pause) pause = animate();
  else {
    pause();
    pause = null;
  }
});
