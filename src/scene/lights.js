import * as THREE from 'three'

// natural hemisphere light from
// https://threejs.org/examples/#webgl_lights_hemisphere
export function addNaturalLight(webgl) {
  // const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
  // hemiLight.color.setHSL(0.6, 1, 0.6)
  // hemiLight.groundColor.setHSL(0.095, 1, 0.75)
  // hemiLight.position.set(0, 50, 0)
  // webgl.scene.add(hemiLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  // dirLight.color.setHSL(0.1, 1, 0.95)
  dirLight.position.set(-4, 5, 1)
  dirLight.position.multiplyScalar(50)
  dirLight.castShadow = true;
  dirLight.shadow.camera.left = -7
  window.dirLight = dirLight;
  webgl.scene.add(dirLight)


  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  webgl.scene.add(ambientLight)

  const pLight = new THREE.PointLight();
  pLight.intensity = 2;
  pLight.position.set(-1,3,3)
    webgl.scene.add(pLight);
}
