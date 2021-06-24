import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

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
	const geometry = new THREE.SphereGeometry(1, 15, 15);

	// material
	const material = new THREE.MeshPhongMaterial({ color: 0xFF00FF });

	const lod = new THREE.LOD();
	lod.autoUpdate = false;
	
	function makeInstance(geometry, color) {
		const material = new THREE.MeshPhongMaterial({ color, 
			wireframe: true
		});
		
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);
		
		sphere.position.x = randomInRange(-5,5);
		sphere.position.y = randomInRange(-5,5);
		sphere.position.z = randomInRange(-5,5);
		
		return sphere;
	}
	
	const controls = new FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 0.33;
	controls.rollSpeed = .3;
	controls.autoForward = false;
	
	
	let spheres = [];
	for (let i = 0; i < 30; i++) {
		spheres.push(makeInstance(geometry, 0xff00ff, 0))
		// lod.addLevel( spheres[i], 15 );
	}

	const RED = 0xda0000;
	const GREEN = 0x00da00;
	const BLUE = 0x0000da;

	
	function render(time) {
		time *= 0.0001;

		spheres.forEach((sphere, i) => {
			const speed = 1 + (i / 2) * .1;
			const rot = time * speed;
			// sphere.rotation.x = rot;
			// sphere.rotation.y = rot;

			console.log(sphere.position.distanceTo(camera.position));
			
			const cameraDistance = sphere.position.distanceTo(camera.position);
			if(cameraDistance < 3 ){
				sphere.material.color = new THREE.Color( GREEN )
			} else if (cameraDistance < 6) {
				sphere.material.color = new THREE.Color( BLUE )
			} else {
				sphere.material.color = new THREE.Color( RED )
			}
		});

		controls.update(time / 5);
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();