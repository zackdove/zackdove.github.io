import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { MeshSurfaceSampler } from '../utils/MeshSurfaceSampler';
import { gsap } from 'gsap';






export class ContactSquare extends THREE.Group {
  constructor(webgl, i, normalKey, url, cubeGltf, plantKeys) {
    super();
    this.webgl = webgl;
    this.active = false;
    this.sampler;
    this.count = 50;
    this.ages = new Float32Array(this.count * 5);
    this.scales = new Float32Array(this.count * 5);
    this._position = new THREE.Vector3();
    this._normal = new THREE.Vector3();
    this._scale = new THREE.Vector3();
    this.dummy = new THREE.Object3D();
    this.index = i;
    this.cubeGltf = cubeGltf;
    this.variables = {
      scaleFactor: 1,
      timeFactor: 1,
    }
    this.url = url;
    this.plants = [];
    this.normalKey = normalKey;
    this.scaleFactors = [];
    this.plantKeys = plantKeys;

    this.mouse = new THREE.Vector2(0, 0);
    this.mouseTarget = new THREE.Vector3(0, 0, 0)
    this.initialise();
  }


  initialise() {

    for (let i = 0; i < this.plantKeys.length; i++) {
      const gltf = assets.get(this.plantKeys[i]);
      this.plants.push(gltf.scene.children[0].clone())
    }
    this.cube = this.cubeGltf.scene.children[0].clone()


    const normal = assets.get(this.normalKey);
    normal.encoding = THREE.LinearEncoding;
    normal.flipY = false;
    normal.wrapS = THREE.ClampToEdgeWrapping;
    normal.wrapT = THREE.ClampToEdgeWrapping;
    normal.repeat.set(7, 7);
    normal.rotation = -Math.PI / 2;
    normal.offset.set(5.25999999046325, -1.7399999419755923)
    normal.needsUpdate = true;
    this.normal = normal;
    this.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color('0xffffff'),
      // map: assets.get(kyubeyKey),
      // bumpMap: bumpMap,
      shininess: 100,
      normalMap: normal,
      // normalMapType: THREE.ObjectSpaceNormalMap,
      normalScale: new THREE.Vector2(-3,3),
      // bumpScale: -1,
    })


    this.cube.material = this.material;
    this.add(this.cube)
    this.cube.lookAt(new THREE.Vector3(0, 0, 0.1))
    this.cube.material.vertexColors = false;

    this.meshes = []

    for (let i = 0; i < this.plants.length; i++) {
      const mesh = new THREE.InstancedMesh(this.plants[i].geometry, this.plants[i].material, this.count);
      this.add(mesh)
      this.meshes.push(mesh)
    }

    this.resample()
    this.active = true;
    this.webgl.hoverables.push(this.cube);
    this.webgl.clickables.push(this.cube);
    this.cube.traverse((child) => {
      child.handleHover = this.handleHover.bind(this);
      child.handleNoHover = this.handleNoHover.bind(this);
      child.handleClick = this.handleClick.bind(this);
    });

  }

  easeOutCubic(t) {
    return (--t) * t * t + 1;
  };


  scaleCurve(t) {
    return Math.abs(this.easeOutCubic((t > 0.5 ? 1 - t : t) * 2)) * this.variables.scaleFactor;
  }

  resampleParticle(i, j) {
    this.sampler.sample(this._position, this._normal);
    this._normal.add(this._position);
    this.dummy.position.copy(this._position);

    this.dummy.scale.set(this.scales[i + j * this.count], this.scales[i + j * this.count], this.scales[i + j * this.count]);
    this.dummy.lookAt(this._normal);
    this.dummy.rotateZ(Math.random() * 3)
    this.dummy.updateMatrix();
    this.meshes[j].setMatrixAt(i, this.dummy.matrix);
    // this.sphereMesh.setMatrixAt(i, this.dummy.matrix);
    // this.cubeMesh.setMatrixAt(i, this.dummy.matrix);
    // TODO TRY A DIFFERENT SHAPE FOR i>25
    // blossomMesh.setMatrixAt( i,this.dummy.matrix );
  }

  updateParticle(i, j) {
    this.ages[i + j * this.count] += 0.005 * this.variables.timeFactor;
    if (this.ages[i + j * this.count] >= 1) {
      this.ages[i + j * this.count] = 0.001;
      this.scales[i + j * this.count] = this.scaleCurve(this.ages[i + j * this.count]) * this.scaleFactors[i + j * this.count];
      this.resampleParticle(i, j);
      return;
    }
    const prevScale = this.scales[i + j * this.count];
    this.scales[i + j * this.count] = this.scaleCurve(this.ages[i + j * this.count]) * this.scaleFactors[i + j * this.count];
    this._scale.set(this.scales[i + j * this.count] / prevScale, this.scales[i + j * this.count] / prevScale, this.scales[i + j * this.count] / prevScale);
    this.meshes[j].getMatrixAt(i, this.dummy.matrix);
    this.dummy.matrix.scale(this._scale);
    this.meshes[j].setMatrixAt(i, this.dummy.matrix);
  }

  resample() {
    this.sampler = new MeshSurfaceSampler(this.cube)
      .setWeightAttribute('color')
      .build();

    for (let j = 0; j < this.meshes.length; j++) {
      for (let i = 0; i < this.count; i++) {
        this.scaleFactors[i + j * this.count] = Math.random() * 1.5 + 0.5;
        this.ages[i + j * this.count] = Math.random();
        this.scales[i + j * this.count] = this.scaleCurve(this.ages[i + j * this.count]) * this.scaleFactors[i + j * this.count];
        this.resampleParticle(i, j);
      }
    }
  }

  dispose() {
    this.active = false;
    console.log('diposing contactsquare')
    for (let i = 0; i < this.plants.length; i++){
      console.log(this.plants[i])
      this.plants[i].removeFromParent();
      this.plants[i].geometry.dispose()
      this.plants[i].material.dispose()
    }
    this.plants = []
    this.webgl.raycastHandler.removeHoverable(this.cube);
    this.webgl.raycastHandler.removeClickable(this.cube);
    this.cube.clear();
    this.cube.removeFromParent();
    this.cube.material.dispose();
    this.cube.geometry.dispose();
    this.normal.dispose();
    this.material = null;
    this.normal = null;
    this.cube = null;
    for (let i = 0; i < this.meshes.length; i++){
      this.meshes[i].removeFromParent();
      this.meshes[i].geometry.dispose()
      this.meshes[i].material.dispose()
    }

    this.meshes = [];
  }

  update(dt, time) {
    // this.rotation.z += dt;
    // this.rotation.y = Math.sin(time)
    // this.rotation.y += dt/3;
    if (this.active) {
      const time = Date.now() * 0.001;
      for (let j = 0; j < this.meshes.length; j++) {
        if (this.meshes[j]) {
          for (let i = 0; i < this.count; i++) {
            this.updateParticle(i, j);
          }
          this.meshes[j].instanceMatrix.needsUpdate = true;
        }
      }
      this.mouseTarget.x += (this.mouse.x - this.mouseTarget.x) * 0.02;
      this.mouseTarget.y += (this.mouse.y - this.mouseTarget.y) * 0.02;
      this.mouseTarget.z = 1;
      this.lookAt(this.mouseTarget)
    }
  }

  onPointerMove(event, { x, y }) {
    var vector = new THREE.Vector3(
      (x / this.webgl.width) * 2 - 1,
      (-y / this.webgl.height) * 2 + 1,
      6
    );
    vector.unproject(this.webgl.camera);
    var dir = vector.sub(this.webgl.camera.position).normalize();
    var distance = - this.webgl.camera.position.z / dir.z;
    var pos = this.webgl.camera.position.clone().add(dir.multiplyScalar(distance));

    this.mouse.set(
      pos.x,
      pos.y,
      pos.z
    )
    if (this.index == 4) {
      // console.log(this.mouse)
    }
  }

  handleHover() {
    gsap.to(this.variables, {
      scaleFactor: 4,
      timeFactor: 0.5
    })
  }

  handleNoHover() {
    gsap.to(this.variables, {
      scaleFactor: 2,
      timeFactor: 1,
    })
  }

  handleClick() {
    window.open(this.url)
  }
}