import { fillCnv, cnv, ctx } from "./utils.js";
import { MainScale } from "./classes.js";

export default class Animation {
  static playing = false;
  static _animID = null;

  static start() {
    Animation._animate();
    Animation.play();
  }

  static play() {
    Animation.playing = true;
    document.querySelector(".btn-toggle-animation").classList.add("playing");
  }

  static pause() {
    Animation.playing = false;
    document.querySelector(".btn-toggle-animation").classList.remove("playing");
  }

  static _animate() {
    Animation._animID = requestAnimationFrame(Animation._animate);

    if (Animation.playing) {
      fillCnv(cnv.grapher, ctx.grapher, "#fff");

      MainScale.scales.forEach(scale => {
        scale.update(ctx.grapher, ctx.sheet);
      });
    } else {
      Animation.updateScene();
    }
  }

  static updateScene() {
    fillCnv(cnv.grapher, ctx.grapher, "#fff");

    MainScale.scales.forEach(scale => {
      scale.draw(ctx.grapher);
      
      scale.circles.forEach(circle => {
        circle.draw(ctx.grapher, ctx.preview);
      });
    });
  }
}

document.querySelector(".btn-toggle-animation")
  .addEventListener("click", () => {
    if (Animation.playing) Animation.pause();
    else Animation.play();
  });
