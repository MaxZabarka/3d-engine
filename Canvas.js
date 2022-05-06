import Vector3 from "./Vector3.js";

class Canvas {
  constructor(id) {
    const canvas = document.getElementById(id);
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.aspect = this.width / this.height;
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);

    this.buf = new ArrayBuffer(this.imageData.data.length);
    this.buf8 = new Uint8ClampedArray(this.buf);
    this.data = new Uint32Array(this.buf);
  }
  putPixel(aX, aY, color) {
    const [x, y] = this.toQuadrant(aX, aY);
    this.data[y * this.width + x] =
      (255 << 24) | // alpha
      (color.z << 16) | // blue
      (color.y << 8) | // green
      color.x; // red
  }
  update() {
    this.imageData.data.set(this.buf8);
    this.ctx.putImageData(this.imageData, 0, 0);
  }
  toQuadrant(aX, aY) {
    const x = Math.round(this.width / 2) + aX;
    const y = Math.round(this.height / 2) - aY;
    return [x, y];
  }
  toViewport(x, y, camera) {
    const viewportX = x * (camera.viewport.width / this.width) + camera.position.x;
    const viewportY = y * (camera.viewport.height / this.height) + camera.position.y;
    const viewportZ = camera.viewport.distance + camera.position.z;
    return new Vector3(viewportX, viewportY, viewportZ);
  }
}
export default Canvas;
