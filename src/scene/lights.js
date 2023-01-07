import * as THREE from 'three'

// natural hemisphere light from
// https://threejs.org/examples/#webgl_lights_hemisphere
export function addNaturalLight(webgl) {
  // const ambientLight = new THREE.AmbientLight(0xffffff, 5); // soft white light
  // webgl.scene.add(ambientLight)
  // const pointLight = new THREE.PointLight(0xffffff, 10);
  // webgl.scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(0.0, 0.5, 0.5).normalize();
  webgl.scene.add(directionalLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight1.position.set(0.1, 0.5, 0.5).normalize();
  webgl.scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight2.position.set(0.1, 0.5, -0.5).normalize();
  webgl.scene.add(directionalLight2);



}
