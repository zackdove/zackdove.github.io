import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { generate4StripeTexture } from '../utils/stripeTexture';

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
const pink = '#ec28ff'
const green = '#00ff4e'
const red = '#ff3810'
const black = '#000000'
const transparent = 'rgba(225,225,225,0.0)';

const colours = {
  bg: yellow,
  text: green,
  bg2: pink,
  text2: blue,
  bg3: transparent,
  text3: black,
  bg4: yellow,
  text4: blue,
};

export class About extends THREE.Group {
  constructor(webgl) {
    super();
    this.webgl = webgl;
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
    this.scrollAmount = 0;
  }

  initialise() {

    this.texture = new THREE.Texture(generate4StripeTexture('ZCKD ', colours, 8))
    this.texture.needsUpdate = true
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
    this.texture.repeat.set(6, 1)
    // this.texture.anisotropy = 2
    this.material = new THREE.MeshBasicMaterial({ map: this.texture })
    this.material.transparent = true;
    

    this.displacementMap = assets.get(displacementKey);
    this.normalsMap = assets.get(normalsKey);

    this.gridMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: `#extension
        GL_OES_standard_derivatives : enable`
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: 0,
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


    this.phongMaterial = new THREE.MeshPhongMaterial({
      transparent: true,
      normalMap: this.normalsMap,
      displacementMap: this.displacementMap,
      map: this.texture,
      normalScale: new THREE.Vector2(4,4)
    })

    this.phongMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.progress = {value: 0}
      this.phongMaterial.userData.shader = shader;
      shader.vertexShader = shader.vertexShader.replace(
        `#include <clipping_planes_pars_vertex>`,
        `#include <clipping_planes_pars_vertex>
        varying vec2 vDisplacementUV;
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
        vec2 pos = position.xy * 0.5 * vec2(1.,4.)+vec2(0.,0.);
        float u = fract(pos.x + 0.5);
        float v = map(pos.y/2., - 1.5,1.5,0.,1.);
        vec2 displacementUV = vec2(u,v);
        vDisplacementUV = displacementUV;
        float displacement = (texture2D(displacementMap, displacementUV).r - 0.5)*2.;
        float radius = 1.4+ 1.25 * displacement;
        vec2 rotatedDisplacement = rotate(vec2(0., radius), 2.0 * 3.14159265 * (pos.x));

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
    }


    this.handleWheel = this.handleWheel.bind(this);
    this.webgl.canvas.addEventListener('wheel', this.handleWheel)
    this.gridGeometry = new THREE.PlaneGeometry(2, 3, 100, 100);
    this.grid = new THREE.Mesh(this.gridGeometry, this.phongMaterial)
    this.add(this.grid)
    this.grid.scale.setScalar(2);
    this.active = true;

  }

  dispose() {
    this.active = false;
    this.mesh.removeFromParent()
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.displacementMap = null;
    this.normalsMap = null;
    this.webgl.canvas.removeEventListener('wheel', this.handleWheel)
  }


  switchTo() {
    this.initialise();
  }

  handleWheel(event){
    this.velocity += event.deltaY * 0.00004
  }


  update(dt, time) {
    if (this.active) {
      this.gridMaterial.uniforms.time = time;
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
      this.texture.offset.y = time * 0.04 + this.scrollAmount;
      this.rotationCoords.x += (this.targetCoords.x - this.rotationCoords.x) * 0.05;
      this.rotationCoords.y += (this.targetCoords.y - this.rotationCoords.y) * 0.05;
      this.setRotationFromEuler(new THREE.Euler(
        this.rotationCoords.y/this.webgl.height-0.5,
        this.rotationCoords.x/this.webgl.width-0.5,
        0
        ));
    }
    

  }

  onPointerMove(event, { x, y }) {
    this.targetCoords.x = x;
    this.targetCoords.y = y;
   
  }
}