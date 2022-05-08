class Material {
  constructor(color, specular = -1, reflective = 0.4) {
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;
  }
}
export default Material;
