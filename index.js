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
import Input from "./Input.js";

const canvas = new Canvas("canvas");
const camera = new Camera(canvas, 75, new Vector3(0, 0, -5));
const scene = new Scene();

const input = new Input();

let sphere4;
let sphere3;
let sphere2;
let sphere1;

{
  const position = new Vector3(0, 0, 0);
  const radius = 1;
  const color = new Vector3(255, 0, 255);
  sphere1 = new Sphere(radius, position, new Material(color, 10, 0.2));
  scene.add(sphere1);
}
{
  const position = new Vector3(0, 0, 0);
  const radius = 0.75;
  const color = new Vector3(0, 255, 255);
  sphere2 = new Sphere(radius, position, new Material(color, 10, -0.2));
  scene.add(sphere2);
}
{
  const position = new Vector3(0, 0, 0);
  const radius = 0.5;
  const color = new Vector3(255, 255, 0);
  sphere3 = new Sphere(radius, position, new Material(color, 10, 0.2));
  scene.add(sphere3);
}
{
  const position = new Vector3(0, 0, 0);
  const radius = 1;
  const color = new Vector3(255, 255, 255);
  sphere4 = new Sphere(radius, position, new Material(color, 10, 0.2));
  scene.add(sphere4);
}
{
  const position = new Vector3(0, -1000005, 0);
  const radius = 1000000;
  const color = new Vector3(255, 255, 255);
  scene.add(new Sphere(radius, position, new Material(color, -1, 0)));
}

// scene.add(new PointLight(new Vector3(0, 0, 0), 0.6));
scene.add(new PointLight(new Vector3(0, 5, -5), 0.8));
// scene.add(new DirectionalLight(new Vector3(1, 4, 4), 0.5));
// scene.add(new AmbientLight(0.2));

const renderer = new Renderer(camera, scene, canvas);

const CAMERA_SPEED = 0.3;

let timeSinceLastRender = 0;
const fpsCounter = document.getElementById("fps");
let fpsDisplay = 0;
setInterval(() => {
  fpsCounter.innerText = fpsDisplay;
}, 500);

const pathSize = 3;
const pathSpeed = 0.001;
const render = () => {
  const now = performance.now();
  const delta = now - timeSinceLastRender;
  timeSinceLastRender = now;

  fpsDisplay = Math.round(1 / (delta / 1000));
  camera.position = camera.position.add(
    input.scale(delta * 0.016 * CAMERA_SPEED)
  );

  sphere1.position.y = Math.sin(performance.now() * pathSpeed) * pathSize;
  sphere1.position.x = Math.cos(performance.now() * pathSpeed) * pathSize;

  sphere2.position.y = Math.cos(performance.now() * pathSpeed) * pathSize;
  sphere2.position.z = Math.sin(performance.now() * pathSpeed) * pathSize;

  sphere3.position.x = Math.sin(performance.now() * pathSpeed) * pathSize;
  sphere3.position.z = Math.cos(performance.now() * pathSpeed) * pathSize;

  renderer.render();
  requestAnimationFrame(render);
};
render();

const form = document.getElementById("controls");
form.onchange = (e) => {
  const value = parseFloat(e.target.value);
  switch (e.target.name) {
    case "bounces":
      renderer.bounces = value;
    case "reflectivity":
      sphere1.material.reflective = value;
      sphere2.material.reflective = value;
      sphere3.material.reflective = value;
      sphere4.material.reflective = value;

      break;
    case "specular":
      sphere1.material.specular = value;
      sphere2.material.specular = value;
      sphere3.material.specular = value;
      sphere4.material.specular = value;

      console.log("sphere1.material.reflective", sphere1.material.specular);
      break;
    case "light":
      scene.lights.forEach((light) => {
        light.intensity = value;
      });
  }
};
