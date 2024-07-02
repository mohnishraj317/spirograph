import { createHTML, getClientCoords } from "./utils.js";
import { MainScale } from "./classes.js";
import feather from "feather-icons";
import { ctx } from "./utils.js";

let radiusFlag = false;
let moveFlag = false;

function changeRadius(e) {
  if (!radiusFlag) return;

  const [ x ] = getClientCoords(e);
  const scale = MainScale.selected;
  scale.r = ~~Math.abs(x - scale.x);
  Modifier.update(scale);
}

function changePosi(e) {
  if (!moveFlag) return;

  const [ x, y ] = getClientCoords(e);
  const scale = MainScale.selected;
  scale.x = x;
  scale.y = y;
  Modifier.update(scale);
}

function addCircle(e) {
  e.preventDefault();
  
  const r = +e.target["circle-r"].value;
  const theta = (+e.target["circle-theta"].value) * Math.PI / 180;
  const omega = +e.target["circle-omega"].value;

  const circle = MainScale.selected.addCircle(r, theta, omega);
  circle.draw(ctx.grapher);

  circle.addPen(1, "red", 40);
}

function deleteCircle() {
  MainScale.selected.remove();
}

export default class Modifier {
  static el = createHTML(`<div class="modifier">
      <span class="m-radius" draggable="false"></span>
      <span class="m-control m-control-radius" draggable="false"></span>
      <span class="m-control m-control-posi" draggable="false"></span>
      <div class="dropdown m-menu">
        <label for="modifier-menu-toggler">+</label>
        <input type="checkbox" class="menu-toggler" id="modifier-menu-toggler" name="modifier-menu-toggler" />

        <div tabindex="0" class="menu-content">
          <div class="m-menu-form menu-tab">
            <form class="form form-add-circle">
              <label for="circle-r" class="form-field">
                <span>r</span>
                <input type="number" value="${10}" class="input-field" name="circle-r" id="circle-r" />
              </label>

              <label for="circle-theta" class="form-field">
                <span>theta</span>
                <input type="number" value="0" min="0" max="360" class="input-field" name="circle-theta" id="circle-theta" />
              </label>
              
              <label for="circle-omega" class="form-field">
                <span>omega</span>
                <input type="number" value="0.01" min=".001" step=".001" class="input-field" name="circle-omega" id="circle-omega" />
              </label>

              <button class="btn form-submit"><i data-feather="plus"></i></button>
            </form>
            <button class="btn btn-delete btn-delete-circle"><i data-feather="trash"></i></button>
          </div>
          <div class="m-menu-circles menu-tab">
            Hello world
          </div>
        </div>
      </div>
    </div>`);

  static update(scale) {
    const wrapper = Modifier.el;
    const radiusEl = wrapper.querySelector(".m-radius");
    const rControl = wrapper.querySelector(".m-control-radius");

    wrapper.style.cssText = `
      top: ${scale.y}px;
      left: ${scale.x}px;
      height: ${2 * scale.r}px;
      width: ${2 * scale.r}px;
    `;

    radiusEl.textContent = scale.r;
  }

  static activate(scale) {
    const wrapper = Modifier.el;
    const rControl = wrapper.querySelector(".m-control-radius");
    const mControl = wrapper.querySelector(".m-control-posi");

    document.body.append(Modifier.el);
    Modifier.el.classList.add("active");
    Modifier.update(scale);

    rControl.addEventListener("mousedown", () => {
      radiusFlag = true;
    });

    rControl.addEventListener("touchstart", () => {
      radiusFlag = true;
    })

    mControl.addEventListener("mousedown", () => {
      moveFlag = true;
    });

    mControl.addEventListener("touchstart", () => {
      moveFlag = true;
    });

    wrapper.querySelector(".form-add-circle")
      .addEventListener("submit", addCircle);

    wrapper.querySelector(".btn-delete-circle")
      .addEventListener("click", deleteCircle);

    feather.replace();
  }

  static deactivate() {
    Modifier.el.remove();
    Modifier.el.classList.remove("active");
  }
}

addEventListener("mousemove", changeRadius);
addEventListener("mousemove", changePosi);
addEventListener("mouseup", () => {
  radiusFlag = false;
  moveFlag = false
});

addEventListener("touchmove", changeRadius);
addEventListener("touchmove", changePosi);
addEventListener("touchend", () => {
  radiusFlag = false;
  moveFlag = false
});

