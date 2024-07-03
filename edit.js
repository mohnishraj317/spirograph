import { MainScale } from "./classes.js" 
import { ctx, cnv, getClientCoords } from "./utils.js";
import Modifier from "./modifier.js";

let flag = false;

function endEditMode() {
  flag = false;
  document.body.classList.remove("mode-edit");
  Modifier.deactivate();
}

export function startEditMode() {
  flag = true;
  document.body.classList.add("mode-edit");
}

export function toggleEditMode() {
  if (flag) endEditMode();
  else startEditMode();
}

document.querySelector(".btn-edit")
  .addEventListener("click", toggleEditMode);

cnv.preview.addEventListener("mousedown", e => {
  if (!flag) return;
  if (!e.target.closest(".modifier") && MainScale.selected) MainScale.selected.unselect();

  const [x, y] = getClientCoords(e);
  const scale = MainScale.scales.find(s => Math.hypot(s.x - x, s.y - y) < s.r);
  scale?.select();
});
