import { createHTML, getClientCoords } from "./utils.js";
import { MainScale, Circle } from "./classes.js";
import feather from "feather-icons";
import { ctx } from "./utils.js";
import Dropdown from "./dropdown.js";

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
  Modifier.update(MainScale.selected);
  Modifier.dropdown.setPosi();
}

function deleteCircle() {
  MainScale.selected.remove();
}

function createCircleOpt(circle) {
  const el = createHTML(`<li class="circle-opt">
    <button class="btn btn-delete">${feather.icons.trash.toSvg()}</button>
    <span class="circle-name">${circle.r}</span>
    ${feather.icons["chevron-right"].toSvg()}
  </li>`);

  el.querySelector(".btn-delete").addEventListener("click", () => {
    circle.remove()
    Modifier.update(MainScale.selected);
  });
  return el;
}

function toggleSelectCircle(circleEl) {
  const isIdDiff = circleEl.dataset.id !== Circle.selected?.id;
  unselectCircle();
  if (isIdDiff) selectCircle(circleEl);
}

function selectCircle(circleEl) {
  const circle = MainScale.selected.circleFromId(circleEl.getAttribute("data-id"));
  if (!circle) return;
  circle.select();
  Modifier.wrapper.dataset.selectedCircle = circle.id;
  Modifier.update(MainScale.selected);
}

function unselectCircle() {
  const circle = Circle.selected;
  if (!circle) return;
  circle.unselect();
  Modifier.wrapper.dataset.selectedCircle = "";
  Modifier.update(MainScale.selected);
}

export default class Modifier {
  static el = createHTML(`<div class="modifier">
      <span class="m-radius" draggable="false"></span>
      <span class="m-control m-control-radius" draggable="false"></span>
      <span class="m-control m-control-posi" draggable="false"></span>
      <div class="dropdown m-menu">
        <label class="dropdown-toggler" for="modifier-menu-toggler">+</label>
        <input type="checkbox" class="dropdown-toggler-btn" id="modifier-menu-toggler" name="modifier-menu-toggler" />

        <div tabindex="0" class="dropdown-content">
          <div class="m-menu-form menu-tab">
            <form class="form form-add-circle">
              <label class="dropdown-toggler form-field" style="border: 1px solid var(--base-100); padding: .5rem; border-radius: .2rem;" for="modifier-menu-toggler">
                <span data-feather="chevron-left"></span>
                <span>Close</span>
              </label>

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
          <ul class="m-menu-circles menu-tab"></ul>
          <div class="menu-tab m-menu-pens"></div>
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

    wrapper.querySelector(".m-menu-circles").innerHTML = "";

    MainScale.selected.circles.forEach(circle => {
      const circleEl = createCircleOpt(circle);
      if (Modifier.wrapper.getAttribute("data-selected-circle") === circle.id) circleEl.classList.add("active");
      wrapper.querySelector(".m-menu-circles").append(circleEl);
      circleEl.dataset.id = circle.id;
      circleEl.addEventListener("click", () => toggleSelectCircle(circleEl));
    })
  }

  static activate(scale) {
    const wrapper = Modifier.el;
    const rControl = wrapper.querySelector(".m-control-radius");
    const mControl = wrapper.querySelector(".m-control-posi");

    document.body.append(Modifier.el);
    Modifier.dropdown = new Dropdown(wrapper.querySelector(".dropdown"));
    Modifier.wrapper = wrapper;

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
    Modifier.dropdown = null;
    Modifier.wrapper = null;
  }

  static dropdown = null;
  static wrappper = null;
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
