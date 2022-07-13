import * as THREE from 'three'

// natural hemisphere light from
// https://threejs.org/examples/#webgl_lights_hemisphere
export function addNaturalLight(webgl) {
    const ambientLight = new THREE.AmbientLight( 0xffffff, 5 ); // soft white light
  webgl.scene.add(ambientLight)


}
