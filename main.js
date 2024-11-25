import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 
const canvas = document.querySelector( '#c' );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, 2, 0.1, 1000 );
camera.position.set(0, 50, 0)

const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, emmisive: 'purple', shininess: 0.5 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);

var light2 = new THREE.DirectionalLight( 0xff0000 );
light2.position.set( 0, 1, 1 ).normalize();
scene.add(light2);

const loader = new GLTFLoader();

loader.load('./assets/ballerina.glb', function ( object ) {

console.log(object)
/	scene.add( object.scene );

	object.scene.traverse((mesh) => {
	  // You can also check for id / name / type here.
	  mesh.material = new THREE.MeshStandardMaterial({ color: 'blue' });
console.log(mesh)
	});
object.scene.rotation.set(0, 90, 0)

}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.z = 5;
camera.position.y = 0;
camera.position.x = 0;

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}
