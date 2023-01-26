import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { ContactSquare } from './ContactSquare';

const githubNormalKey =  assets.queue({
  url: 'assets/images/normal02.jpeg',
  type: 'texture',
})


const instagramNormalKey =  assets.queue({
  url: 'assets/images/instagram02.jpeg',
  type: 'texture',
})

const mailNormalKey =  assets.queue({
  url: 'assets/images/mail01.jpeg',
  type: 'texture',
})

const cubeKey = assets.queue({
  url: 'assets/models/cube.glb',
  type: 'gltf',
})

const plantKeys = [
  assets.queue({
    url: 'assets/models/plants/grass1.glb',
    type: 'gltf',
  }),
  assets.queue({
    url: 'assets/models/plants/plant2.glb',
    type: 'gltf',
  }),
  assets.queue({
    url: 'assets/models/plants/grass3.glb',
    type: 'gltf',
  }),
  assets.queue({
    url: 'assets/models/plants/grass4.glb',
    type: 'gltf',
  }),
  assets.queue({
    url: 'assets/models/plants/mushroom1.glb',
    type: 'gltf',
  }),
]

export class Contact extends THREE.Group {
  constructor(webgl) {
    super();
    this.webgl = webgl;
    this.title = 'CONTACT'
    this.cubes = []
    this.config = [
      {
        url: 'https://instagram.com/zckd.studio',
        normalKey: instagramNormalKey,
      },
      {
        url: 'https://github.com/zackdove',
        normalKey: githubNormalKey,
      },
      {
        url: 'mailto:zack@zckd.me',
        normalKey: mailNormalKey,
      },
    ]
    this.active = false;
  }

  initialise() {
    const cubeGltf = assets.get(cubeKey)
    for (let i = 0; i < this.config.length; i++){
      const cube = new ContactSquare(this.webgl, i, this.config[i].normalKey, this.config[i].url,cubeGltf, plantKeys);
      cube.position.setX((i + 0.5 - this.config.length/2) * 2)
      cube.scale.setScalar(0.5)
      this.cubes.push(cube)
      this.add(cube);
    }
    // this.instagramCube = new ContactSquare(this.webgl);
    // this.add(this.instagramCube);
    this.active = true;
    this.light = new THREE.PointLight();
    this.light.intensity = 2;
    this.light.position.set(-1,3,3)
    this.add(this.light);
  }

  dispose() {
    this.active = false;
    for (let i = 0; i < this.cubes.length; i++){
      this.cubes[i].dispose()
    }
    this.cubes = [];
    this.light.removeFromParent()
    this.light = null;
  }


  switchTo() {
    this.webgl.scene.currentScene = 'contact'
    this.initialise()
  }


  update(dt, time) {
   
    

  }

  onPointerMove(event, { x, y }) {
    
  }
}