import Canvas from "./Canvas.js";
import Vector3 from "./Vector3.js";
import Camera from "./Camera.js";
import Sphere from "./Sphere.js";
import Material from "./Material.js";
import PointLight from "./PointLight.js";
import DirectionalLight from "./DirectionalLight.js";
import AmbientLight from "./AmbientLight.js";
import Scene from "./Scene.js";
import Renderer from "./Renderer.js";

const canvas = new Canvas("canvas");
const camera = new Camera(canvas);
const scene = new Scene();

let input = new Vector3();

{
  const position = new Vector3(0, -1, 3);
  const radius = 1;
  const color = new Vector3(255, 0, 0);
  scene.add(new Sphere(radius, position, new Material(color)));
}
{
  const position = new Vector3(2, 0, 4);
  const radius = 1;
  const color = new Vector3(0, 0, 255);
  scene.add(new Sphere(radius, position, new Material(color)));
}
{
  const position = new Vector3(-2, 0, 4);
  const radius = 1;
  const color = new Vector3(0, 255, 0);
  scene.add(new Sphere(radius, position, new Material(color)));
}
{
  const position = new Vector3(0, -5001, 4);
  const radius = 5000;
  const color = new Vector3(255, 255, 0);
  scene.add(new Sphere(radius, position, new Material(color)));
}

scene.add(new PointLight(new Vector3(2, 1, 0), 0.8));
scene.add(new DirectionalLight(new Vector3(1, 4, 4), 0.2));
scene.add(new AmbientLight(0.2));

const renderer = new Renderer(camera, scene, canvas);

const CAMERA_SPEED = 0.3;

let timeSinceLastRender = 0;
const fpsCounter = document.getElementById("fps");
let fpsDisplay =0;
setInterval(() => {
  fpsCounter.innerText = fpsDisplay;
}, 500);

const render = (e) => {
  const now = performance.now();
  const delta = now - timeSinceLastRender;
  timeSinceLastRender = now;

  fpsDisplay = Math.round(1 / (delta / 1000));
  camera.position = camera.position.add(
    input.scale(delta * 0.016 * CAMERA_SPEED)
  );

  renderer.render();
  requestAnimationFrame(render);
};
render();

window.addEventListener("keydown", (e) => {
  const forward = e.key === "w" ? 1 : 0;
  const back = e.key === "s" ? 1 : 0;
  const left = e.key === "a" ? 1 : 0;
  const right = e.key === "d" ? 1 : 0;
  const down = e.key === "Shift" ? 1 : 0;
  const up = e.key === " " ? 1 : 0;

  input = new Vector3(right - left, up - down, forward - back);
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
