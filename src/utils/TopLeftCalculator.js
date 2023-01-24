import * as THREE from 'three'


export default class TopLeftCalculator extends THREE.Plane {
  constructor(webgl) {
    super();
    // These 1s should be the width/height of the rock
    this.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 0.6), new THREE.Vector3(0, 0, 0.6));
    this.raycaster = new THREE.Raycaster();
    this.corner = new THREE.Vector2();
    this.cornerPoint = new THREE.Vector3();
    this.webgl = webgl
  }

  getTopLeftPosition() {
    const circleBBox = document.getElementById('rockCircle').getBoundingClientRect()
    const cX = (((circleBBox.x + circleBBox.width/2) / window.innerWidth) - 0.5) * 2;
    const cY = (((circleBBox.y + circleBBox.height/2) / window.innerHeight) - 0.5) * -2;
    this.corner.set(cX, cY); 
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