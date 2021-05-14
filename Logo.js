
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
		// scope.domElement.addEventListener('mousemove', this.handleMouseMove, false);
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
		this.renderer.setPixelRatio(window.devicePixelRatio );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xFFFFFF, 1);
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.cameraPivot = new THREE.Object3D();
		this.cameraPivot.position.set(0,0,0);
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		this.cameraPivot.add(this.camera);
		// this.camera.position.y = 10;
		this.camera.lookAt(0,0,0);
		
		this.scene = new THREE.Scene();
		// this.controls = new ZackControls(this.cameraPivot, this.camera, this.renderer.domElement);
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.autoRotate = true;
		this.controls.autoRotateSpeed = 0.5;
		this.controls.enableDamping = true;
		this.controls.minAzimuthAngle = -1.8;
		this.controls.maxAzimuthAngle = 1.8;
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
		this.fontLoader = new THREE.FontLoader();
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
		let cubeLoader = new THREE.CubeTextureLoader(); 
		this.scene.background = cubeLoader.load(this.cubeUrls);
		this.spiker1;
		this.rotaters = [];
		this.isMobile = window.matchMedia("(orientation: portrait)").matches;
		this.toggleViewBtns = [];
		this.hoverBtns = [];
		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		// -1 is moving, 0=first view, 1=second view
		this.view = 0;
		this.aboutBtn;
		this.workBtn;
		this.githubBtn;
		this.contactBtn;
		this.soundcloudBtn;
		
		this.aboutText;
		this.workText;
		this.githubText;
		this.contactText;
		this.soundcloudText;
		
		this.font;
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
		
		this.aboutBtn = new THREE.Mesh(new THREE.CubeGeometry(), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.aboutBtn);
		this.aboutBtn.position.z = 20;
		this.aboutBtn.position.x = -2;
		this.hoverBtns.push(this.aboutBtn);
		
		let sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
		sphereGeometry.scale(1,1.3,1);
		this.workBtn = new THREE.Mesh(sphereGeometry, new THREE.MeshNormalMaterial());
		sketch.scene.add(this.workBtn);
		this.workBtn.position.z = 19;
		this.workBtn.position.x = 3;
		this.workBtn.position.y = 1;
		this.hoverBtns.push(this.workBtn);
		
		this.githubBtn = new THREE.Mesh(new THREE.TorusGeometry(0.4,0.3, 16,32), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.githubBtn);
		this.githubBtn.position.z = 21;
		this.githubBtn.position.x = -3;
		this.githubBtn.position.y = 3;
		this.hoverBtns.push(this.githubBtn);
		
		
		this.contactBtn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.contactBtn);
		this.contactBtn.position.z = 21;
		this.contactBtn.position.x = 5;
		this.contactBtn.position.y = 4;
		this.hoverBtns.push(this.contactBtn);
		
		this.soundcloudBtn = new THREE.Mesh(new THREE.TetrahedronGeometry(), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.soundcloudBtn);
		this.soundcloudBtn.position.z = 21;
		this.soundcloudBtn.position.x = 6;
		this.soundcloudBtn.position.y = -4;
		this.hoverBtns.push(this.soundcloudBtn);
		
		this.fontLoader.load('./fonts/Montserrat_Bold.json',
			function(font){
				sketch.font = font;
				sketch.addText(sketch.githubBtn.position, 1.3, 1.5, 0, 0.5, "github", function(mesh){
					sketch.githubText = mesh;
				}); 
				sketch.addText(sketch.contactBtn.position, 4, 0, 0, 0.5, "contact", function(mesh){
					sketch.contactText = mesh;
				}); 
				sketch.addText(sketch.aboutBtn.position, -1, 0, 0, 0.5, "about", function(mesh){
					sketch.aboutText = mesh;
				}); 
				sketch.addText(sketch.workBtn.position, 3, 0, 0, 0.5, "work", function(mesh){
					sketch.workText = mesh;
				}); 
				sketch.addText(sketch.soundcloudBtn.position, 2, -1.5, 0, 0.5, "soundcloud", function(mesh){
					sketch.soundcloudText = mesh;
				}); 
			},
			function (xhr){
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			function (err){
				console.log(err);
			}
		);
	
	this.addEvents();
	this.animate();
}


animate() {
	requestAnimationFrame(this.animate.bind(this));
	TWEEN.update();
	this.render();
	for (let i =0; i<this.rotaters.length; i++){
		if (i % 2 == 0){
			this.rotaters[i].rotation.z -= 0.01;
		} else {
			this.rotaters[i].rotation.z += 0.01;
		}
	}
	for (let toggleViewBtn of this.toggleViewBtns){
		toggleViewBtn.rotation.z = Math.sin(this.clock.getElapsedTime()*0.5)*0.5;
	}
	this.aboutBtn.rotation.x += 0.01;
	this.aboutBtn.rotation.z -= 0.01;
	this.githubBtn.rotation.x += 0.013;
	this.githubBtn.rotation.y += 0.007;
	this.workBtn.rotation.x += 0.01;
	this.workBtn.rotation.z -= 0.01;
	this.contactBtn.rotation.x += 0.006;
	this.contactBtn.rotation.z -= 0.004;
	this.soundcloudBtn.rotation.x -= 0.005;
	this.soundcloudBtn.rotation.z += 0.003;
}

render() {
	// this.controls.update(this.clock.getDelta());
	this.controls.update();
	// this.controls.update(this.clock.getDelta(), this.clock.getElapsedTime());
	// this.composer.render();
	this.renderer.render(this.scene, this.camera);
	
	this.raycaster.setFromCamera(this.mouse, this.camera);
	if (this.toggleViewBtns.length > 0){
		// console.log(this.arrows.length);
		
		const hoverIntersects = this.raycaster.intersectObjects( this.hoverBtns, true  );
		// console.log(intersects);
		if (hoverIntersects.length > 0){
			this.renderer.domElement.style.cursor = 'pointer';
		} else {
			this.renderer.domElement.style.cursor = 'default';
		}
	}
	const aboutIntersects = this.raycaster.intersectObject( this.aboutBtn, true  );
	if (aboutIntersects.length> 0){
		this.aboutText.material.opacity = 1;
	} else {
		this.aboutText.material.opacity = 0;
	}
	const workIntersects = this.raycaster.intersectObject( this.workBtn, true  );
	if (workIntersects.length> 0){
		this.workText.material.opacity = 1;
	} else {
		this.workText.material.opacity = 0;
	}
	const githubIntersects = this.raycaster.intersectObject( this.githubBtn, true  );
	if (githubIntersects.length> 0){
		this.githubText.material.opacity = 1;
	} else {
		this.githubText.material.opacity = 0;
	}
	const contactIntersects = this.raycaster.intersectObject( this.contactBtn, true  );
	if (contactIntersects.length> 0){
		this.contactText.material.opacity = 1;
	} else {
		this.contactText.material.opacity = 0;
	}
	const soundcloudIntersects = this.raycaster.intersectObject( this.soundcloudBtn, true  );
	if (soundcloudIntersects.length> 0){
		this.soundcloudText.material.opacity = 1;
	} else {
		this.soundcloudText.material.opacity = 0;
	}
	
	
}

onMouseMove( event ) {
	// console.log(sketch.mouse.x);
	sketch.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	sketch.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// console.log(sketch.mouse);
}

handleClick(){
	sketch.raycaster.setFromCamera(sketch.mouse, sketch.camera);
	const toggleViewIntersects = sketch.raycaster.intersectObjects( sketch.toggleViewBtns, true );
	// console.log(sketch.mouse);
	if (toggleViewIntersects.length > 0){
		// console.log("they be intersecting");
		sketch.toggleView();
	}
}

handleTouchStart(e){
	// console.log(e.touches[0]);
	sketch.onMouseMove( e.touches[0] );
	sketch.handleClick();
}


addEvents() {
	window.addEventListener("resize", this.resize.bind(this));
	window.addEventListener( 'mousemove', this.onMouseMove, false );
	window.addEventListener( 'click', this.handleClick, false );
	window.addEventListener( 'touchstart', this.handleTouchStart, false );
}

resize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(width, height);
}

addText(target, x=0, y=0, z=0, scale=1, text="addtext", callback){
	const geometry = new THREE.TextGeometry( text, {
		font: sketch.font,
		size: scale,
		height: 0.05 * scale,
		curveSegments: 12,
	} );
	const material = new THREE.MeshBasicMaterial();
	material.transparent = true;
	material.opacity = 0;
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = target.x + x;
	mesh.position.y = target.y + y -scale/2;
	mesh.position.z = target.z + z;
	mesh.rotateY(Math.PI);
	sketch.scene.add(mesh);
	callback(mesh);
}

addObject(oPath, x=0, y=0, z=0, scale=1, isBlob=false, rotationX=0, rotationY=0,  rotationZ=0, material=null, callback){
	const scene = this.scene;
	this.objLoader.load(
		oPath,
		// called when resource is loaded
		function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					console.log(oPath);
					// child.geometry.center();
					// child.geometry.computeBoundingSphere();
					// const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xec4d32, specular: 0x111111, shininess: 0 } );
					child.castShadow = true;
					child.geometry.scale(scale,scale,scale);
					child.geometry.rotateX(rotationX);
					child.geometry.rotateY(rotationY);
					child.geometry.rotateZ(rotationZ);
					// child.geometry.computeVertexNormals();
					
					
					
					if (material){
						child.material = material;
					} else {
						child.material = new THREE.MeshBasicMaterial();
					}
					sketch.scene.add( child );
					child.position.x = x;
					child.position.y =  y;
					if (sketch.isMobile){
						child.position.z =  z*2;
					} else {
						child.position.z =  z;
					}
					if (callback){
						callback(child);
					}
					
				}
			} );
			
			
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
	
	sketch.controls.autoRotate = false;
	sketch.controls.enabled = false;
	sketch.controls.minAzimuthAngle = -128;
	sketch.controls.maxAzimuthAngle = 128;
	var mult1, mult2;
	if (sketch.view == 0){
		mult1 = 1;
		mult2 = 1;
	} else {
		mult1 = -1;
		mult2 = 0;
	}
	sketch.view = -1;
	const cameraRotTweenX1 = new TWEEN.Tween(sketch.controls.target).to({x: 19*mult1}, 500)
	.easing(TWEEN.Easing.Quadratic.In)
	.onComplete(() => {
		cameraRotTweenX2.start();
	}); 
	const cameraRotTweenX2 = new TWEEN.Tween(sketch.controls.target).to({x: 0}, 500)
	.easing(TWEEN.Easing.Quadratic.Out)
	.onComplete(() => {
		
	}); 
	const cameraRotTweenZ = new TWEEN.Tween(sketch.controls.target).to({z: 19*mult1}, 1100)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onComplete(() => {
		sketch.controls.minAzimuthAngle =  mult1 * + 1.8;
		sketch.controls.maxAzimuthAngle =  mult1 * - 1.8;
		sketch.controls.autoRotate = true;
		sketch.controls.enabled = true;
		sketch.view = mult2;
	}); 
	const cameraPosTween = new TWEEN.Tween(sketch.camera.position).to({x: 0, y: 0, z: 0}, 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onComplete(() => {
		
	}); 
	cameraRotTweenX1.start();
	cameraRotTweenZ.start();
	cameraPosTween.start();
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
const reflectMaterial = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	envMap: sketch.scene.background,
	// combine: THREE.MultiplyOperation,
	reflectivity: 1,
} );
// sketch.addObject('./blobs.obj', 0.1, -2.5, 0.5, 0.9, true);
sketch.addObject('./graphics/blenderting2.obj', 0.0, 0, -20, 2, false, 0,0,0, reflectMaterial,function(r){
	sketch.controls.target = r.position.clone();
});
sketch.addObject('./graphics/spiker.obj', -6, 6, -22, 0.3, false, 1.2, 0.3, 0.3,reflectMaterial, function(r){
	sketch.spiker1 = r;
	sketch.rotaters.push(r);
});
sketch.addObject('./graphics/blobber.obj', 8, 5, -20, 0.7, false, 1.2, 0.3, 0.3,reflectMaterial, function(r){
	sketch.rotaters.push(r);
});
sketch.addObject('./graphics/pickle.obj', 6, -8, -22, 0.5, false, 1.2, 0.3, 0.3, reflectMaterial,function(r){
	sketch.rotaters.push(r);
});
sketch.addObject('./graphics/wings.obj', -13, -12, -26, 4, false, 1.2, 0.3, 0.3,reflectMaterial, function(r){
	sketch.rotaters.push(r);
});
const pinkMaterial = reflectMaterial.clone();
pinkMaterial.color = new THREE.Color(0xffc3e8);
sketch.addObject('./graphics/morecoin.obj', -0, -3, -20, 0.15, false, 0, 0, 0,pinkMaterial, function(r){
	r.rotation.x = Math.PI/2;
	sketch.toggleViewBtns.push( r);
	sketch.hoverBtns.push( r);
});
sketch.addObject('./graphics/backcoin.obj', -0, -3, 20, 0.15, false, 0, 0, 0,pinkMaterial, function(r){
	r.rotation.x = Math.PI/2;
	sketch.toggleViewBtns.push( r);
	sketch.hoverBtns.push( r);
});


sketch.init();

let asciiArt = ":::::::::  .,-:::::  :::  .  :::::::-.  \r\n\'`````;;;,;;;\'````\'  ;;; .;;,.;;,   `\';,\r\n    .n[[\'[[[         [[[[[\/\'  `[[     [[\r\n  ,$$P\"  $$$        _$$$$,     $$,    $$\r\n,888bo,_ `88bo,__,o,\"888\"88o,  888_,o8P\'\r\n `\"\"*UMM   \"YUMMMMMP\"MMM \"MMP\" MMMMP\"` "
console.log("%c" + asciiArt + "\n hire me if you're bad", 'font-weight: bold; color: pink'); 
// const cuboid = new Cuboid();


function openInfoBtn(){
	let btn = document.getElementById("infoButton");
	btn.classList.add("open");
	window.addEventListener('touchstart', function(){
		btn.classList.remove("open");
	}, false);
}

// sketch.controls.init();