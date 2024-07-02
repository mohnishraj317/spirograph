"use strict";
import './style.css';
import "./dropdown.css";
import feather from "feather-icons";

import { MainScale, Circle } from "./classes.js"
import { resize, fillCnv } from "./utils.js";
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

resize();
