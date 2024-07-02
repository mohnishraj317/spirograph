export default class Dropdown {
  constructor(el) {
    this.wrapper = el;

    this.wrapper.querySelectorAll(".dropdown-toggler-btn").forEach(toggler => {
      toggler.addEventListener("change", () => {
        if (!toggler.checked) return;
        this.setPosi();
      })
    });
  }

  setPosi() {
    this.wrapper.classList.remove("d-right-0");
    this.wrapper.classList.remove("d-bottom-0");
    const box = this.wrapper.querySelector(".dropdown-content").getBoundingClientRect();

    if (box.left + box.width > innerWidth) {
      this.wrapper.classList.add("d-right-0");
    }

    if (box.top + box.height > innerHeight) {
      this.wrapper.classList.add("d-bottom-0");
    }

  }
}
