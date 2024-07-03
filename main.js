import './style.css';
import "./dropdown.css";
import feather from "feather-icons";

import { MainScale, Circle } from "./classes.js"
import { resize, fillCnv, cnv, ctx } from "./utils.js";
import Animation from "./animation.js";

import "./draw.js";
import "./edit.js";
import "./dropdown.js";

feather.replace();

addEventListener("load", Animation.start);

document.querySelector(".menu-toggler")
  .addEventListener("click", () => {
    document.querySelector(".menu").classList.toggle("active");
  });

document.querySelector(".btn-download")
  .addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "spiro.png";
    link.href = cnv.sheet.toDataURL();
    link.click();
  });

document.querySelector(".btn-toggle-graph")
  .addEventListener("click", () => {
    document.body.classList.toggle("mode-graph-hide");
  });

resize();
