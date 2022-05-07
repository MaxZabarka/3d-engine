import AmbientLight from "./AmbientLight.js";
import DirectionalLight from "./DirectionalLight.js";
import PointLight from "./PointLight.js";

class Renderer {
  constructor(camera, scene, canvas) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
  }

  render() {
    for (let x = -this.canvas.width / 2; x < this.canvas.width / 2; x++) {
      for (let y = -this.canvas.height / 2; y < this.canvas.height / 2; y++) {
        let closestDistance = Infinity;
        let closestSphere = null;

        // D = (V - O)
        const direction = this.camera
          .toViewport(x, y)
          .sub(this.camera.position);
        this.scene.spheres.forEach((sphere) => {
          const [t1, t2] = this.traceRay(sphere, direction);
          if (
            t1 > this.camera.viewport.distance &&
            t1 < this.camera.viewport.far &&
            t1 < closestDistance
          ) {
            closestDistance = t1;
            closestSphere = sphere;
          }
          if (
            t2 > this.camera.viewport.distance &&
            t2 < this.camera.viewport.far &&
            t2 < closestDistance
          ) {
            closestDistance = t2;
            closestSphere = sphere;
          }
          if (closestSphere) {
            const point = this.camera.position.add(
              direction.scale(closestDistance)
            );
            const lighting = this.computeLighting(
              point,
              closestSphere,
              direction.scale(-1)
            );
            this.canvas.putPixel(
              x,
              y,
              closestSphere.material.color.scale(lighting)
            );
          } else {
            this.canvas.putPixel(x, y, this.camera.backgroundColor);
          }
        });
      }
    }
    this.canvas.update();
  }
  traceRay(sphere, direction) {
    // CO = O - C
    const sphereDirection = this.camera.position.sub(sphere.position);

    // < direction, direction >
    const a = direction.dot(direction);

    // 2 <CO, D>
    const b = 2 * direction.dot(sphereDirection);
    // < CO, CO > - r^2
    const c = sphereDirection.dot(sphereDirection) - sphere.radius ** 2;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return [Infinity, Infinity];
    }
    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [t1, t2];
  }

  computeLighting(point, sphere, view) {
    let i = 0;
    // N = (P - C) / (| P - C |)
    const normal = point.sub(sphere.position).normalize();
    this.scene.lights.forEach((light) => {
      let lightDirection;
      if (light instanceof AmbientLight) {
        i += light.intensity;
        return;
      } else if (light instanceof PointLight) {
        lightDirection = light.position.sub(point);
      } else if (light instanceof DirectionalLight) {
        lightDirection = light.direction;
      }

      // Calculate diffuse
      // < N, L >
      const numerator = normal.dot(lightDirection);

      if (numerator > 0) {
        // < |N|, |L| >
        const denominator = lightDirection.magnitude(); // |N| will always be 1 because N is a unit vector;
        i += (numerator / denominator) * light.intensity;
      }

      if (sphere.material.specular === -1) return;
      // Calculate Specular
      // R = 2N< N,L > - L

      const reflection = normal
        .scale(2)
        .scale(normal.dot(lightDirection))
        .sub(lightDirection);

      // V = P - O = -D

      {
        const numerator = reflection.dot(view);

        if (numerator > 0) {
          // adasdasd
          // < |N|, |L| >
          const denominator = reflection.magnitude() * view.magnitude();
          i += light.intensity * (numerator / denominator) ** sphere.material.specular;
        }
      }
    });
    return Math.min(i, 1);
  }
}
export default Renderer;
