import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Floor extends THREE.Mesh{
  constructor(webgl, world) {
    const geometry = new THREE.PlaneGeometry(20, 10)
    const material = new THREE.ShadowMaterial();
    material.opacity = 0.4;
    super(geometry, material)
    this.receiveShadow = true;
    this.shape = new CANNON.Plane()
    this.body = new CANNON.Body({ mass: 0 })
    this.body.addShape(this.shape)
    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    this.body.position.set(0,-3, 0);
    world.addBody(this.body);
   
  }

  update(dt, time) {
    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
  }
}