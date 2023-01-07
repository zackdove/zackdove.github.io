import * as THREE from 'three'
import glsl from 'glslify'
import assets from '../utils/AssetManager'
import { wireValue, wireUniform } from '../utils/Controls'
import { addUniforms, customizeVertexShader } from '../utils/customizeShader'
import Ribbon from './Ribbon'

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

export default class MenuRibbons extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options

    for (let i = 0; i < 5; i++) {
      const ribbon = new Ribbon(webgl);
      ribbon.position.y = i - 2;
      this.add(ribbon)
    }


    this.position.set(0, 0, 0);
  }



  update(dt, time) {

  }



}
