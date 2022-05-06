import Canvas from "./Canvas.js";
import { traceRay, computeLighting } from "./quadratic.js";
import Vector3 from "./Vector3.js";

const canvas = new Canvas("canvas");

const FOV = 75;
const viewportDistance = 1 / Math.tan(((FOV / 2) * Math.PI) / 180.0) / 2;
let input = new Vector3();

const camera = {
  position: new Vector3(0, 0, 0),
  viewport: {
    distance: viewportDistance,
    width: 1 * canvas.aspect,
    height: 1,
  },
};

const spheres = [
  {
    position: new Vector3(0, -1, 3),
    radius: 1,
    color: new Vector3(255, 0, 0),
  },
  {
    position: new Vector3(2, 0, 4),
    radius: 1,
    color: new Vector3(0, 0, 255),
  },
  {
    position: new Vector3(-2, 0, 4),
    radius: 1,
    color: new Vector3(0, 255, 0),
  },
  {
    position: new Vector3(0, -5001, 0),
    radius: 5000,
    color: new Vector3(255, 255, 0),
  },
];

const lights = [
  {
    type: "ambient",
    intensity: 0.2,
  },
  {
    type: "point",
    intensity: 0.8,
    position: new Vector3(2, 1, 0),
  },
  {
    type: "directional",
    intensity: 0.2,
    direction: new Vector3(1, 4, 4),
  },
];

const NEAR = 1;
const FAR = Infinity;
const BACKGROUND_COLOR = new Vector3(240, 240, 240);
const CAMERA_SPEED = 0.3;

let timeSinceLastRender = 0;
const render = (e) => {
  const now = performance.now();
  const delta = now - timeSinceLastRender;
  timeSinceLastRender = now;

  camera.position = camera.position.add(
    input.scale(delta * 0.016 * CAMERA_SPEED)
  );

  for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
    for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
      let closestDistance = Infinity;
      let closestSphere = null;
      // D = (V - O)
      const direction = canvas.toViewport(x, y, camera).sub(camera.position);
      spheres.forEach((sphere) => {
        const [t1, t2] = traceRay(x, y, sphere, direction, camera);
        if (t1 > NEAR && t1 < FAR && t1 < closestDistance) {
          closestDistance = t1;
          closestSphere = sphere;
        }
        if (t2 > NEAR && t2 < FAR && t2 < closestDistance) {
          closestDistance = t2;
          closestSphere = sphere;
        }
        if (closestSphere) {
          // Compute intersection
          const point = camera.position.add(direction.scale(closestDistance));
          const lighting = computeLighting(point, closestSphere, lights);
          // console.log('lighting', lighting)
          // console.log('closestSphere', closestSphere.color)
          // const color = closestSphere.color.scale(lighting)
          // console.log('lighting', lighting)
          // console.log('color', color)
          canvas.putPixel(x, y, closestSphere.color.scale(lighting));
        } else {
          canvas.putPixel(x, y, BACKGROUND_COLOR);
        }
      });
    }
  }
  canvas.update();
  console.log("frame");
  requestAnimationFrame(render);
};
render();

window.addEventListener("keydown", (e) => {
  console.log("e.key", e.key);
  const forward = e.key === "w" ? 1 : 0;
  const back = e.key === "s" ? 1 : 0;
  const left = e.key === "a" ? 1 : 0;
  const right = e.key === "d" ? 1 : 0;
  const down = e.key === "Shift" ? 1 : 0;
  const up = e.key === " " ? 1 : 0;

  input = new Vector3(right - left, up - down, forward - back);
  console.log("input", input);
});
window.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") {
    input.z = 0;
  }
  if (e.key === "a" || e.key === "d") {
    input.x = 0;
  }
  if (e.key === " " || e.key === "Shift") {
    input.y = 0;
  }
});
