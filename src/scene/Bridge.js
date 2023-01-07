import * as THREE from 'three'
import glsl from 'glslify'
import assets from '../utils/AssetManager'
import { wireValue, wireUniform } from '../utils/Controls'
import { addUniforms, customizeVertexShader } from '../utils/customizeShader'
import { CSS3DRenderer, CSS3DObject } from '../utils/CSS3DRenderer';

// elaborated three.js component example
// containing example usage of
//   - asset manager
//   - control panel
//   - touch events
//   - postprocessing
//   - screenshot saving

// preload the bridge model
const bridgeKey = assets.queue({
  url: 'assets/merged.glb',
  type: 'gltf',
  // draco: true,
})




export default class Bridge extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options

    const bridgeGltf = assets.get(bridgeKey)
    console.log(bridgeGltf);
    const bridge = bridgeGltf.scene.clone()

    bridge.traverse((child) => {
      if (child.name === 'Graffiti-Bridge_1mil_meters') {
        const oldMat = child.material;
        const newMat = new THREE.MeshBasicMaterial({
          map: oldMat.map,
        })
        child.material = newMat;
      }
    })

    const css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    console.log(document);
    console.log(webgl);
    this.css3DRenderer = css3DRenderer;

    const menuPopup = document.createElement('div');
    menuPopup.id = 'menuPopup';
    menuPopup.classList.add('transparent')
    const title = document.createElement('div');
    title.innerHTML = 'Z C K D';
    menuPopup.appendChild(title);
    const sub1 = document.createElement('div');
    sub1.innerHTML = 'Creative Technologist / 3D Designer';
    menuPopup.appendChild(sub1);
    const sub2 = document.createElement('div');
    sub2.innerHTML = 'Website in (Re)Development';
    menuPopup.appendChild(sub2);
    const sub3 = document.createElement('div');
    sub3.innerHTML = '<a href="mailto:zack@zckd.me">zack@zckd.me</a>';
    menuPopup.appendChild(sub3);


    document.getElementById('css3DContainer').appendChild(css3DRenderer.domElement);
    console.log(css3DRenderer.domElement)
    const objectCSS = new CSS3DObject(menuPopup);
    console.log(objectCSS)
    this.add(objectCSS);
    // objectCSS.rotation.set(0, Math.Pi/2, 0)
    objectCSS.position.set(0, 8.3, 0);
    objectCSS.scale.set(0.01, 0.01, 0.01);



    // make it a little bigger
    bridge.scale.multiplyScalar(1.2)

    this.add(bridge)

    // set the background as the hdr
    // this.webgl.scene.background = envMap
  }

  bringToFocus() {
    console.log('hey again')
  }

  onPointerDown(event, { x, y }) {
  }

  update(dt, time) {
    this.rotation.y -= dt * 0.2;
    this.css3DRenderer.render(this.webgl.scene, this.webgl.camera)
  }
}
