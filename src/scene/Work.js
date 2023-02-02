import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from '../utils/CSS3DRenderer';
import workSpec from './WorkSpec';

export default class Work extends THREE.Group {
  constructor(webgl) {
    super()
    this.webgl = webgl
    const css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(webgl.width, webgl.height);
    this.css3DRenderer = css3DRenderer;
    this.divs = [];
    this.css3dObjects = [];
    this.camera = webgl.camera.clone();
    document.getElementById('css3DContainer').appendChild(css3DRenderer.domElement);


    this.startY = 0;
    this.prevY = 0;
    // this.initialise();
  }

  initialise() {
    let prevPos = 3
    for (let i = 0; i < workSpec.projects.length; i++) {
      const div = document.createElement('div');
      div.innerHTML = workSpec.projects[i].title;
      const objectCSS = new CSS3DObject(div);
      this.add(objectCSS);
      objectCSS.position.set(Math.random() - 0.5, Math.random() - 0.5, prevPos)
      objectCSS.scale.set(0.01, 0.01, 0.01);
      this.divs.push(div);
      this.css3dObjects.push(objectCSS);
      for (let j = 0; j < workSpec.projects[i].slides.length; j++) {
        let el;
        if (workSpec.projects[i].slides[j].type == 'image') {
          el = document.createElement('img');
          el.src = workSpec.projects[i].slides[j].src;
          el.style.width = workSpec.projects[i].slides[j].width;
        } else if (workSpec.projects[i].slides[j].type == 'video') {
          el = document.createElement('video');
          el.src = workSpec.projects[i].slides[j].src;
          el.style.width = workSpec.projects[i].slides[j].width;
        }
        const objectCSS = new CSS3DObject(el);
        this.add(objectCSS);
        prevPos -= workSpec.projects[i].slides[j].space;
        objectCSS.position.set(1.5 * Math.random() - 0.75, 1.5 * Math.random() - 0.75, prevPos)
        objectCSS.scale.set(0.01, 0.01, 0.01);
        this.divs.push(el);
        this.css3dObjects.push(objectCSS);

      }
      prevPos -= 4;
    }
  }

  switchTo() {
    // this.webgl.orbitControls.enabled = false;
    this.initialise();
    this.webgl.scene.currentScene = 'work'
    this.webgl.cssGroundHandler.render()
    this.webgl.scene.ribbons.moveToFloor()
  }

  dispose() {
    for (let i = 0; i < this.divs.length; i++) {
      this.divs[i].remove();
    }
    this.divs = [];
    for (let i = 0; i < this.css3dObjects.length; i++) {
      this.css3dObjects[i].removeFromParent();
    }
    this.css3dObjects = [];
    this.camera.position.set(0, 0, 6);
    // this.css3DRenderer = null;
    // this.removeFromParent();
  }

  update(dt, time) {
    this.css3DRenderer.render(this.webgl.scene, this.camera)
    for (let i = 0; i < this.divs.length; i++) {
      this.divs[i].style.opacity = 2 / (this.css3dObjects[i].position.z - this.camera.position.z + 2) ** 2;
    }
  }

  onPointerDown(event, { x, y }) {
    this.startX = x;
  }


  onPointerMove(event, { x, y, dragX, dragY }) {

    // Add velocity
    if (this.prevY && dragY) {
      this.camera.position.z += (y - this.prevY) * 0.3;
    }
    this.prevY = y;
  }

  onPointerUp(event, { x, y }) {
    this.startY = 0;
    this.prevY = null;
  }



}