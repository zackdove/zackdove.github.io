import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { ContactSquare } from './ContactSquare';

export class Contact extends THREE.Group {
  constructor(webgl) {
    super();
    this.webgl = webgl;
    this.active = false;
  }

  initialise() {
    this.instagramCube = new ContactSquare(this.webgl);
    this.add(this.instagramCube);
    this.active = true;

  }

  dispose() {
    this.active = false;
  }


  switchTo() {
  this.initialise()
  }


  update(dt, time) {
   
    

  }

  onPointerMove(event, { x, y }) {
    
  }
}