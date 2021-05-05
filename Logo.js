
ZackControls = function(pivot, camera, domElement) {
	
	this.pivot = pivot;
	this.camera = camera;
	this.domElement = domElement;
	this.enabled = true;
	this.target = new THREE.Vector3();
	this.autoRotate = false;
	this.autoSpeed = 0.2;
	this.damping = true;
	this.dampingFactor = 0.5;
	this.mouseMove = true;
	this.xCurrent = pivot.rotation.x;
	this.yCurrent = pivot.rotation.y;
	this.xBase = pivot.rotation.x;
	this.yBase = pivot.rotation.y;
	this.xMouse = 0.0;
	this.yMouse = 0.0;
	this.tweening = false;
	this.mode = 1;
	this.tweens = [];
	var scope = this;
	this.update = function(delta = 0, time = 0){
		// console.log(delta + "+" + scope.autoSpeed);
		scope.xCurrent += (scope.xMouse-scope.xCurrent) * scope.dampingFactor * delta;
		scope.yCurrent += (scope.yMouse-scope.yCurrent) * scope.dampingFactor * delta;
		
		scope.pivot.rotation.x = scope.yBase + (scope.yCurrent * 1);
		// console.log(scope.autoSpeed * delta);
		if (scope.autoRotate && !this.tweening){
			// console.log(scope.pivot.rotation.y);
			scope.xBase -= scope.autoSpeed * delta;
			scope.pivot.rotation.y = scope.xBase - (scope.xCurrent * 1);
			// console.log(scope.xBase);
			// console.log(scope.pivot.rotation.y);
			// console.log(scope.autoSpeed * delta);
			// scope.camera.position.x += Math.sin(time * scope.autoSpeed)*0.005;
			// scope.camera.position.z += Math.cos(time * scope.autoSpeed)*0.005;
		} else  {
			scope.pivot.rotation.y = scope.xBase - (scope.xCurrent * 1);
			// if (scope.pivot.rotation.y > 0.2){
			// 	scope.pivot.rotation.y = 0.2;
			// }
			// if (scope.pivot.rotation.y < -0.2){
			// 	scope.pivot.rotation.y = -0.2;
			// }
			// if (scope.pivot.rotation.x > 0.2){
			// 	scope.pivot.rotation.x = 0.2;
			// }
			// if (scope.pivot.rotation.x < -0.2){
			// 	scope.pivot.rotation.x = -0.2;
			// }
			if (scope.mode !== 3 || this.tweening){
				scope.camera.lookAt(scope.target);
			}
		}
		// console.log(pivot.rotation.y);
		// console.log(pivot.rotation.x);
		// console.log(scope.xCurrent);
		
		scope.pivot.updateMatrixWorld();
		scope.camera.updateProjectionMatrix();
		
	}
	this.handleMouseMove = function(event){
		// Gets xR and xY in the range -1,1
		scope.xMouse = ((((event.clientX / window.innerWidth)*2)-1)*-1)*0.2;
		scope.yMouse = (((event.clientY / window.innerHeight)*2)-1)*0.2;
		// console.log(scope.camera.rotation.y);
	}
	this.init = function(){
		// console.log("attaching mouse move event");
		scope.domElement.addEventListener('mousemove', this.handleMouseMove, false);
	}
	this.resetTarget = function(time){
		// scope.target.set(0,0,0);
		this.setTarget(0,0,0,time);
	}
	this.setTarget = function(x,y,z,time){
		// scope.tweening = true;
		const tween = new TWEEN.Tween(scope.target).to({x: x, y: y, z: z}, time).easing(TWEEN.Easing.Quadratic.InOut)
		.onComplete(() => {
			// scope.tweening = false;
		}); 
		tween.start();
	}
	this.setCameraPos = function(x,y,z, time){
		console.log(time);
		scope.tweening = true;
		const tween = new TWEEN.Tween(scope.camera.position).to({x: x, y: y, z: z}, time).easing(TWEEN.Easing.Quadratic.InOut)
		.onComplete(() => {
			scope.tweening = false;
		});
		scope.xBase = scope.xBase % (2*Math.PI);
		const pivotTween = new TWEEN.Tween(scope).to({xBase: 0}, time).easing(TWEEN.Easing.Quadratic.InOut);
		console.log(tween);
		tween.start();
		pivotTween.start();
	}
	this.cancelTweens = function(){
		for (const tween of scope.tweens){
			tween.stop();
		}
	}
}

class Sketch {
	constructor() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			canvas: document.getElementById('threeCanvas')
		});
		this.renderer.setPixelRatio(window.devicePixelRatio * 2);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xFFFFFF, 1);
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.cameraPivot = new THREE.Object3D();
		this.cameraPivot.position.set(0,0,0);
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		this.cameraPivot.add(this.camera);
		this.camera.position.z = 0;
		// this.camera.position.y = 10;
		this.camera.lookAt(0,0,0);
		
		this.scene = new THREE.Scene();
		// this.controls = new ZackControls(this.cameraPivot, this.camera, this.renderer.domElement);
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.autoRotate = true;
		this.controls.enableDamping = true;
		this.controls.minAzimuthAngle = -1.8;
		this.controls.maxAzimuthAngle = 1.8
		this.clock = new THREE.Clock();
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
		this.objLoader = new THREE.OBJLoader();
		this.composer;
		// set to 0 to use expanded shape outlining, 1 to use shader outlining, 2 for none
		this.outlineMode = 3;
		this.separateOutlines = false;
		this.outlinePass;
		this.outlinePasses = [];
		this.outlinedObjs = [];
		this.video;
		this.videoTexture;
		this.videoMaterial;
		this.videoObj;
		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.cubeUrls = [
			"./graphics/cubemap/px.png",
			"./graphics/cubemap/nx.png",
			"./graphics/cubemap/py.png",
			"./graphics/cubemap/ny.png",
			"./graphics/cubemap/pz.png",
			"./graphics/cubemap/nz.png",
		];
	}
	
	init() {
		
		this.directionalLight.position.set(1.5, 5, 3)
		this.directionalLight.castShadow = true
		
		// this.controls.lookAt(0,0,0);
		this.scene.add(this.directionalLight)
		const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.0 );
		this.scene.add( hemiLight );
		
		// this.roomMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00, side: THREE.BackSide} );
		
		// const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), new THREE.MeshPhongMaterial({color: 0x0000ff}));
		// console.log(sphereMesh);
		// this.scene.add(sphereMesh);
		let cubeLoader = new THREE.CubeTextureLoader(); 
		this.scene.background = cubeLoader.load(this.cubeUrls);
		
		
		
		this.animate();
	}
	
	
	animate() {
		requestAnimationFrame(this.animate.bind(this));
		TWEEN.update();
		this.render();
	}
	
	render() {
		// this.controls.update(this.clock.getDelta());
		this.controls.update();
		// this.controls.update(this.clock.getDelta(), this.clock.getElapsedTime());
		// this.composer.render();
		this.renderer.render(this.scene, this.camera);
		
		
	}
	
	onMouseMove( event ) {
		sketch.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		sketch.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}
	
	
	
	
	
	addEvents() {
		window.addEventListener("resize", this.resize.bind(this));
	}
	
	resize() {
		let width = window.innerWidth;
		let height = window.innerHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
	
	addObject(oPath, x=0, y=0, z=0, scale=1, isBlob=false, rotation=0){
		const scene = this.scene;
		this.objLoader.load(
			oPath,
			// called when resource is loaded
			function ( object ) {
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						// child.geometry.center();
						// child.geometry.computeBoundingSphere();
						// const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xec4d32, specular: 0x111111, shininess: 0 } );
						child.castShadow = true;
						child.geometry.scale(scale,scale,scale);
						if (rotation !== 0){
							child.geometry.rotateY(rotation);
						}
						// child.geometry.computeVertexNormals();
						
						const phongMaterial = new THREE.MeshBasicMaterial( {
							color: 0xffffff,
							envMap: sketch.scene.background,
							// combine: THREE.MultiplyOperation,
							reflectivity: 1,
						} );
						console.log(phongMaterial);
						child.material = phongMaterial;
						
						console.log(child);
					}
				} );
				sketch.scene.add( object );
				object.position.x = x;
				object.position.y =  y;
				object.position.z =  z;
				sketch.controls.target = object.position;
				
			},
			// called when loading is in progresses
			function ( xhr ) {
				
				// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				
			},
			// called when loading has errors
			function ( error ) {
				
				console.log( error);
				
			}
		)
		
	}
	
	toggleView(){
		console.log("toggling view");
	}
	
	
	
	
}

THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	
};

THREE.DefaultLoadingManager.onLoad = function ( ) {
	
	console.log( 'Loading Complete!');
	let c = document.getElementById("threeCanvas");
	c.style.opacity = 1;
	// let l = document.getElementById("loader");
	// l.style.opacity = 0;
	// setTimeout(function(){
	// 	l.remove();
	// }, 2000)
	let topContainer = document.getElementById("topContainer");
	topContainer.classList.remove("rainbowLoad");
	let loadingMessage = document.getElementById("loadingMessage");
	loadingMessage.remove();
	loadingMessage.innerHTML = "loaded";
};


THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	
};

THREE.DefaultLoadingManager.onError = function ( url ) {
	
	console.log( 'There was an error loading ' + url );
	
};


var sketch = new Sketch();
// sketch.addObject('./blobs.obj', 0.1, -2.5, 0.5, 0.9, true);
sketch.addObject('./graphics/blenderting2.obj', 0.0, 0, -7, 2, false);
sketch.init();
// const cuboid = new Cuboid();

// sketch.controls.init();