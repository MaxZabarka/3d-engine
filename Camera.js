import Object3D from "./Object3D.js";
import Vector3 from "./Vector3.js";

class Camera extends Object3D {
  constructor(
    canvas,
    fov = 75,
    position = new Vector3(),
    far = Infinity,
    background = new Vector3(200, 230, 255)
  ) {
    super(position);
    this.background = background;
    this.fov = fov;
    this.canvas = canvas;
    this.viewport = {};
    this.viewport.distance = 1 / Math.tan(((fov / 2) * Math.PI) / 180.0) / 2;
    this.viewport.width = 1 * canvas.aspect;
    this.viewport.height = 1;
    this.viewport.far = far;
    this.rotation = new Vector3();
  }
  toViewport(x, y) {
    const viewportX =
      x * (this.viewport.width / this.canvas.width) + this.position.x;
    const viewportY =
      y * (this.viewport.height / this.canvas.height) + this.position.y;
    const viewportZ = this.viewport.distance + this.position.z;
    let position = new Vector3(viewportX, viewportY, viewportZ);
    return position;
  }
  getBackgroundColor(direction) {
    if (this.background instanceof Vector3) {
      return this.background;
    } else {
      return this.background.getColor(direction);
    }
  }
}
export default Camera;
