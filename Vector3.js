const degsToRads = (deg) => (deg * Math.PI) / 180.0;

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  sub(other) {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  add(other) {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  divide(other) {
    return new Vector3(this.x / other, this.y / other, this.z / other);
  }
  // multiply(other) {
  //   return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
  // }
  scale(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  normalize() {
    return this.divide(this.magnitude());
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  clampColor() {
    return new Vector3(
      Math.max(this.x, 255),
      Math.max(this.y, 255),
      Math.max(this.z, 255)
    );
  }
  rotate(yaw, pitch) {
    // const yawRads = degsToRads(yaw);
    // const pitchRads = degsToRads(pitch);

    // // Step one: Rotate around X axis (pitch)
    // const _y = this.y * Math.cos(pitchRads) - this.z * Math.sin(pitchRads);
    // let _z = this.y * Math.sin(pitchRads) + this.z * Math.cos(pitchRads);

    // // Step two: Rotate around the Y axis (yaw)
    // const _x = this.x * Math.cos(yawRads) + _z * Math.sin(yawRads);
    // _z = -this.x * Math.sin(yawRads) + _z * Math.cos(yawRads);

    // return new Vector3(_x, _y, _z);

    // Convert to radians
    const yawRads = degsToRads(yaw);
    const pitchRads = degsToRads(pitch);

    // Step one: Rotate around X axis (pitch)
    const _y = this.y * Math.cos(pitchRads) - this.z * Math.sin(pitchRads);
    let _z = this.y * Math.sin(pitchRads) + this.z * Math.cos(pitchRads);

    // Step two: Rotate around the Y axis (yaw)
    const _x = this.x * Math.cos(yawRads) + _z * Math.sin(yawRads);
    _z = -this.x * Math.sin(yawRads) + _z * Math.cos(yawRads);

    return new Vector3(_x, _y, _z);
  }
}
export default Vector3;
