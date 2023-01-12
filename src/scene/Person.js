import * as THREE from 'three'

import assets from '../utils/AssetManager'
import { getTextureMaterialNormalMap } from '../utils/noisyMaterials';

const bodyKey = assets.queue({
  url: 'assets/models/boy4.glb',
  type: 'gltf',
})

const hdrKey = assets.queue({
  url: 'assets/ouside-afternoon-blurred-hdr.jpg',
  type: 'env-map',
})

export class About extends THREE.Group {
  constructor(webgl) {
    super();
    this.targetPosition = new THREE.Vector3(0,0,0)
    this.webgl = webgl;
  }

  initialise() {
    const bodyGltf = assets.get(bodyKey)
    this.body = bodyGltf.scene.clone()
    this.add(this.body)

    const envMap = assets.get(hdrKey)
    this.body.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeBoundsTree();
        const map = child.material.map;
        const normalMap = child.material.normalMap;
        child.material = getTextureMaterialNormalMap(envMap, map, normalMap)
        this.material = child.material;
      }
    })
    
    this.body.position.set(0.5,-3,4)
    this.body.rotation.set(0,Math.PI, 0)
    this.body.scale.setScalar(2)
    this.handlePointerMove = this.handlePointerMove.bind(this);
    document.body.addEventListener('pointermove', this.handlePointerMove);
  }

  dispose() {
    document.body.removeEventListener('pointermove', this.handlePointerMove);
  }


  switchTo() {
    this.initialise();
  }

  handlePointerMove(event  ){
    const coords = new THREE.Vector2().set(
      ((event.offsetX / this.webgl.width) * 2 - 1) / 6,
      ((-event.offsetY / this.webgl.height) * 2 + 1) /6
    );
    this.targetPosition.x = coords.x;
    this.targetPosition.y = coords.y;
  }

  update(dt, time){
    if (this.material){
    this.position.lerp(this.targetPosition, 0.1)
    const {shader} = this.material.userData
    if (shader){
      shader.uniforms.time.value = performance.now() / 1000
    }
    
    }
  }
}