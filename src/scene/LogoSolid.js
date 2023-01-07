import * as THREE from 'three'
import { SubsurfaceScatteringShader } from '../utils/SubsurfaceScatteringShader';
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

// preload the bridge model
const logoKey = assets.queue({
  url: 'assets/logo.glb',
  type: 'gltf',
  // draco: true,
})

const aoKey = assets.queue({
  url: 'assets/logoao.png',
  type: 'texture',
  linear: true, // don't use gamma correction
})

const mapKey = assets.queue({
  url: 'assets/white.jpeg',
  type: 'texture',
})
const hdrKey = assets.queue({
  url: 'assets/ouside-afternoon-blurred-hdr.jpg',
  type: 'env-map',
})




export default class LogoSolid extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options

    const logoGltf = assets.get(logoKey)
    console.log(logoGltf);
    const logo = logoGltf.scene.clone()

    const shader = SubsurfaceScatteringShader;
    const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms['map'].value = assets.get(mapKey);

    uniforms['diffuse'].value = new THREE.Vector3(1.0, 1.0, 1.0);
    uniforms['shininess'].value = 500;
    const aoMap = assets.get(aoKey);
    aoMap.flipY = false;
    uniforms['thicknessMap'].value = aoMap

    uniforms['thicknessColor'].value = new THREE.Vector3(0.5, 0.3, 1.0);
    uniforms['thicknessDistortion'].value = 0.1;
    uniforms['thicknessAmbient'].value = 0.4;
    uniforms['thicknessAttenuation'].value = 0.8;
    uniforms['thicknessPower'].value = 2.0;
    uniforms['thicknessScale'].value = 16.0;

    // const material = new THREE.ShaderMaterial({
    //   uniforms: uniforms,
    //   vertexShader: shader.vertexShader,
    //   fragmentShader: shader.fragmentShader,
    //   lights: true
    // });
    // material.extensions.derivatives = true;



    const envMap = assets.get(hdrKey)
    envMap.wrapS = THREE.RepeatMapping;
    envMap.wrapT = THREE.RepeatMapping;
    envMap.repeat.x = 0.6;
    envMap.repeat.y = 0.6;

    // const material = new THREE.MeshPhysicalMaterial({
    //   color: 0xffffff,
    //   roughness: 0,
    //   envMap: envMap,
    //   metalness: 0,
    //   reflectivity: 1.0,
    //   shininess: 1.0,
    //   clearcoat: 1.0,
    //   // blending: THREE.CustomBlending,
    //   // blendEquation: THREE.SubtractEquation, //default
    //   // blendSrc: THREE.SrcAlphaFactor, //default
    //   // blendDst: THREE.DstAlphaFactor,
    //   transparent: false,
    //   wireframe: false,
    // })

    // const material = new THREE.MeshBasicMaterial({
    //   wireframe: true,
    //   color: 0x00ff00,
    // })


    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        color: {
          value: new THREE.Color("pink")
        },
        mousePos:
          { value: new THREE.Vector3() }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      wireframe: true
    });
    this.material = material;

    logo.traverse((child) => {
      if (child.name === 'Text') {
        console.log('hey yall')
        child.material = material
        child.geometry.computeVertexNormals(true);
        console.log(material)
      } else if (child.name === 'BezierCurve') {
        child.material.envMap = envMap;
        // child.material.blending = THREE.CustomBlending;
        // child.material.blendEquation = THREE.SubtractEquation; //default
        // child.material.blendSrc = THREE.SrcAlphaFactor; //default
        // child.material.blendDst = THREE.DstAlphaFactor;
        child.geometry.computeVertexNormals(true);
        child.geometry.needsUpdate = true;
      }
    })

    // make it a little bigger
    // logo.scale.multiplyScalar(100.2)

    this.add(logo)

    this.logo = logo;

    // set the background as the hdr
    // this.webgl.scene.background = envMap
    this.marker = {
      position: {
        x: 0,
        y: 0,
      }
    }

  }

  update(dt, time) {
    // this.logo.rotation.y = Math.sin(time) * 0.2;
    this.material.uniforms.time.value = time;

    this.marker.position.x = Math.sin(time * 0.5) * 5;
    this.marker.position.y = Math.cos(time * 0.3) * 5;
    this.material.uniforms.mousePos.value.copy(this.marker.position);
  }

  onPointerMove(event, { x, y }) {
    console.log(x)
    // this.rotation.y = (x - window.innerWidth / 2) / window.innerWidth;
    // this.rotation.x = (y - window.innerHeight / 2) / window.innerHeight;

  }


}
