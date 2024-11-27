import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const canvas = document.querySelector("#c");

const scene = new THREE.Scene();
// scene.background = new THREE.Color().setHex(0x303030);

const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 1000);
camera.position.set(0, 6, 13);
camera.lookAt(0, 5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setClearColor(0x000000, 0); // the default
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

var floorMaterial = new THREE.MeshBasicMaterial();
var textureLoader = new THREE.TextureLoader();
textureLoader.load("./assets/texture.jpg", function (texture) {
  const floorLength = 300;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(floorLength / 8, floorLength / 8);
  floorMaterial.map = texture;
  floorMaterial.needsUpdate = true;

  const planeGeometry = new THREE.PlaneGeometry(floorLength, floorLength);
  const floor = new THREE.Mesh(planeGeometry, floorMaterial);
  floor.rotation.set(-Math.PI / 2, 0, 0);

  scene.add(floor);
});

// const planeGeometry = new THREE.PlaneGeometry(200, 200);
// const planeMaterial = new THREE.MeshPhongMaterial({
//   color: 0x0000ff,
//   shininess: 0.5,
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);

var inFrontLeftLight = new THREE.DirectionalLight(0x886eff);
inFrontLeftLight.position.set(-20, 10, 10);
inFrontLeftLight.intensity = 2;
scene.add(inFrontLeftLight);

var inFrontRightLight = new THREE.DirectionalLight(0xe0b4fa);
inFrontRightLight.position.set(14, 10, 10);
inFrontRightLight.intensity = 4;
scene.add(inFrontRightLight);

const behindLight = new THREE.PointLight(0xfff, 10, 0);
behindLight.position.set(0, 10, -5);
behindLight.intensity = 1000;
scene.add(behindLight);

const gltfLoader = new GLTFLoader();

let ballerina;
gltfLoader.load(
  "./assets/ballerina.glb",
  function (object) {
    ballerina = object.scene;

    var objBbox = new THREE.Box3().setFromObject(ballerina);

    // Geometry vertices centering to world axis
    var bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
    bboxCenter.multiplyScalar(-1);

    object.scene.traverse((mesh) => {
      // You can also check for id / name / type here.
      mesh.material = new THREE.MeshStandardMaterial();
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.translate(
          bboxCenter.x - 0.46,
          bboxCenter.y,
          bboxCenter.z,
        );
      }
    });
    objBbox.setFromObject(ballerina); // Update the bounding box

    ballerina.rotation.set(-Math.PI / 2, 0, 0);
    ballerina.position.y = 5;

    scene.add(ballerina);
    const boxHelper = new THREE.BoxHelper(ballerina, 0xffff00);
    // scene.add(boxHelper);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

let startGrabRotation = 0;
let accumRotation = 0;
function animate() {
  // if (ballerina) {
  // ballerina.rotation.z += 0.015;
  // }
  if (!ballerina) {
    return;
  }

  if (startOfGrabX) {
    const grabDiff = currentGrabX - startOfGrabX;
    const rotateAngle = (grabDiff * 2 * Math.PI) / canvas.offsetWidth;

    ballerina.rotation.z = rotateAngle + startGrabRotation;
    triggerRotation = false;
  }

  renderer.render(scene, camera);
}

let isGrabbing = false;
canvas.style.cursor = "grab";
let startOfGrabX;
let currentGrabX;
let triggerRotation = false;

canvas.addEventListener("mousedown", (e) => {
  if (!isGrabbing) {
    startOfGrabX = e.clientX;
  }
  canvas.style.cursor = "grabbing";
  isGrabbing = true;
});
canvas.addEventListener("mousemove", (e) => {
  currentGrabX = e.clientX;
});

function onRelease() {
  canvas.style.cursor = "grab";
  isGrabbing = false;
  startOfGrabX = undefined;
  if (ballerina) {
    startGrabRotation = ballerina.rotation.z % (2 * Math.PI);
    accumRotation += startGrabRotation;
    console.log("a", (360 * accumRotation) / (2 * Math.PI));
  }
}

canvas.addEventListener("mouseleave", onRelease);

canvas.addEventListener("mouseup", onRelease);
