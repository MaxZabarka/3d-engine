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
  multiply(other) {
    return new Vector3(this.x * other, this.y * other, this.z * other);
  }
  scale(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  normalize() {
    return this.divide(this.magnitude());
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
}
export default Vector3;
