import { CSS3DRenderer, CSS3DObject } from '../utils/CSS3DRenderer';
import * as THREE from 'three'

export default class CSSHandler extends THREE.Group{
  constructor(webgl){
    super()
    this.webgl = webgl;
    const css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(webgl.width, webgl.height);
    document.getElementById('css3DContainer').appendChild(css3DRenderer.domElement);
    this.css3DRenderer = css3DRenderer;
    
    this.camera = new THREE.PerspectiveCamera();
    this.scene = new THREE.Group();
    // this.scene.scale.setScalar(0.001)
    this.webgl.scene.add(this.scene)

     // Fix CSS
     const css3DDOMElement = css3DRenderer.domElement;
     css3DDOMElement.classList.add("css3DDOMElement");
     const css3DScene = css3DRenderer.domElement.childNodes[0];
     css3DScene.classList.add("css3DScene");
  }

  resize({ width, height, pixelRatio }) {
    this.css3DRenderer.setSize(width, height)
  }



 update(dt, time){
  this.css3DRenderer.render(this.scene, this.camera)
 }

}