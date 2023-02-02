import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Pill from './Pill';
import Floor from './Floor';
import WorkSingle from './WorkSingle';

export default class WorkPills extends THREE.Group {
  constructor(webgl) {
    super()
    this.webgl = webgl
    this.title = 'WORK'
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);
    this.world.defaultContactMaterial.friction = 1;
    this.pills = [];
    this.position.set(0, 0, -2)
    this.active = false;
    this.floor = new Floor(webgl, this.world);
    this.add(this.floor)
    this.workSingles = [];
    
  }
  initialise() {
  
    for (let i = 0; i < workSpec.projects.length; i++) {
      const workSingle = new WorkSingle(this.webgl, i, this.webgl.cssHandler.css3DRenderer);
      this.workSingles.push(workSingle);
      this.add(workSingle)
      const pill = new Pill(this.webgl, this.world, i)
      this.add(pill)
      this.pills.push(pill);
      pill.initialise()
    }
    this.active = true;
  }
  switchTo() {
    // this.webgl.orbitControls.enabled = false;
    this.initialise();
    this.webgl.scene.ribbons.moveToFloor()
    this.webgl.cssGroundHandler.render()
    document.getElementById('cssGround').classList.add('show')
    this.webgl.scene.currentScene = 'work'
  }

  dispose() {
    this.active = false;
    document.getElementById('cssGround').classList.remove('show')
    console.log(this.pills)
    for (let i = 0; i < this.pills.length; i++){
      this.pills[i].dispose()
    }
    this.pills = []
    for (let i = 0; i < this.workSingles.length; i++){
      this.workSingles[i].dispose()
    }
    this.workSingles = []
  }

  update(dt, time) {
    if (this.active){
    this.world.step(dt);
    }
  }
}