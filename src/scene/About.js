import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { generate4StripeTexture, generateFaceTexture } from '../utils/stripeTexture';

import vertexShader from '../shaders/face/vertex.vert'
import fragmentShader from '../shaders/face/fragment.frag'

const displacementKey = assets.queue({
  url: 'assets/images/face/displacement.exr',
  type: 'exr',
})

const normalsKey = assets.queue({
  url: 'assets/images/face/normal.png',
  type: 'texture',
})

const white = '#ffffff'
const grey = '#f2f2f2'
const blue = '#0000ff'
const yellow = '#ffff00'
const pink = '#ff00ff'
const green = '#00ee33'
const red = '#ff3810'
const black = '#000000'
const transparent = 'rgba(225,225,225,0.0)';

const colours = {
  bg: transparent,
  text: blue,
  bg2: blue,
  text2: green,
  bg3: pink,
  text3: blue,
  bg4: blue,
  text4: green,
  bg5: pink,
  text5: green,
  bg6: blue,
  text6: green,
  bg7: green,
  text7: blue,
  bg8: blue,
  text8: green,
};


// const colours = {
//   bg: transparent,
//   text: blue,
//   bg2: blue,
//   text2: green,
//   bg3: transparent,
//   text3: blue,
//   bg4: transparent,
//   text4: pink,
//   bg5: pink,
//   text5: green,
//   bg6: blue,
//   text6: green,
//   bg7: transparent,
//   text7: blue,
//   bg8: blue,
//   text8: green,
// };

const text = [
  'ZCKD ZCKD ZCKD ZCKD',
  'LONDON BASED',
  'CREATIVE',
  'TECHNOLOGIST',
  '↑→↓←↑→↓←↑→↓←',
  'WEB XR 3D WEB',
  '3D WEB XR 3D',
  'XR 3D WEB XR',
]

export class About extends THREE.Group {
  constructor(webgl) {
    super();
    this.webgl = webgl;
    this.title = 'ABOUT';
    this.active = false;
    this.rotationCoords = {
      x: 0,
      y: 0,
    }
    this.targetCoords = {
      x: 0,
      y: 0,
    }
    this.velocity = 0;
    this.scrollAmount = -1;
  }

  initialise() {
    // this.texture = new THREE.Texture(generate4StripeTexture('ZCKD ', colours))
    this.texture = new THREE.Texture(generateFaceTexture(text, colours ) )
    this.texture.encoding = THREE.sRGBEncoding;
    this.texture.needsUpdate = true
    this.texture.wrapS = THREE.MirroredRepeatWrapping
    // WrapT is vertical
    // this.texture.wrapT = THREE.RepeatWrapping
    // this.texture.offset.y = 10;
    this.texture.repeat.set(3, 6/7)
    this.texture.offset.x = -1;
    this.texture.anisotropy = 2
    

    this.displacementMap = assets.get(displacementKey);
    this.normalsMap = assets.get(normalsKey);

    this.gridMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: `#extension
        GL_OES_standard_derivatives : enable`
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {value: 0},
        uSpeed: {value: 0.2},
        resolution: { value: new THREE.Vector4() },
        colorA: { value: new THREE.Vector3(1, 1, 0.1) },
        colorB: { value: new THREE.Vector3(1, 0.1, 1) },
      },
      wireframe: true,
      // transparent: true,
      vertexShader,
      fragmentShader,
    })

    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;


    this.material = new THREE.MeshPhongMaterial({
      transparent: true,
      normalMap: this.normalsMap,
      displacementMap: this.displacementMap,
      map: this.texture,
      normalScale: new THREE.Vector2(1,1),
      // TODO SET WIREFRAME ON CLICK
      // wireframe: true,
      side: THREE.FrontSide,
    })

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.progress = {value: 0}
      shader.uniforms.uTime = {value: 0}
      shader.uniforms.uSpeed = {value: 0.3}
      shader.uniforms.uFrequency = {value: 3.}
      shader.uniforms.uAmplitude = {value: 1.}
      this.material.userData.shader = shader;
      shader.vertexShader = shader.vertexShader.replace(
        `#include <clipping_planes_pars_vertex>`,
        `#include <clipping_planes_pars_vertex>
        varying vec2 vDisplacementUV;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uFrequency;
        uniform float uAmplitude;
        vec2 rotate(vec2 v, float a){
          float s = sin(a);
          float c = cos(a);
          mat2 m = mat2(c, -s, s, c);
          return m * v;
        }
        float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        
        `,
      )
      shader.vertexShader = shader.vertexShader.replace(
        `#include <project_vertex>`,
        `
        float t = uTime * uSpeed;
        vec2 pos = position.xy * 0.5 * vec2(1.,4.)+vec2(0.,0.);
        float u = fract(pos.x + 0.5);
        float v = map(pos.y/2., - 1.5,1.5,0.,1.);
        vec2 displacementUV = vec2(u,v);
        vDisplacementUV = displacementUV;
        float displacement = (texture2D(displacementMap, displacementUV).r - 0.5)*2.;
        float radius = 1.4+ 1.25 * displacement;
        float angle = sin(displacementUV.y * uFrequency + t)* (uAmplitude * sin(t * 0.4));
        vec2 rotatedDisplacement = rotate(vec2(0., radius), 2.0 * 3.14159265 * (pos.x) + angle);

        vec4 mvPosition = vec4( vec3(rotatedDisplacement.x, position.y, rotatedDisplacement.y), 1.0 );
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
        `
      )
      
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `#include <common>
        varying vec2 vDisplacementUV;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <alphamap_fragment>`,
        `
        diffuseColor.a *= sin(vDisplacementUV.y*3.1415965)*5. -0.5;

        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <normal_fragment_maps>`,
        `#include <normal_fragment_maps>
        normal = texture2D(normalMap, vDisplacementUV).xyz*2. -1.;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <tonemapping_fragment>`,
        `#include <tonemapping_fragment>
        gl_FragColor.rgb *= 2.;
        `
      )
    }


    this.handleWheel = this.handleWheel.bind(this);
    this.webgl.canvas.addEventListener('wheel', this.handleWheel)
    this.geometry = new THREE.PlaneGeometry(2, 3, 200, 200);
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)
    this.mesh.scale.setScalar(2);
    this.active = true;
    this.position.set(0,-0.25,0)
    this.texture.offset.y = -1
    this.velocity = 0.03

  }

  dispose() {
    this.active = false;
    this.mesh.removeFromParent()
    this.geometry.dispose();
    this.geometry = null;
    this.material.dispose();
    this.material = null;
    this.mesh = null;
    this.displacementMap = null;
    this.normalsMap = null;
    this.webgl.canvas.removeEventListener('wheel', this.handleWheel)
    this.texture.dispose();
    this.texture = null;
    this.velocity = 0;
    this.scrollAmount = 0;
  }


  switchTo() {
    this.webgl.scene.currentScene = 'about'
    this.initialise();
  }

  handleWheel(event){
    event.preventDefault();
    this.velocity += event.deltaY * 0.00004
    if (this.active) {

      }
  }


  update(dt, time) {
    if (this.active) {
      if (this.material.userData.shader){
        // this.material.userData.shader.uniforms.uTime.value = time;
      }
      
      this.scrollAmount += this.velocity;
      this.velocity *= 0.95;
      // const {shader} = this.gridMaterial.userData;
      // console.log(this.gridMaterial)
      // if (shader){
      //   console.log(time)
      //   shader.uniforms.time = time;
      // }
      // this.grid.rotation.y =  Math.sin(time) * 0.5
      // this.grid.rotation.x = Math.sin(time * 3) * 0.5
      this.texture.offset.y += (dt) * 0.04 + this.velocity;
      this.rotationCoords.x += (this.targetCoords.x - this.rotationCoords.x) * 0.05;
      this.rotationCoords.y += (this.targetCoords.y - this.rotationCoords.y) * 0.05;
      this.setRotationFromEuler(new THREE.Euler(
        this.rotationCoords.y/this.webgl.height-0.5,
        this.rotationCoords.x/this.webgl.width-0.5,
        0
        ));
        if (this.texture.wrapT == THREE.ClampToEdgeWrapping && this.texture.offset.y >= 0){
          this.texture.wrapT = THREE.RepeatWrapping;
          this.texture.needsUpdate = true;
          
        }
    }
    

  }

  onPointerMove(event, { x, y }) {
    this.targetCoords.x = x;
    this.targetCoords.y = y + 100;

  }
}