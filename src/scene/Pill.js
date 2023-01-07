import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { gsap } from "gsap";
import TopLeftCalculator from '../utils/TopLeftCalculator';
import assets from '../utils/AssetManager'

const radius = 0.6;

const pillKey = assets.queue({
  url: 'assets/models/pill.glb',
  type: 'gltf',
})

export default class Pill extends THREE.Group {
  constructor(webgl, world, index) {
    super()
    this.active = false;
    this.index = index;
    this.webgl = webgl;
    this.world = world;
  }

  initialise(){
    const pillGltf = assets.get(pillKey)
    this.pill = pillGltf.scene.clone()
    this.add(this.pill)
    this.castShadow = true;
    const positionRadius = 9 + Math.random() * 10;
    const positionAngle = - Math.PI / 2 + Math.random() * 1 * Math.PI;
    this.cylinderShape = new CANNON.Cylinder(radius, radius, 0.5, 8)
    this.sphereShape = new CANNON.Sphere(radius)
    
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(
        Math.sin(positionAngle) * positionRadius,
        Math.cos(positionAngle) * positionRadius,
        (Math.random() - 0.5) * 5,
      ),
      // shape: new CANNON.Cylinder(radius, radius, 0.2, 8),
      shape: this.sphereShape
    });


    this.body.angularVelocity.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,);
    this.body.angularDamping = 0.1;
    this.body.linearDamping = 0.1;
    this.world.addBody(this.body);
    // 0 = center, 1 = down, 2 = right;
    this.mode = 0;
    webgl.hoverables.push(this.pill);
    webgl.clickables.push(this.pill);
    this.pill.traverse((child) => {
      if (child.material){
        child.castShadow = true;
        if (workSpec.projects[this.index].colour){
          // child.material.color = workSpec.projects[this.index].colour
          child.material = child.material.clone()
          child.material.color = new THREE.Color(workSpec.projects[this.index].colour)
        }
      }
      child.handleHover = this.handleHover.bind(this);
      child.handleNoHover = this.handleNoHover.bind(this);
      child.handleClick = this.handleClick.bind(this);
    })
    this.topLeftCalculator = new TopLeftCalculator(webgl);
    this.midRightPosition = this.topLeftCalculator.getMidRightPosition().clone();
    this.active = true;
  }

  update(dt, time) {
    if (this.active){
    if (this.mode === 2) {
      this.body.position.copy(this.position);
      this.body.quaternion.copy(this.quaternion);
      this.rotation.y = Math.sin(time)/4
    } else {
      this.position.copy(this.body.position);
      this.quaternion.copy(this.body.quaternion);
      if (this.mode === 0) {
        this.body.force.set(-this.body.position.x, -this.body.position.y, -this.body.position.z)
      } else {
        this.body.force.set(-this.body.position.x / 5, -9, -this.body.position.z / 5)
      }
    }
  }
  }

  handleHover() {
    if (this.active){
    this.body.linearDamping = 0.99;
    }
  }

  handleNoHover() {
    if (this.active){
    if (this.mode === 1) {
      this.body.linearDamping = 0.8;
    } else {
      this.body.linearDamping = 0.1;
    }
  }
  }

  drop() { 
    this.webgl.scene.work.workSingles[this.index].dispose();
    this.mode = 1;
    this.body.addShape(this.cylinderShape)
    this.body.removeShape(this.sphereShape);
    this.body.linearDamping = 0.8;
  }

  resize({ width, height, pixelRatio }) {
    this.midRightPosition.copy(this.topLeftCalculator.getMidRightPosition());
  }

  float() {
    this.webgl.scene.work.workSingles[this.index].dispose();
    setTimeout(() => {
      if (this.mode == 0 && Math.random() > 0.5) {
        this.body.addShape(this.sphereShape);
        this.body.removeShape(this.cylinderShape)
      }
    }, 1000)

    this.mode = 0;
    this.body.linearDamping = 0.1;
    this.body.angularVelocity.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,);
  }

  moveToRight() {
    this.mode = 2;
    this.body.addShape(this.cylinderShape)
    this.body.removeShape(this.sphereShape);
    this.midRightPosition.copy(this.topLeftCalculator.getMidRightPosition());
    // this.position.copy(this.cornerPosition);
    gsap.to(this.position, {
      x: this.midRightPosition.x,
      y: this.midRightPosition.y,
      z: this.midRightPosition.z + 2,
    })
    gsap.to(this.scale, {
      x: 2,
      y: 2,
      z: 2,
    })
    gsap.to(this.rotation, {
      x: Math.PI/2,
      y: 0,
      z: 0.5,
    })
  }

  removeFocus() {
    if (this.active){
    this.body.addShape(this.cylinderShape)
    this.body.removeShape(this.sphereShape);
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
    })
  }
  }

  loadWorkSingle(){
    this.webgl.scene.work.workSingles[this.index].initialise();
  }

  handleClick() {

    for (let i = 0; i < this.webgl.scene.work.pills.length; i++) {
      if (this.webgl.scene.work.pills[i] !== this) {
        if (this.mode === 0) {
          this.webgl.scene.work.pills[i].drop()
          this.webgl.scene.work.pills[i].removeFocus()
        } else if (this.mode === 1) {
          this.webgl.scene.work.pills[i].drop()
          this.webgl.scene.work.pills[i].removeFocus()
        } else if (this.mode === 2) {
          this.webgl.scene.work.pills[i].removeFocus()
          this.webgl.scene.work.pills[i].float()
        }
      }
    }
    if (this.mode === 0 || this.mode === 1) {
      this.moveToRight()
      this.loadWorkSingle();
    } else if (this.mode === 2) {
      this.removeFocus()
      this.float()
    }
  }

  dispose(){
    this.active = false;
    this.pill.removeFromParent();
    this.pill = null;
    this.body.removeShape(this.sphereShape);
    this.sphereShape = null;
    this.body.removeShape(this.cylinderShape);
    this.cylinderShape = null;
    this.world.removeBody(this.body);
    this.body = null;
  }
}