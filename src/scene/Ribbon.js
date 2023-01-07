import * as THREE from 'three'
import glsl from 'glslify'
import assets from '../utils/AssetManager'
import { wireValue, wireUniform } from '../utils/Controls'
import { addUniforms, customizeVertexShader } from '../utils/customizeShader'

// elaborated three.js component example
// containing example usage of
//   - asset manager
//   - control panel
//   - touch events
//   - postprocessing
//   - screenshot saving



const ribbonKey = assets.queue({
  url: 'assets/images/ribbon.png',
  type: 'texture',
})

export default class Ribbon extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options

    const ribbonTexture = assets.get(ribbonKey).clone();
    ribbonTexture.wrapS = ribbonTexture.wrapT = THREE.RepeatWrapping;

    ribbonTexture.wrapS = THREE.RepeatWrapping;
    ribbonTexture.wrapT = THREE.RepeatWrapping;
    ribbonTexture.repeat.set(2, 1)
    ribbonTexture.needsUpdate = true;
    this.texture = ribbonTexture;

    const ribbonGeo = new THREE.PlaneGeometry(12, 1);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: ribbonTexture,
      alphaTest: 0.5,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.add(ribbon)
    const minSpeed = 0.4;
    this.minSpeed = minSpeed;
    const maxSpeed = 0.5;
    this.maxSpeed = maxSpeed;
    this.randSpeed = (Math.random() + minSpeed) * (maxSpeed - minSpeed) * (Math.random() < 0.5 ? -1 : 1);
    this.speed = this.randSpeed;
    this.randomX = 1.0 * Math.random() + 3.5;
    this.randomY = 1.0 * Math.random() + 3.5;
    this.position.set(0, 0, 0);
    this.midX = Math.random()
    this.midY = Math.random()
  }


  onPointerMove(event, { x, y }) {
    this.speed = this.randSpeed * ((0.7 + Math.abs((x - this.webgl.width * this.midX) * this.randomX / this.webgl.width)) * (0.7 + Math.abs((y - this.webgl.height * this.midY) * this.randomY / this.webgl.height)));
  }


  update(dt, time) {
    this.texture.offset.x -= dt * this.speed;
  }



}
