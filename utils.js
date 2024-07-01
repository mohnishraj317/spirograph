import { MainScale } from "./classes";

export const cnv = {
  grapher: document.querySelector(".cnv-grapher"),
  sheet: document.querySelector(".cnv-sheet"),
  preview: document.querySelector(".cnv-preview")
};

export const ctx = {
  grapher: cnv.grapher.getContext("2d"),
  sheet: cnv.sheet.getContext("2d"),
  preview: cnv.preview.getContext("2d"),
};

export function resize(w = innerWidth, h = innerHeight) {
  Object.values(cnv).forEach(cnv => {
    cnv.style.height = h + "px";
    cnv.style.width = w + "px";

    const scaleW = w * devicePixelRatio;
    const scaleH = h * devicePixelRatio;

    cnv.height = scaleH;
    cnv.width = scaleW;
  });
}

export function fillCnv(cnv, ctx, color="#0002") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.restore();
}

export function getClientCoords(e) {
  let x, y;

  if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  return [x, y];
}

export function createHTML(str) {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div.firstElementChild;
}
