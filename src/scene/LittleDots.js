import * as THREE from 'three'

const sphereGeo = new THREE.SphereGeometry(0.03, 20, 20);
const cylinderGeo = new THREE.CylinderGeometry(0.01, 0.01);
const whiteMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x00ff00) })
const raycaster = new THREE.Raycaster();

export default class LittleDots extends THREE.Group {
  constructor(webgl) {
    super()
    const count = 100;
    this.groups = [];
    this.velocities = [];
    for (let i = 0; i < count; i++) {
      const group = new THREE.Group();
      const outerPoint = new THREE.Mesh(sphereGeo, whiteMat);
      outerPoint.position.set(1.5, 0, 0);
      group.add(outerPoint)
      group.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, 0)
      this.add(group)
      this.groups.push(group)
      this.target = new THREE.Quaternion(1, 1, 1, 1);
      this.isSlerping = false;
      this.velocities.push((Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? -1 : 1));
      this.velocities.push((Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? -1 : 1));
      this.slerped = new Array(50).fill(false);
    }
  }
  update(dt, time) {
    if (this.isSlerping) {
      for (let i = 0; i < this.groups.length; i++) {
        if (!this.slerped[i] && this.groups[i].quaternion.angleTo(this.target) > 0.125) {
          this.groups[i].quaternion.slerp(this.target, 0.04)

        } else {
          this.slerped[i] = true

        }
        this.groups[i].rotation.z += Math.sin(time * this.velocities[2 * i] * 10 ) * 0.005;
        this.groups[i].rotation.y += Math.cos(time * this.velocities[2 * i + 1] * 10)  * 0.005;
      }
    }
    else {
      for (let i = 0; i < this.groups.length; i++) {
        this.groups[i].rotation.x += dt * this.velocities[2 * i];
        this.groups[i].rotation.y += dt * this.velocities[2 * i + 1];
      }
    }
  }


  setSlerpTo(quaternion) {
    this.target.copy(quaternion);
    this.isSlerping = true;
  }

  clearSlerp() {
    this.isSlerping = false;
    this.slerped.fill(false)
  }


}