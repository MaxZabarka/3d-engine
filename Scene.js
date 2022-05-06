import Light from "./Light.js";
import Sphere from "./Sphere.js";

class Scene {
  constructor() {
    this.spheres = [];
    this.lights = [];
  }
  add(object) {
    if (object instanceof Sphere) {
      this.spheres.push(object);
    } else if (object instanceof Light) {
      this.lights.push(object);
    } else {
      throw Error("Unimplemented object");
    }
  }
}
export default Scene;
