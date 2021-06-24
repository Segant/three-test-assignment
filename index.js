import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

const RED = 0xda0000;
const GREEN = 0x00da00;
const BLUE = 0x0000da;

function main() {
	const canvas = document.querySelector('#canvas');
	const canvasWidth = canvas.width = window.innerWidth;
	const canvasHeight = canvas.height = window.innerHeight;

	function randomInRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	// renderer
	const renderer = new THREE.WebGLRenderer({ canvas });

	// scene
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xaaaaaa );

	// light
	{
		const color = 0xFFFFFF;
		const intensity = .2;
		const light = new THREE.AmbientLight(color, intensity);
		const light2 = new THREE.PointLight(color, intensity);
		light.position.set(2, 5, 10);
		light2.position.set(2, 5, 10);
		scene.add(light);
		scene.add(light2);
	}

	//camera
	const fov = 90;
	const aspect = canvasWidth / canvasHeight;  // значение для canvas по умолчанию
	const near = 1;
	const far = 40;

	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 3;

	// geometry
	const geometry = new THREE.IcosahedronGeometry( 2,2,2 )

	// material
	const material = new THREE.MeshPhongMaterial({ color: 0xdadada});
	
	const controls = new FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 0.33;
	controls.rollSpeed = .33;
	controls.autoForward = false;
	
	function makeInstance(geometry, material) {
		const materialCopy = material.clone();
		const geometryCopy = geometry.clone();
		
		const lod = new THREE.LOD();
		
		for( let i = 0; i < 3; i++ ) { 
			const geometry = new THREE.IcosahedronGeometry( 1, 3 - i )
			const mesh = new THREE.Mesh( geometry, materialCopy );
			
			lod.addLevel( mesh, i * 5 );
		}
		lod.position.set(
			randomInRange(-15,15),
			randomInRange(-15,15),
			randomInRange(-15,15)
		);
		scene.add( lod );
		
		return lod;
	}


	let spheres = [];
	for (let i = 0; i < 30; i++) {
		spheres.push(makeInstance(geometry, material))
	}

	console.log(spheres);
	
	function render(time) {
		time *= 0.0001;

		spheres.forEach((lod, i) => {
			const cameraDistance = lod.position.distanceTo(camera.position);
			const color = lod.children[0].material.color
			if(cameraDistance < 5){
				color = new THREE.Color( GREEN );
			} else if (cameraDistance < 15) {
				color = new THREE.Color( BLUE )
			} else {
				color = new THREE.Color( RED )
			}
		});

		controls.update(time * .3);
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();