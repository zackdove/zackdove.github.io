
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
		scope.tweening = true;
		const tween = new TWEEN.Tween(scope.camera.position).to({x: x, y: y, z: z}, time).easing(TWEEN.Easing.Quadratic.InOut)
		.onComplete(() => {
			scope.tweening = false;
		});
		scope.xBase = scope.xBase % (2*Math.PI);
		const pivotTween = new TWEEN.Tween(scope).to({xBase: 0}, time).easing(TWEEN.Easing.Quadratic.InOut);
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
		
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		// this.camera.position.z = 1;
		this.camera.lookAt(0,0, -1);
		
		this.scene = new THREE.Scene();
		// this.controls = new ZackControls(this.cameraPivot, this.camera, this.renderer.domElement);
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.autoRotate = true;
		this.controls.autoRotateSpeed = 0.5;
		this.controls.rotateSpeed = -0.3;
		this.controls.enableDamping = true;
		this.controls.target = new THREE.Vector3(0,0,-1);
		this.controls.minDistance = 0.1;
		this.controls.maxDistance = 6;
		// this.controls.maxAzimuthAngle = 1.8;
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
		this.toggleViewBtn1;
		this.toggleViewBtn2;
		this.hoverBtns = [];
		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		// -1 is moving, 0=first view, 1=second view
		this.view = 0;
		this.aboutBtn;
		this.workBtn;
		this.githubBtn;
		this.contactBtn;
		this.codeblogBtn;
		
		this.aboutText;
		this.workText;
		this.githubText;
		this.contactText;
		this.codeblogText;
		
		this.buttonSelected;
		
		this.aboutSelected = false;
		this.workSelected = false;
		this.githubSelected = false;
		this.contactSelected = false;
		this.codeblogSelected = false;
		
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
		
		var zMult = 1;
		if (this.isMobile){
			zMult = 1.5;
		}
		
		if (this.isMobile){
			this.aboutBtn = new THREE.Mesh(new THREE.CubeGeometry(), new THREE.MeshNormalMaterial());
			sketch.scene.add(this.aboutBtn);
			this.aboutBtn.scale.set(zMult, zMult, zMult);
			this.aboutBtn.position.z = 20 * zMult;
			this.aboutBtn.position.x = -3;
			this.aboutBtn.position.y = 5;
			this.hoverBtns.push(this.aboutBtn);
			
			let sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
			this.workBtn = new THREE.Mesh(sphereGeometry, new THREE.MeshNormalMaterial());
			sketch.scene.add(this.workBtn);
			this.workBtn.scale.set(0.8 * zMult,1 * zMult,0.8 * zMult);
			this.workBtn.position.z = 20 * zMult;
			this.workBtn.position.x = 3;
			this.workBtn.position.y = 2;
			this.hoverBtns.push(this.workBtn);
			
			this.githubBtn = new THREE.Mesh(new THREE.TorusGeometry(0.4,0.3, 16,32), new THREE.MeshNormalMaterial());
			sketch.scene.add(this.githubBtn);
			this.githubBtn.scale.set(zMult,zMult,zMult);
			this.githubBtn.position.z = 20* zMult;
			this.githubBtn.position.x = 3;
			this.githubBtn.position.y = 8;
			this.hoverBtns.push(this.githubBtn);
			
			
			this.contactBtn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8), new THREE.MeshNormalMaterial());
			sketch.scene.add(this.contactBtn);
			this.contactBtn.scale.set(zMult,zMult,zMult);
			this.contactBtn.position.z = 20* zMult;
			this.contactBtn.position.x = -3;
			this.contactBtn.position.y = 0;
			this.hoverBtns.push(this.contactBtn);
			
			this.codeblogBtn = new THREE.Mesh(new THREE.TetrahedronGeometry(), new THREE.MeshNormalMaterial());
			sketch.scene.add(this.codeblogBtn);
			this.codeblogBtn.scale.set(zMult,zMult,zMult);
			this.codeblogBtn.position.z = 20* zMult;
			this.codeblogBtn.position.x = 3;
			this.codeblogBtn.position.y = -3;
			this.hoverBtns.push(this.codeblogBtn);
			
			this.fontLoader.load('./fonts/Montserrat_Bold.json',
			function(font){
				sketch.font = font;
				sketch.addText(sketch.githubBtn.position, 1.3 * zMult, -1.3 * zMult, 0* zMult, 0.5* zMult, "github", function(mesh){
					sketch.githubText = mesh;
				}); 
				sketch.addText(sketch.contactBtn.position, 1.5* zMult, 1.3* zMult, 0* zMult, 0.5* zMult, "contact", function(mesh){
					sketch.contactText = mesh;
				}); 
				sketch.addText(sketch.aboutBtn.position, 3.2* zMult, 0* zMult, 0* zMult, 0.5* zMult, "about", function(mesh){
					sketch.aboutText = mesh;
				}); 
				sketch.addText(sketch.workBtn.position, 1.0* zMult, 1.1* zMult, 0* zMult, 0.5* zMult, "work", function(mesh){
					sketch.workText = mesh;
				}); 
				sketch.addText(sketch.codeblogBtn.position, -1.2* zMult, 0* zMult, 0* zMult, 0.5* zMult, "code blog", function(mesh){
					sketch.codeblogText = mesh;
				}); 
			},
			function (xhr){
				// console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			function (err){
				console.log(err);
			}
		);
	} else {
		
		this.aboutBtn = new THREE.Mesh(new THREE.CubeGeometry(), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.aboutBtn);
		this.aboutBtn.scale.set(zMult, zMult, zMult);
		this.aboutBtn.position.z = 20 * zMult;
		this.aboutBtn.position.x = 0;
		this.aboutBtn.position.y = 4;
		this.hoverBtns.push(this.aboutBtn);
		
		let sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
		this.workBtn = new THREE.Mesh(sphereGeometry, new THREE.MeshNormalMaterial());
		sketch.scene.add(this.workBtn);
		this.workBtn.scale.set(0.8 * zMult,1 * zMult,0.8 * zMult);
		this.workBtn.position.z = 20 * zMult;
		this.workBtn.position.x = 2.5;
		this.workBtn.position.y = 1;
		this.hoverBtns.push(this.workBtn);
		
		this.githubBtn = new THREE.Mesh(new THREE.TorusGeometry(0.4,0.3, 16,32), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.githubBtn);
		this.githubBtn.scale.set(zMult,zMult,zMult);
		this.githubBtn.position.z = 20* zMult;
		this.githubBtn.position.x = -5;
		this.githubBtn.position.y = 4;
		this.hoverBtns.push(this.githubBtn);
		
		
		this.contactBtn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.contactBtn);
		this.contactBtn.scale.set(zMult,zMult,zMult);
		this.contactBtn.position.z = 20* zMult;
		this.contactBtn.position.x = 5;
		this.contactBtn.position.y = 4;
		this.hoverBtns.push(this.contactBtn);
		
		this.codeblogBtn = new THREE.Mesh(new THREE.TetrahedronGeometry(), new THREE.MeshNormalMaterial());
		sketch.scene.add(this.codeblogBtn);
		this.codeblogBtn.scale.set(zMult,zMult,zMult);
		this.codeblogBtn.position.z = 20* zMult;
		this.codeblogBtn.position.x = -2.5;
		this.codeblogBtn.position.y = 1;
		this.hoverBtns.push(this.codeblogBtn);
		
		this.fontLoader.load('./fonts/Montserrat_Bold.json',
		function(font){
			sketch.font = font;
			sketch.addText(sketch.githubBtn.position, 1.3 * zMult, 1.5 * zMult, 0* zMult, 0.5* zMult, "github", function(mesh){
				sketch.githubText = mesh;
			}); 
			sketch.addText(sketch.contactBtn.position, 4* zMult, 0* zMult, 0* zMult, 0.5* zMult, "contact", function(mesh){
				sketch.contactText = mesh;
			}); 
			sketch.addText(sketch.aboutBtn.position, 1.0* zMult, -1.5* zMult, 0* zMult, 0.5* zMult, "about", function(mesh){
				sketch.aboutText = mesh;
			}); 
			sketch.addText(sketch.workBtn.position, 1.0* zMult, 1.1* zMult, 0* zMult, 0.5* zMult, "work", function(mesh){
				sketch.workText = mesh;
			}); 
			sketch.addText(sketch.codeblogBtn.position, -1.5* zMult, 0* zMult, 0* zMult, 0.5* zMult, "code blog", function(mesh){
				sketch.codeblogText = mesh;
			}); 
		},
		function (xhr){
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		function (err){
			console.log(err);
		}
	);
}
	
	this.addEvents();
	
}


animate() {
	requestAnimationFrame(this.animate.bind(this));
	TWEEN.update();
	this.render();
	for (let i =0; i<this.rotaters.length; i++){
		if (i % 2 == 0){
			this.rotaters[i].object.rotation.z -= 0.01 * this.rotaters[i].speed;
		} else {
			this.rotaters[i].object.rotation.z += 0.01 * this.rotaters[i].speed;
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
	this.codeblogBtn.rotation.x -= 0.005;
	this.codeblogBtn.rotation.z += 0.003;
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
	
	
	let hasHover = window.matchMedia("(hover: hover)").matches;
	if (hasHover){
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
		const codeblogIntersects = this.raycaster.intersectObject( this.codeblogBtn, true  );
		if (codeblogIntersects.length> 0){
			this.codeblogText.material.opacity = 1;
		} else {
			this.codeblogText.material.opacity = 0;
		}
	}
	
	
}

onMouseMove( event ) {
	// console.log(sketch.mouse.x);
	sketch.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	sketch.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// console.log(sketch.mouse);
}

handleClick(event){
	sketch.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	sketch.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	sketch.raycaster.setFromCamera(sketch.mouse, sketch.camera);
	const toggleView1Intersects = sketch.raycaster.intersectObject( sketch.toggleViewBtn1, true );

	if (toggleView1Intersects.length > 0){
		// console.log("they be intersecting");
		sketch.setView(1);
	}
	const toggleView2Intersects = sketch.raycaster.intersectObject( sketch.toggleViewBtn2, true );

	if (toggleView2Intersects.length > 0){
		// console.log("they be intersecting");
		sketch.setView(-1);
	}
	const aboutIntersects = sketch.raycaster.intersectObject( sketch.aboutBtn, true  );
	if (aboutIntersects.length> 0){
		let aboutModal = document.getElementById('aboutModal');
		aboutModal.classList.add('show');
	} else {
		let aboutModal = document.getElementById('aboutModal');
		aboutModal.classList.remove('show');
	}
	const workIntersects = sketch.raycaster.intersectObject( sketch.workBtn, true  );
	if (workIntersects.length> 0){
		let workModal = document.getElementById('workModal');
		workModal.classList.add('show');
	} else {
		let workModal = document.getElementById('workModal');
		workModal.classList.remove('show');
	}
	const githubIntersects = sketch.raycaster.intersectObject( sketch.githubBtn, true  );
	if (githubIntersects.length> 0){
		let githubModal = document.getElementById('githubModal');
		githubModal.classList.add('show');
	} else {
		let githubModal = document.getElementById('githubModal');
		githubModal.classList.remove('show');
	}
	const contactIntersects = sketch.raycaster.intersectObject( sketch.contactBtn, true  );
	if (contactIntersects.length> 0){
		let contactModal = document.getElementById('contactModal');
		contactModal.classList.add('show');
	} else {
		let contactModal = document.getElementById('contactModal');
		contactModal.classList.remove('show');
	} 
	const codeblogIntersects = sketch.raycaster.intersectObject( sketch.codeblogBtn, true  );
	if (codeblogIntersects.length> 0){
		let codeblogModal = document.getElementById('codeblogModal');
		codeblogModal.classList.add('show');
	} else {
		let codeblogModal = document.getElementById('codeblogModal');
		codeblogModal.classList.remove('show');
	}
	
	
	for (let r of sketch.rotaters){
		const intersects = sketch.raycaster.intersectObject(r.object, true);
		if (intersects.length > 0){
			// r.object.scale.set(2,2,2);
			const rotateTweenDown = new TWEEN.Tween(r).to({speed: 1}, 2000)
			.easing(TWEEN.Easing.Quadratic.Out);
			const rotateTweenUp = new TWEEN.Tween(r).to({speed: 15}, 100)
			.easing(TWEEN.Easing.Quadratic.In)
			.chain(rotateTweenDown)
			rotateTweenUp.start();
		}
	}
}


handleTouchStart(event){

	
	sketch.mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
	sketch.mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
	sketch.raycaster.setFromCamera(sketch.mouse, sketch.camera);
	const toggleView1Intersects = sketch.raycaster.intersectObject( sketch.toggleViewBtn1, true );

	if (toggleView1Intersects.length > 0){
		// console.log("they be intersecting");
		sketch.setView(1);
	}
	const toggleView2Intersects = sketch.raycaster.intersectObject( sketch.toggleViewBtn2, true );

	if (toggleView2Intersects.length > 0){
		// console.log("they be intersecting");
		sketch.setView(-1);
	}
	const aboutIntersects = sketch.raycaster.intersectObject( sketch.aboutBtn, true  );
	const workIntersects = sketch.raycaster.intersectObject( sketch.workBtn, true  );
	const githubIntersects = sketch.raycaster.intersectObject( sketch.githubBtn, true  );
	const contactIntersects = sketch.raycaster.intersectObject( sketch.contactBtn, true  );
	const codeblogIntersects = sketch.raycaster.intersectObject( sketch.codeblogBtn, true  );
	if (aboutIntersects.length> 0){
		if (sketch.aboutSelected){
			let aboutModal = document.getElementById('aboutModal');
			aboutModal.classList.add('show');
		} else {
			sketch.aboutSelected = true;
			sketch.aboutText.material.opacity = 1;
		}
	} else {
		let aboutModal = document.getElementById('aboutModal');
		aboutModal.classList.remove('show');
		sketch.aboutText.material.opacity = 0;
		if (sketch.aboutSelected){
			sketch.aboutSelected = false;
		}
	}
	if (workIntersects.length> 0){
		if (sketch.workSelected){
			let workModal = document.getElementById("workModal");
			workModal.classList.add('show');
		} else {
			sketch.workSelected = true;
			sketch.workText.material.opacity = 1;
		}
	} else {
		let workModal = document.getElementById('workModal');
		workModal.classList.remove('show');
		sketch.workText.material.opacity = 0;
		if (sketch.workSelected){
			sketch.workSelected = false;
		}
	}
	
	if (githubIntersects.length> 0){
		if (sketch.githubSelected){
			let githubModal = document.getElementById("githubModal");
			githubModal.classList.add('show');
		} else {
			sketch.githubSelected = true;
			sketch.githubText.material.opacity = 1;
		}
	} else {
		let githubModal = document.getElementById('githubModal');
		githubModal.classList.remove('show');
		sketch.githubText.material.opacity = 0;
		if (sketch.githubSelected){
			sketch.githubSelected = false;
		}
	}
	
	if (contactIntersects.length> 0){
		if (sketch.contactSelected){
			let contactModal = document.getElementById("contactModal");
			contactModal.classList.add('show');
		} else {
			sketch.contactSelected = true;
			sketch.contactText.material.opacity = 1;
		}
	} else {
		let contactModal = document.getElementById('contactModal');
		contactModal.classList.remove('show');
		sketch.contactText.material.opacity = 0;
		if (sketch.contactSelected){
			sketch.contactSelected = false;
		}
	} 
	
	if (codeblogIntersects.length> 0){
		if (sketch.codeblogSelected){
			let codeblogModal = document.getElementById("codeblogModal");
			codeblogModal.classList.add('show');
		} else {
			sketch.codeblogSelected = true;
			sketch.codeblogText.material.opacity = 1;
		}
	} else {
		let codeblogModal = document.getElementById('codeblogModal');
		codeblogModal.classList.remove('show');
		sketch.codeblogText.material.opacity = 0;
		if (sketch.codeblogSelected){
			sketch.codeblogSelected = false;
		}
	}
	for (let r of sketch.rotaters){
		const intersects = sketch.raycaster.intersectObject(r.object, true);
		if (intersects.length > 0){
			// r.object.scale.set(2,2,2);
			const rotateTweenDown = new TWEEN.Tween(r).to({speed: 1}, 2000)
			.easing(TWEEN.Easing.Quadratic.Out);
			const rotateTweenUp = new TWEEN.Tween(r).to({speed: 15}, 100)
			.easing(TWEEN.Easing.Quadratic.In)
			.chain(rotateTweenDown)
			rotateTweenUp.start();
		}
	}
}


handleTouchMove(){
	
}

addEvents() {
	window.addEventListener("resize", this.resize.bind(this));
	// this.renderer.domElement.addEventListener('pointerdown', sketch.handleClick, false );
	// window.addEventListener( 'mousemove', sketch.onMouseMove, false );
	// window.addEventListener( 'touchstart', sketch.handleTouchStart, false );
	let hasHover = window.matchMedia("(hover: hover)").matches;
	if (hasHover){
		if (window.PointerEvent) {
			this.renderer.domElement.addEventListener('pointerdown', sketch.handleClick, false );
			this.renderer.domElement.addEventListener("pointermove", sketch.onMouseMove, false);
			// domElement.addEventListener("pointermove", onPointerMove, false);
			// domElement.addEventListener("pointerup", onPointerUp, false);
		} else {
			this.renderer.domElement.addEventListener("mousedown", sketch.handleClick, false);
			this.renderer.domElement.addEventListener("mousemove", sketch.onMouseMove, false);
			// domElement.addEventListener("mousemove", onPointerMove, false);
			// domElement.addEventListener("mouseup", onPointerUp, false);
		}
	} else {
		this.renderer.domElement.addEventListener("touchstart", sketch.handleTouchStart, false);
		this.renderer.domElement.addEventListener("touchmove", sketch.onMouseMove, false);
		// domElement.addEventListener("touchmove", onPointerMove, false);
		// domElement.addEventListener("touchend", onPointerUp, false);
	} 
	
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
					
					
					if (sketch.isMobile){
						child.position.z =  z*2;
						child.position.y =  y*1.5;
						child.position.x = x* 0.7;
					} else {
						child.position.z =  z;
						child.position.y =  y;
						child.position.x = x;
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

	
	sketch.controls.autoRotate = false;
	sketch.controls.enabled = false;
	// sketch.controls.minAzimuthAngle = -128;
	// sketch.controls.maxAzimuthAngle = 128;
	var mult1, mult2;
	if (sketch.view == 0){
		mult1 = 1;
		mult2 = 1;
	} else {
		mult1 = -1;
		mult2 = 0;
	}
	sketch.view = -1;
	const cameraRotTweenX1 = new TWEEN.Tween(sketch.controls.target).to({x: 1*mult1}, 500)
	.easing(TWEEN.Easing.Quadratic.In)
	.onComplete(() => {
		cameraRotTweenX2.start();
	}); 
	const cameraRotTweenX2 = new TWEEN.Tween(sketch.controls.target).to({x: 0}, 500)
	.easing(TWEEN.Easing.Quadratic.Out)
	.onComplete(() => {
		
	}); 
	const cameraRotTweenZ = new TWEEN.Tween(sketch.controls.target).to({z: 1*mult1}, 1100)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onComplete(() => {
		// sketch.controls.minAzimuthAngle =  mult1 * + 1.8;
		// sketch.controls.maxAzimuthAngle =  mult1 * - 1.8;
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

setView(val){
	const cameraRotTweenX1 = new TWEEN.Tween(sketch.controls.target).to({x: 1*val}, 500)
	.easing(TWEEN.Easing.Quadratic.In)
	.onComplete(() => {
		cameraRotTweenX2.start();
	}); 
	const cameraRotTweenX2 = new TWEEN.Tween(sketch.controls.target).to({x: 0}, 500)
	.easing(TWEEN.Easing.Quadratic.Out)
	.onComplete(() => {
		
	}); 
	const cameraRotTweenZ = new TWEEN.Tween(sketch.controls.target).to({z: 1*val}, 1100)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onComplete(() => {
		// sketch.controls.minAzimuthAngle =  mult1 * + 1.8;
		// sketch.controls.maxAzimuthAngle =  mult1 * - 1.8;
		sketch.controls.autoRotate = true;
		sketch.controls.enabled = true;
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
	
	// console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	
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
	sketch.animate();
	setTimeout(function(){
		let loadingMessage = document.getElementById("loadingScreen");
		loadingMessage.remove(); 
	}, 3000);
};


THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	
	// console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	
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

});
sketch.addObject('./graphics/spiker.obj', -6, 6, -20, 0.3, false, 1.2, 0.3, 0.3,reflectMaterial, function(r){
	sketch.spiker1 = r;
	sketch.rotaters.push({object: r, speed: 1});
	if (sketch.isMobile){
		r.scale.set(1.5,1.5,1.5);
	}
});
sketch.addObject('./graphics/blobber.obj', 6, 6, -20, 0.7, false, 1.2, 0.3, 0.3,reflectMaterial, function(r){
	sketch.rotaters.push({object: r, speed: 1});
	if (sketch.isMobile){
		r.scale.set(1.5,1.5,1.5);
	}
});
sketch.addObject('./graphics/pickle.obj', 6, -6, -20, 0.5, false, 1.2, 0.3, 0.3, reflectMaterial,function(r){
	sketch.rotaters.push({object: r, speed: 1});
	if (sketch.isMobile){
		r.scale.set(1.5,1.5,1.5);
	}
});
sketch.addObject('./graphics/wings.obj', -6, -6, -20, 4, false, 1.2, 0.3, 0.3,reflectMaterial, function(r){
	sketch.rotaters.push({object: r, speed: 1});
	if (sketch.isMobile){
		r.scale.set(1.5,1.5,1.5);
	}
});
const pinkMaterial = reflectMaterial.clone();
pinkMaterial.color = new THREE.Color(0xffc3e8);
sketch.addObject('./graphics/morecoin.obj', -0, -6, -20, 0.15, false, 0, 0, 0,pinkMaterial, function(r){
	r.rotation.x = Math.PI/2;
	sketch.toggleViewBtn1 = r;
	sketch.toggleViewBtns.push(r);
	sketch.hoverBtns.push( r);
	if (sketch.isMobile){
		r.scale.set(1.5,1.5,1.5);
	}
});
sketch.addObject('./graphics/backcoin.obj', -0, -6, 20, 0.15, false, 0, 0, 0,pinkMaterial, function(r){
	r.rotation.x = Math.PI/2;
	sketch.toggleViewBtns.push(r);
	sketch.toggleViewBtn2 = r;
	sketch.hoverBtns.push( r);
	if (sketch.isMobile){
		r.scale.set(1.5,1.5,1.5);
	}
});

if (navigator.userAgent.includes("Instagram")){
	window.location.href = "/static";
}


sketch.init();

let asciiArt = ":::::::::  .,-:::::  :::  .  :::::::-.  \r\n\'`````;;;,;;;\'````\'  ;;; .;;,.;;,   `\';,\r\n    .n[[\'[[[         [[[[[\/\'  `[[     [[\r\n  ,$$P\"  $$$        _$$$$,     $$,    $$\r\n,888bo,_ `88bo,__,o,\"888\"88o,  888_,o8P\'\r\n `\"\"*UMM   \"YUMMMMMP\"MMM \"MMP\" MMMMP\"` "
console.log("%c" + asciiArt + "\n hire me! zack@zckd.me", 'font-weight: bold; color: pink'); 
// const cuboid = new Cuboid();


function openInfoBtn(){
	let btn = document.getElementById("infoButton");
	btn.classList.add("open");
	let topContainer = document.getElementById("topContainer");
	topContainer.addEventListener('touchstart', function(){
		btn.classList.remove("open");
	}, false);
}

// sketch.controls.init();