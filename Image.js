import Vector3 from "./Vector3.js";

class Image {
  constructor(path, intensity) {
    this.imageElement = document.createElement("img");
    this.path = path;
    this.intensity = intensity
  }
  load() {
    return new Promise((resolve) => {
      this.imageElement.src = this.path;
      this.imageElement.onload = () => {
        this.width = this.imageElement.width;
        this.height = this.imageElement.height;

        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        // document.body.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
        this.ctx.drawImage(this.imageElement, 0, 0, this.width, this.height);
        resolve();
      };
    });
  }
  getImageData(x, y) {
    const data = this.ctx.getImageData(x, y, 1, 1).data;
    return new Vector3(data[0], data[1], data[2]);
  }
  getColor(direction) {
    // https://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere
    const normalizedDirection = direction.normalize();

    const u =
      0.5 +
      Math.atan2(normalizedDirection.x, normalizedDirection.z) / (Math.PI * 2);
    const v = 0.5 + (Math.asin(normalizedDirection.y) / Math.PI) * -1;
    // console.log("Math.asin(direction.y)", Math.asin(direction.y));
    // console.log("direction.y", direction.y);
    // console.log("u,v", u, v);
    // console.log("u, v", u, v);

    const x = u * this.width;
    const y = v * this.height;

    // console.log("x,y", x, y);
    return this.getImageData(x - 1, y).scale(this.intensity);
  }
}

export default Image;
