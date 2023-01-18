import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { MeshSurfaceSampler } from '../utils/MeshSurfaceSampler';

const cubeKey = assets.queue({
  url: 'assets/models/cube.glb',
  type: 'gltf',
})

export class ContactSquare extends THREE.Group {
  constructor(webgl) {
    super();
    this.webgl = webgl;
    this.active = false;
    this.sampler;
    this.count = 50;
    this.ages = new Float32Array(this.count*2);
    this.scales = new Float32Array(this.count*2);
    this._position = new THREE.Vector3();
    this._normal = new THREE.Vector3();
    this._scale = new THREE.Vector3();
    this.dummy = new THREE.Object3D();

    this.initialise();
  }

  initialise() {
    const cubeGltf = assets.get(cubeKey)
    this.cube = cubeGltf.scene.children[0].clone()
    this.material = new THREE.MeshPhongMaterial({ color: new THREE.Color('0xffffff') })
    this.cube.material = this.material;
    this.add(this.cube)
    this.sphereMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1), new THREE.MeshNormalMaterial(), this.count)
    this.sphereMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.add(this.sphereMesh)
    this.cubeMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshNormalMaterial(), this.count)
    this.cubeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.meshes = [this.sphereMesh, this.cubeMesh]
    this.add(this.cubeMesh)
    this.resample()
    this.active = true;

  }

  easeOutCubic(t) {
    return (--t) * t * t + 1;
  };


  scaleCurve(t) {
    return Math.abs(this.easeOutCubic((t > 0.5 ? 1 - t : t) * 2)) * 2;
  }

  resampleParticle(i, j) {
    this.sampler.sample(this._position, this._normal);
    this._normal.add(this._position);
    this.dummy.position.copy(this._position);
    this.dummy.scale.set(this.scales[i + j * this.count], this.scales[i + j * this.count], this.scales[i + j * this.count]);
    this.dummy.lookAt(this._normal);
    this.dummy.updateMatrix();
    this.meshes[j].setMatrixAt(i, this.dummy.matrix);
    // this.sphereMesh.setMatrixAt(i, this.dummy.matrix);
    // this.cubeMesh.setMatrixAt(i, this.dummy.matrix);
    // TODO TRY A DIFFERENT SHAPE FOR i>25
    // blossomMesh.setMatrixAt( i,this.dummy.matrix );
  }

  updateParticle(i, j) {
    this.ages[i + j * this.count] += 0.005;
    if (this.ages[i + j * this.count] >= 1) {
      this.ages[i + j * this.count] = 0.001;
      this.scales[i+ j * this.count] = this.scaleCurve(this.ages[i+ j * this.count]);
      this.resampleParticle(i, j);
      return;
    }
    const prevScale = this.scales[i + j * this.count];
    this.scales[i + j * this.count] = this.scaleCurve(this.ages[i + j * this.count]);
    this._scale.set(this.scales[i + j * this.count] / prevScale, this.scales[i + j * this.count] / prevScale, this.scales[i + j * this.count] / prevScale);
    this.meshes[j].getMatrixAt(i , this.dummy.matrix);
    this.dummy.matrix.scale(this._scale);
    this.meshes[j].setMatrixAt(i, this.dummy.matrix);
  }

  resample() {
    this.sampler = new MeshSurfaceSampler(this.cube)
      // .setWeightAttribute( 'uv' )
      .build();

    for (let j = 0; j < this.meshes.length; j++) {
      for (let i = 0; i < this.count; i++) {
        this.ages[i + j * this.count] = Math.random();
        this.scales[i + j * this.count] = this.scaleCurve(this.ages[i + j * this.count]);
        this.resampleParticle(i, j);
      }
    }
  }

  dispose() {
    this.active = false;
  }


  switchTo() {

  }


  update(dt, time) {
    if (this.sphereMesh && this.active) {
      const time = Date.now() * 0.001;
      for (let j = 0; j < this.meshes.length; j++) {
        if (this.meshes[j]) {
          for (let i = 0; i < this.count; i++) {
            this.updateParticle(i, j);
          }
          this.meshes[j].instanceMatrix.needsUpdate = true;
        }
      }
    }
  }

  onPointerMove(event, { x, y }) {

  }
}