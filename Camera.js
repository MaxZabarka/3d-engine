import Object3D from "./Object3D.js";
import Vector3 from "./Vector3.js";

class Camera extends Object3D {
  constructor(
    canvas,
    fov = 75,
    position = new Vector3(),
    far = Infinity,
    backgroundColor = new Vector3(200, 230, 255)
  ) {
    super(position);
    this.backgroundColor = backgroundColor;
    this.fov = fov;
    this.canvas = canvas;
    this.viewport = {};
    this.viewport.distance = 1 / Math.tan(((fov / 2) * Math.PI) / 180.0) / 2;
    this.viewport.width = 1 * canvas.aspect;
    this.viewport.height = 1;
    this.viewport.far = far;
  }
  toViewport(x, y) {
    const viewportX =
      x * (this.viewport.width / this.canvas.width) + this.position.x;
    const viewportY =
      y * (this.viewport.height / this.canvas.height) + this.position.y;
    const viewportZ = this.viewport.distance + this.position.z;
    return new Vector3(viewportX, viewportY, viewportZ);
  }
}
export default Camera;
