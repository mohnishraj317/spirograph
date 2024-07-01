import { MainScale } from "./classes.js" 
import { ctx, cnv, getClientCoords } from "./utils.js";

let flag = false;

function endEditMode() {
  flag = false;
  document.body.classList.remove("mode-edit");
}

export function startEditMode() {
  flag = true;
  document.body.classList.add("mode-edit");
}

export function toggleEditMode() {
  flag = !flag;
  document.body.classList.toggle("mode-edit", flag);
}

document.querySelector(".btn-edit")
  .addEventListener("click", toggleEditMode);

cnv.preview.addEventListener("mousedown", e => {
  if (!flag) return;

  const [x, y] = getClientCoords(e);
  const scale = MainScale.scales.find(s => Math.hypot(s.x - x, s.y - y) < s.r);
  scale?.select();
});
