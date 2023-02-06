import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from '../utils/CSS3DRenderer';
import workSpec from './WorkSpec';


export default class WorkSingle extends THREE.Group {
  constructor(webgl, workIndex, css3DRenderer) {
    super()
    this.webgl = webgl
    this.css3DRenderer = css3DRenderer;
    this.divs = [];
    this.css3dObjects = [];
    this.camera;

    this.active = false;
    this.workIndex = workIndex;
    this.startY = 0;
    this.prevY = 0;
    this.velocity = 0;
    this.xyVelocity = {
      x: 0,
      y: 0,
    }
    // this.initialise();
    this.maxZ = 0;
    this.prevX = 0;
    this.webgl.cssHandler.scene.add(this)
    this.startX;
    this.startY;
    this.isDragging = false;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseTarget = new THREE.Vector3(0, 0, 0)
  }

  initialise() {
    console.log('initialising work single')
    let prevPos = 3
    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.set(0, 0, 6)
    const div = document.createElement('div');
    div.innerHTML = workSpec.projects[this.workIndex].title;
    div.classList.add('SLAG')
    const objectCSS = new CSS3DObject(div);
    this.add(objectCSS);
    objectCSS.position.set(Math.random() - 0.5, Math.random() - 0.5, prevPos)
    objectCSS.scale.set(0.01, 0.01, 0.01);
    this.divs.push(div);
    this.css3dObjects.push(objectCSS);
    for (let j = 0; j < workSpec.projects[this.workIndex].slides.length; j++) {
      let el;
      if (workSpec.projects[this.workIndex].slides[j].type == 'image') {
        el = document.createElement('img');
        el.src = workSpec.projects[this.workIndex].slides[j].src;
        el.style.width = workSpec.projects[this.workIndex].slides[j].width;
      } else if (workSpec.projects[this.workIndex].slides[j].type == 'video') {
        el = document.createElement('video');
        el.controls = false;
        el.playsInline = true;
        el.playsinline = true;
        el.muted = true;
        el.autoplay = true;
        el.onload = () => {el.play()}
        el.src = workSpec.projects[this.workIndex].slides[j].src;
        el.style.width = workSpec.projects[this.workIndex].slides[j].width;
        el.addEventListener('pointerdown', () => {
          console.log('pointerdown');
        })
      }
      el.style.width = '200px'
      const objectCSS = new CSS3DObject(el);
      this.add(objectCSS);
      prevPos -= workSpec.projects[this.workIndex].slides[j].space;
      if (j === workSpec.projects[this.workIndex].slides.length - 1 ){
        // Make last one closer to middle
        objectCSS.position.set(0.75 * Math.random() - 0.325, 0.75 * Math.random() - 0.325, prevPos)
      } else {
        objectCSS.position.set(1.5 * Math.random() - 0.75, 1.5 * Math.random() - 0.75, prevPos)
      }
      objectCSS.scale.set(0.004, 0.004, 0.004);
      this.divs.push(el);
      this.css3dObjects.push(objectCSS);

    }
    this.position.z = -6;
    this.webgl.cssHandler.scene.add(this)
    this.maxZ = prevPos;
    console.log(this.maxZ)
    this.active = true;
    // ADD wheel event listener
    this.handleWheel = this.handleWheel.bind(this)
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    document.body.addEventListener('wheel', this.handleWheel);
    document.body.addEventListener('pointermove', this.handlePointerMove);
    document.body.addEventListener('pointerdown', this.handlePointerDown);
    document.body.addEventListener('pointerup', this.handlePointerUp);
    this.handleDeviceOrientation = this.handleDeviceOrientation.bind(this)
    if (this.webgl.useAccelerometer) {
      window.addEventListener('deviceorientation', this.handleDeviceOrientation);
    }


  }

  handlePointerDown(event){
    event.preventDefault()
    this.isDragging = true
    this.startX = event.offsetX
    this.startY = event.offsetY
  }

  handlePointerUp(event){
    this.startY = 0;
    this.prevY = null;
    this.isDragging = false;
  }

  handlePointerMove(event){
    event.preventDefault()
    const position = {
      x: event.offsetX,
      y: event.offsetY,
      ...(this.startX !== undefined && { dragX: event.offsetX - this.startX }),
      ...(this.startY !== undefined && { dragY: event.offsetY - this.startY }),
    }
    if (this.active) {
      // Add velocity
      if (this.prevX){
        this.xyVelocity.x += (position.x - this.prevX) * 0.00004;
      }
      this.prevX = position.x;
      if (this.prevY){
        this.xyVelocity.y += (position.y - this.prevY) * 0.00004;
      }
      if (this.prevY && position.dragY && this.isDragging) {
        // this.camera.position.z += (y - this.prevY) * 0.3;
        // if (this.camera.position.z < 6 + 1){
        this.velocity += (position.y - this.prevY) * 0.008
        // }
      }
      this.prevY = position.y;
    }
  }

  handleDeviceOrientation(event){
    this.position.x = event.gamma / 80
    this.position.y =( -event.beta / 160) + 0
  }


  handleWheel(event){
    this.velocity += event.deltaY * 0.0008
  }

  switchTo() {
    // this.webgl.orbitControls.enabled = false;
    this.initialise();
    this.webgl.scene.currentScene = 'work'
    this.webgl.scene.ribbons.moveToFloor() 
    if (this.webgl.isTouch){
      this.webgl.textHandler.changeTo('WORK')
    }
  }

  dispose() {
    this.active = false;
    this.camera = null;
    for (let i = 0; i < this.divs.length; i++) {
      this.divs[i].remove();
    }
    this.divs = [];
    for (let i = 0; i < this.css3dObjects.length; i++) {
      this.css3dObjects[i].removeFromParent();
    }
    this.css3dObjects = [];
    // this.css3DRenderer = null;
    // this.removeFromParent();
    this.camera = null;
    document.body.removeEventListener('wheel', this.handleWheel);
    document.body.removeEventListener('pointermove', this.handlePointerMove);
    document.body.removeEventListener('pointerdown', this.handlePointerDown);
    document.body.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('deviceorientation', this.handleDeviceOrientation);
  }

  update(dt, time) {
    if (this.active) {
      
      for (let i = 0; i < this.divs.length; i++) {
        this.divs[i].style.opacity = (2 / (-this.position.z - this.css3dObjects[i].position.z - 3) ** 4) - 0.1;
      }
      this.velocity *= 0.8;
      // console.log(this.camera.position.z)
      this.position.z += this.velocity;
      if (this.position.z <- 7) {
        this.position.z = -7
        this.velocity = 0;
      } else if (this.position.z >- this.maxZ + 3) {
        this.position.z = -this.maxZ + 3;
        this.velocity = 0;
      } else if (this.position.z <- 6) {
        this.velocity += 0.05;
      } else if (this.position.z >- this.maxZ - 2) {
        this.velocity -= 0.05;
      }
      // XY Movement
      this.xyVelocity.x *= 0.9;
      this.xyVelocity.y *= 0.9;
      this.position.x += this.xyVelocity.x;
      this.position.y -= this.xyVelocity.y;

    }
  }


}