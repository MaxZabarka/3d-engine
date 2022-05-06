import Object3D from "./Object3D.js";
import Vector3 from "./Vector3.js";

class Sphere extends Object3D {
  constructor(
    radius = 1,
    position = new Vector3(),
    material = new Material(new Vector3(255, 255, 0))
  ) {
    super(position);
    this.material = material;
    this.radius = radius;
  }
}

export default Sphere;
