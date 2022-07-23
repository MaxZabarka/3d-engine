class Canvas {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.aspect = this.width / this.height;
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.frame = 0;
    this.id = Math.floor(Math.random() * 1000).toString();

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

    const link = document.createElement("a");
    link.download = this.id + "-" + this.frame + ".png";
    link.href = this.canvas.toDataURL("image/png");
    link.click();
    this.frame++;
  }
  toQuadrant(aX, aY) {
    const x = Math.round(this.width / 2) + aX;
    const y = Math.round(this.height / 2) - aY;
    return [x, y];
  }
}
export default Canvas;
