import Light from "./Light.js"

class DirectionalLight extends Light {
    constructor(direction, intensity) {
        super(intensity)
        this.direction = direction
    }
}
export default DirectionalLight