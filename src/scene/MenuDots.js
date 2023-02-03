import * as THREE from 'three'
import MenuDot from './MenuDot';
import { gsap } from "gsap";

export default class MenuDots extends THREE.Group {
  constructor(webgl) {
    super()
    this.groups = []
    this.webgl = webgl
    this.points = [];
    this.scale.set(0,0,0)
    for (let i = 0; i < webgl.scene.sections.length; i++) {
      this.add(new MenuDot(webgl, webgl.scene.sections[i]));
    }
  }


  show(){
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2.5,
    })
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