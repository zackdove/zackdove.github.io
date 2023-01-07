import * as THREE from 'three'
import MenuDot from './MenuDot';

const sphereGeo = new THREE.SphereGeometry(0.05, 20, 20);
const cylinderGeo = new THREE.CylinderGeometry(0.003, 0.003);
const whiteMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('blue') })
const raycaster = new THREE.Raycaster();
const menuOptions = ['Menu', 'About', 'Play']
const length = 2;

export default class MenuDots extends THREE.Group {
  constructor(webgl) {
    super()
    this.groups = []
    this.webgl = webgl
    this.points = [];
    for (let i = 0; i < menuOptions.length; i++) {
      this.add(new MenuDot(webgl, menuOptions[i]));
    }
  }
  update(dt, time) {
    // for (let i = 0; i < this.groups.length; i++) {
    //   this.groups[i].rotation.x += dt * 0.3;
    //   this.groups[i].rotation.y += dt * 0.3;
    // }
  }

  // onPointerMove(event, { x, y }) {
  //   // for example, check of we clicked on an
  //   // object with raycasting
  //   const coords = new THREE.Vector2().set(
  //     (x / this.webgl.width) * 2 - 1,
  //     (-y / this.webgl.height) * 2 + 1
  //   )
  //   const raycaster = new THREE.Raycaster()
  //   raycaster.setFromCamera(coords, this.webgl.camera)
  //   const hits = raycaster.intersectObjects(this.points, false)

  //   if (hits.length > 0) {
  //     document.body.style = "cursor: pointer"

  //   } else {
  //     document.body.style = "cursor: auto"

  //   }
  //   // this, of course, doesn't take into consideration the
  //   // mesh deformation in the vertex shader
  // }
}