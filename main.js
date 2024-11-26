import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const canvas = document.querySelector("#c");

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHex(0x303030);

const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 1000);
camera.position.set(0, 8, 14);
camera.lookAt(0, 5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

var floorMaterial = new THREE.MeshBasicMaterial();
var textureLoader = new THREE.TextureLoader();
textureLoader.load("./assets/texture.jpg", function (texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // The texture has loaded, so assign it to your material object. In the
  // next render cycle, this material update will be shown on the plane
  // geometry
  floorMaterial.map = texture;
  floorMaterial.needsUpdate = true;
});
// const planeGeometry = new THREE.PlaneGeometry(200, 200);
// const planeMaterial = new THREE.MeshPhongMaterial({
//   color: 0x0000ff,
//   shininess: 0.5,
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const planeGeometry = new THREE.PlaneGeometry(200, 200);
const plane = new THREE.Mesh(planeGeometry, floorMaterial);
plane.rotation.set(-Math.PI / 2, 0, 0);

// Make use of the `TextureLoader` object to handle asynchronus loading and
// assignment of the texture to your material
scene.add(plane);

var light = new THREE.DirectionalLight(0x00f000);
light.position.set(-10, 10, 10);
light.intensity = 1;
scene.add(light);

var light2 = new THREE.DirectionalLight(0x0000f0);
light2.position.set(10, 10, 10);
light2.intensity = 10;
scene.add(light2);

// var light2 = new THREE.DirectionalLight( 0xff0000 );
// light2.position.set( 0, 1, 1 ).normalize();
// scene.add(light2);

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
        console.log(mesh);
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

function animate() {
  if (ballerina) {
    ballerina.rotation.z += 0.015;
  }
  renderer.render(scene, camera);
}
