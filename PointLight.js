import Vector3 from "./Vector3.js";
import Light from "./Light.js"

class PointLight extends Light {
  constructor(position = new Vector3(), intensity = 1) {
    super(intensity);
    this.position = position;
  }
}
export default PointLight;
