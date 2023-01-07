import * as THREE from 'three'


export default class TopLeftCalculator extends THREE.Plane {
  constructor(webgl) {
    super();
    // These 1s should be the width/height of the rock
    this.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1));
    this.raycaster = new THREE.Raycaster();
    this.corner = new THREE.Vector2();
    this.cornerPoint = new THREE.Vector3();
    this.webgl = webgl
  }

  getTopLeftPosition() {
    this.corner.set(-0.85, 0.85); // NDC of the bottom-left corner
    this.raycaster.setFromCamera(this.corner, this.webgl.camera);
    this.raycaster.ray.intersectPlane(this, this.cornerPoint);
    return this.cornerPoint;
  }

  getMidRightPosition(){
    this.corner.set(1, 0); // NDC of the bottom-left corner
    this.raycaster.setFromCamera(this.corner, this.webgl.camera);
    this.raycaster.ray.intersectPlane(this, this.cornerPoint);
    return this.cornerPoint;
  }
}