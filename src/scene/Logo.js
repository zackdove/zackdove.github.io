import * as THREE from 'three'
import glsl from 'glslify'
import assets from '../utils/AssetManager'
import { SVGLoader } from '../utils/SVGLoader'
import { wireValue, wireUniform } from '../utils/Controls'
import { addUniforms, customizeVertexShader } from '../utils/customizeShader'
import { Text } from 'troika-three-text'
import gsap from 'gsap';

// elaborated three.js component example
// containing example usage of
//   - asset manager
//   - control panel
//   - touch events
//   - postprocessing
//   - screenshot saving


// preload the environment map
const hdrKey = assets.queue({
  url: 'assets/ouside-afternoon-blurred-hdr.jpg',
  type: 'env-map',
})

// preload the bridge model
const brokatLogoKey = assets.queue({
  url: 'assets/brokatlogo.svg',
  type: 'svg',
})

export default class Logo extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options
    const self = this;

    const brokatLogoSvg = assets.get(brokatLogoKey)
    console.log(brokatLogoSvg.src);

    const svgLoader = new SVGLoader()
    const envMap = assets.get(hdrKey)
    this.envMap = envMap;
    envMap.wrapS = THREE.RepeatMapping;
    envMap.wrapT = THREE.RepeatMapping;
    envMap.repeat.x = 0.6;
    envMap.repeat.y = 0.6;
    console.log(this.envMap)
    const material = new THREE.MeshBasicMaterial({
      // color: new THREE.Color(0x00ff00),
      side: THREE.DoubleSide,
      opacity: 1,
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.SubtractEquation, //default
      blendSrc: THREE.SrcAlphaFactor, //default
      blendDst: THREE.DstAlphaFactor,
      map: envMap,
      // depthTest: false
    });
    this.material = material;
    console.log(this.material)
    svgLoader.load(brokatLogoSvg.src, function (data) {
      const paths = data.paths;
      const group = new THREE.Group();

      for (let i = 0; i < paths.length; i++) {

        const path = paths[i];



        const shapes = SVGLoader.createShapes(path);

        for (let j = 0; j < shapes.length; j++) {

          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);

        }

      }
      // group.scale.set(1)
      // group.position.set(0, 0 ,0)
      // self.add(group)
    });



    const wavesCPCText = new Text()
    this.wavesCPCText = wavesCPCText;
    this.add(wavesCPCText)
    wavesCPCText.text = 'ZCKD'
    // wavesCPCText.font = 'assets/fonts/wavesCPC/WavesBlackletterCPC-Base.otf'
    wavesCPCText.font = 'assets/fonts/cambridge/Cambridge.otf'
    wavesCPCText.anchorX = 'center';
    wavesCPCText.anchorY = 'middle';
    wavesCPCText.fontSize = 22
    wavesCPCText.sdfGlyphSize = 512
    wavesCPCText.material = material;
    wavesCPCText.position.z = -2
    wavesCPCText.textAlign = 'center'
    wavesCPCText.sync()
    console.log(window.innerWidth / window.innerHeight);
    console.log(789 / 1182)
    if (window.innerWidth / window.innerHeight < 789 / 1182) {
      console.log('she small')
      wavesCPCText.text = 'Z\nC\nK\nD'
      wavesCPCText.fontSize = 10;
      wavesCPCText.sync()
    }

    // const wavesCPCTextShadow = new Text()
    // this.add(wavesCPCTextShadow)
    // wavesCPCTextShadow.text = 'ZCKD'
    // wavesCPCTextShadow.font = 'assets/fonts/wavesCPC/WavesBlackletterCPC-Shadow.otf'
    // wavesCPCTextShadow.anchorX = 'center';
    // wavesCPCTextShadow.anchorY = 'middle';
    // wavesCPCTextShadow.fontSize = 40
    // wavesCPCTextShadow.sdfGlyphSize = 512
    // wavesCPCTextShadow.material = material;
    // wavesCPCTextShadow.material.opacity = 0.3;
    // wavesCPCTextShadow.position.z = -2
    // wavesCPCText.renderOrder = 1;
    // wavesCPCTextShadow.sync()




    // set the background as the hdr
    // this.webgl.scene.background = envMap
  }

  onPointerDown(event, { x, y }) {

  }

  update(dt, time) {
    // this.rotation.y -= dt * 0.2;
    this.envMap.offset.x += dt * 0.05;
    // this.envMap.offset.y -= dt * 0.1;
    // this.envMap.needsUpdate = true;
    // this.material.needsUpdate = true;
    // this.material.envMap.needsUpdate = true;
    // this.wavesCPCText.material.opacity = (Math.sin(time * 2) / 2) + 0.5
    // this.wavesCPCText.material.needsUpdate = true;
    // console.log( this.wavesCPCText.material.opacity)
    // console.log( this.wavesCPCText.material.opacity)
  }
}
