import AmbientLight from "./AmbientLight.js";
import DirectionalLight from "./DirectionalLight.js";
import PointLight from "./PointLight.js";

class Renderer {
  constructor(camera, scene, canvas, bounces = 3) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
    this.bounces = bounces;
  }

  render() {
    for (let x = -this.canvas.width / 2; x < this.canvas.width / 2; x++) {
      for (let y = -this.canvas.height / 2; y < this.canvas.height / 2; y++) {
        // D = (V - O)
        const direction = this.camera
          .toViewport(x, y)
          .sub(this.camera.position)
          .normalize();
        this.canvas.putPixel(
          x,
          y,
          this.traceRay(this.camera.position, direction, this.bounces)
        );
      }
    }
    this.canvas.update();
  }
  reflectRay(ray, normal) {
    return normal.scale(2).scale(normal.dot(ray)).sub(ray);
  }
  traceRay(position, direction, bounces) {
    let [closestSphere, closestDistance] = this.closestIntersection(
      position,
      direction,
      0.001
    );
    if (closestSphere) {
      const point = position.add(direction.scale(closestDistance));
      const lighting = this.computeLighting(
        point,
        closestSphere,
        direction.scale(-1)
      );
      const localColor = closestSphere.material.color.scale(lighting);

      const reflective = closestSphere.material.reflective;
      if (bounces <= 0 || reflective <= 0) {
        return localColor;
      }

      const reflection = this.reflectRay(
        direction.scale(-1),
        point.sub(closestSphere.position)
      );
      const reflectedColor = this.traceRay(point, reflection, bounces - 1);
      return localColor
        .scale(1 - reflective)
        .add(reflectedColor.scale(reflective));
    } else {
      return this.camera.backgroundColor;
    }
  }

  intersectRaySphere(sphere, direction, origin) {
    // CO = O - C
    const sphereDirection = origin.sub(sphere.position);

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

  closestIntersection(origin, direction, min = 0.001) {
    let closestDistance = Infinity;
    let closestSphere = null;
    this.scene.spheres.forEach((sphere) => {
      const [t1, t2] = this.intersectRaySphere(sphere, direction, origin);
      if (t1 > min && t1 < this.camera.viewport.far && t1 < closestDistance) {
        closestDistance = t1;
        closestSphere = sphere;
      }
      if (t2 > min && t2 < this.camera.viewport.far && t2 < closestDistance) {
        closestDistance = t2;
        closestSphere = sphere;
      }
    });
    return [closestSphere, closestDistance];
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

      const [shadowSphere, shadowDistance] = this.closestIntersection(
        point,
        lightDirection,
        0.001
      );

      // Calculate diffuse
      // < N, L >
      const numerator = normal.dot(lightDirection);

      if (numerator > 0) {
        // < |N|, |L| >
        const denominator = lightDirection.magnitude(); // |N| will always be 1 because N is a unit vector;
        i += (numerator / denominator) * light.intensity;
      }

      // i += currentLightIntensity;

      if (sphere.material.specular > 0) {
        // Calculate Specular
        // R = 2N< N,L > - L

        const reflection = this.reflectRay(lightDirection, normal);
        // V = P - O = -D
        {
          const numerator = reflection.dot(view);

          if (numerator > 0) {
            // < |N|, |L| >
            const denominator = reflection.magnitude() * view.magnitude();
            i +=
              light.intensity *
              (numerator / denominator) ** sphere.material.specular;
          }
        }
      }
      // Shadow distance > 1 means ray went past the light
      if (shadowSphere !== null && shadowDistance < 1) {
        i *= 1 / Math.max((1 / lightDirection.magnitude()) * 30, 1);
      }
    });

    return Math.min(i, 1);
  }
}
export default Renderer;
