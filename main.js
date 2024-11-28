import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const canvas = document.querySelector("#c");
const postCard = document.querySelector(".post-card");

const scene = new THREE.Scene();
// scene.background = new THREE.Color().setHex(0x303030);

const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 1000);
camera.position.set(0, 6, 13);
camera.lookAt(0, 5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setClearColor(0x000000, 0); // the default
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

const floorMaterial = new THREE.MeshBasicMaterial();
const textureLoader = new THREE.TextureLoader();
let floor;
textureLoader.load("./assets/wooden_floor.jpg", function (texture) {
  const floorLength = 300;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(floorLength / 8, floorLength / 8);
  floorMaterial.map = texture;
  floorMaterial.needsUpdate = true;

  const planeGeometry = new THREE.PlaneGeometry(floorLength, floorLength);
  floor = new THREE.Mesh(planeGeometry, floorMaterial);
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
let endScene = false;
let endSceneStartTime;
let showPostCard = false;
function animate(time) {
  if (!ballerina) {
    return;
  }

  if (endScene) {
    if (!endSceneStartTime) {
      endSceneStartTime = time;
    }
    if (time <= endSceneStartTime + 1600) {
      camera.rotation.x += 0.005;
      camera.position.y += 0.001;
    } else {
      postCard.classList.toggle("show");
      renderer.setAnimationLoop(null);
      canvas.remove();
    }
  }

  if (showPostCard) {
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
  if (!ballerina) {
    return;
  }
  canvas.style.cursor = "grab";
  isGrabbing = false;
  startOfGrabX = undefined;
  accumRotation += ballerina.rotation.z - startGrabRotation;
  startGrabRotation = ballerina.rotation.z % (2 * Math.PI); // normalize to range [0, 2 * PI]
  if (accumRotation > 6 * Math.PI) {
    endScene = true;
  }
}

canvas.addEventListener("mouseleave", onRelease);

canvas.addEventListener("mouseup", onRelease);
