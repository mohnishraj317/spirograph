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
  cnv.grapher.style.height = h + "px";
  cnv.grapher.style.width = w + "px";
  cnv.sheet.style.height = h + "px";
  cnv.sheet.style.width = w + "px";

  w *= devicePixelRatio;
  h *= devicePixelRatio;
  
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

const mainScale = new MainScale(cnv.grapher.width / 2, cnv.grapher.height / 2, 400);

addEventListener("resize", () => {
  resize();
  mainScale.x = cnv.grapher.width / 2;
  mainScale.y = cnv.grapher.height / 2;
});

addEventListener("load", () => {
  resize();
  mainScale.x = cnv.grapher.width / 2;
  mainScale.y = cnv.grapher.height / 2;
});

const circle = mainScale.addCircle(99, 0, .01);
circle.addPen(1, "blue", 50);
circle.addPen(.5, "orange", 20);

const c2 = mainScale.addCircle(199, 0, .02);
c2.addPen(.5, "black", 30);
c2.addPen(.5, "green", 50);

let animId = null;

function animate() {
  fillCnv(cnv.grapher, ctx.grapher, "#fff");
  mainScale.update(ctx.grapher, ctx.sheet);

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
