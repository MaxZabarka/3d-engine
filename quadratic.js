import PointLight from "./PointLight.js";
import AmbientLight from "./AmbientLight.js";
import DirectionalLight from "./DirectionalLight.js";

const traceRay = (sphere, direction, camera) => {
  // CO = O - C
  const sphereDirection = camera.position.sub(sphere.position);

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
};

const computeLighting = (point, sphere, scene) => {
  let i = 0;
  // N = (P - C) / (| P - C |)
  const normal = point.sub(sphere.position).normalize();
  scene.lights.forEach((light) => {
    let lightDirection;
    if (light instanceof AmbientLight) {
      i += light.intensity;
      return;
    } else if (light instanceof PointLight) {
      lightDirection = light.position.sub(point);
    } else if (light instanceof DirectionalLight) {
      lightDirection = light.direction;
    }

    // < N, L >
    const numerator = normal.dot(lightDirection);

    if (numerator > 0) {
      // < |N|, |L| >
      const denominator = lightDirection.magnitude(); // |N| will always be 1 because N is a unit vector;
      i += (numerator / denominator) * light.intensity;
    }
  });
  return Math.min(i, 1);
};

export { computeLighting, traceRay };
