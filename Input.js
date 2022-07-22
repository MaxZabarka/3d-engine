import Vector3 from "./Vector3.js";

const KEYS = ["w", "a", "s", "d", "Shift", " ", "q", "e"];
class Input extends Vector3 {
  constructor() {
    super();
    this.pressedKeys = {};

    window.addEventListener("keydown", (e) => {
      if (KEYS.includes(e.key)) {
        this.pressedKeys[e.key] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (KEYS.includes(e.key)) {
        this.pressedKeys[e.key] = false;
      }
    });
  }

  get x() {
    return this.pressedKeys["d"] ? 1 : 0 + this.pressedKeys["a"] ? -1 : 0;
  }
  get z() {
    return this.pressedKeys["w"] ? 1 : 0 + this.pressedKeys["s"] ? -1 : 0;
  }
  get y() {
    return this.pressedKeys[" "] ? 1 : 0 + this.pressedKeys["Shift"] ? -1 : 0;
  }
  set x(val) {}
  set y(val) {}
  set z(val) {}
}
export default Input;
