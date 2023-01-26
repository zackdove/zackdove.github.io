import * as THREE from 'three'

export default class RaycastHandler {
  constructor(webgl, hoverables, clickables) {
    this.webgl = webgl;
    this.hoverables = hoverables;
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.clickables = clickables;
  }

  removeHoverable(hoverable) {
    const index = this.hoverables.indexOf(hoverable);
    if (index > -1) {
      this.hoverables.splice(index, 1);
    }
  }

  removeClickable(clickable){
    const index = this.clickables.indexOf(clickable);
    if (index > -1) {
      this.clickables.splice(index, 1);
    }
  }


  handlePointerMove(event, { x, y }) {
    const coords = new THREE.Vector2().set(
      (x / this.webgl.width) * 2 - 1,
      (-y / this.webgl.height) * 2 + 1
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(coords, this.webgl.camera)
    const hits = raycaster.intersectObjects(this.hoverables, true);
    if (hits.length > 0) {
      hits[0].object.handleHover()
      document.body.style = "cursor: pointer"
    } else {
      document.body.style = "cursor: auto"
      for (let i = 0; i < this.hoverables.length; i++) {
        if (this.hoverables[i].handleNoHover) this.hoverables[i].handleNoHover();
      }
      this.webgl.textHandler.clearActive()
    }
  }


  handlePointerDown(event, { x, y }) {
    const coords = new THREE.Vector2().set(
      (x / this.webgl.width) * 2 - 1,
      (-y / this.webgl.height) * 2 + 1
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(coords, this.webgl.camera)
    const hits = raycaster.intersectObjects(this.clickables, true);
    if (hits.length > 0) {
      hits[0].object.handleClick();
    }
  }
}