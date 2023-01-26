import * as THREE from 'three'
import glsl from 'glslify'
import assets from '../utils/AssetManager'
import { wireValue, wireUniform } from '../utils/Controls'
import { addUniforms, customizeVertexShader } from '../utils/customizeShader'
import { gsap } from "gsap";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import LittleDots from './LittleDots'
import MenuDots from './MenuDots'
import TopLeftCalculator from '../utils/TopLeftCalculator'

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;



// elaborated three.js component example
// containing example usage of
//   - asset manager
//   - control panel
//   - touch events
//   - postprocessing
//   - screenshot saving

// preload the suzanne model
const rockKey = assets.queue({
  url: 'assets/webrock.glb',
  type: 'gltf',
})


// preload the environment map
const hdrKey = assets.queue({
  url: 'assets/ouside-afternoon-blurred-hdr.jpg',
  type: 'env-map',
})

export default class Rock extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options

    const rockGltf = assets.get(rockKey)
    const rock = rockGltf.scene.clone()

    const envMap = assets.get(hdrKey)

    this.material;


    // apply the material to the model
    rock.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeBoundsTree();
        child.material.envMap = envMap
        this.material = child.material;
      }
    })

    this.rock = rock;
    this.blueMaterial = this.material.clone();
    this.blueMaterial.map = null;
    this.blueMaterial.envMap = envMap
    this.blueMaterial.roughness = 0;
    this.blueMaterial.color = new THREE.Color(0x0000ff);

    rock.scale.setScalar(2);
    this.add(rock)
    this.rotation.x = 0.5;
    this.rotation.y = 0.5;

    // set the background as the hdr
    // this.webgl.scene.background = envMap

    this.littleDots = new LittleDots(webgl)
    this.add(this.littleDots)
    this.menuDots = new MenuDots(webgl)
    this.add(this.menuDots)
    this.webgl.hoverables.push(this.rock)
    this.webgl.clickables.push(this.rock)
    this.rock.traverse((child) => {
      child.handleHover = this.handleHover.bind(this);
      child.handleNoHover = this.handleNoHover.bind(this);
      child.handleClick = this.handleClick.bind(this);
    })
    this.topLeftCalculator = new TopLeftCalculator(webgl);
    this.cornerPosition = this.topLeftCalculator.getTopLeftPosition().clone();
    this.isTopLeft = false;
  }

  handleHover() {
    this.webgl.textHandler.changeTo('HOME')
    this.rock.traverse((child) => {
      if (child.isMesh) {
        // child.materia.envMap = envMap

        child.material = this.blueMaterial;
      }
    })
  }

  handleNoHover() {
    this.rock.traverse((child) => {

      if (child.isMesh) {
        // child.materia.envMap = envMap

        child.material = this.material;
      }
    })
  }

  handleClick() {
    let newX = this.rotation.x + Math.PI / 2;
    gsap.to(this.rotation, {
      x: newX,
      y: Math.random() * Math.PI,
      // z: Math.random() * Math.PI ,
      duration: 2.5,
      ease: "elastic.out(0.5, 0.2)",
    })
    console.log(this.webgl.scene.currentScene)

    switch (this.webgl.scene.currentScene) {
      case 'work':
        this.webgl.scene.work.dispose();
        this.moveToCenter();
        break;
      case 'about':
        this.webgl.scene.about.dispose();
        this.moveToCenter();
        break;
      case 'contact':
        this.webgl.scene.contact.dispose();
        this.moveToCenter();
        break;
      default:
        break;
    }
    this.webgl.scene.currentScene = 'landing'
  }


  moveToCenter() {
    this.isTopLeft = false;
    gsap.to(this.position, {
      x: 0,
      y: 0,
      z: 0,
    })
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
    })
  }


  update(dt, time) {
    this.rock.rotation.x += 0.3 * dt;
    this.rock.rotation.y += 0.1 * dt;
  }

  moveToTopLeft() {
    this.isTopLeft = true;
    this.cornerPosition.copy(this.topLeftCalculator.getTopLeftPosition());
    // this.position.copy(this.cornerPosition);
    gsap.to(this.position, {
      x: this.cornerPosition.x,
      y: this.cornerPosition.y,
      z: this.cornerPosition.z,
    })
    gsap.to(this.scale, {
      x: 0.2 * (window.innerWidth / 1600) * (1000 / window.innerHeight),
      y: 0.2 * (window.innerWidth / 1600) * (1000 / window.innerHeight),
      z: 0.2 * (window.innerWidth / 1600) * (1000 / window.innerHeight),
      onComplete: () => {
        this.webgl.scene.rock.rock.children[0].geometry.computeBoundingBox();
        const box = new THREE.Box3();
        box.copy(this.webgl.scene.rock.rock.children[0].geometry.boundingBox).applyMatrix4(this.webgl.scene.rock.rock.children[0].matrixWorld);
        console.log(box)
      }
    })
  }

  resize({ width, height, pixelRatio }) {
    // this.cornerPosition.copy(this.topLeftCalculator.getTopLeftPosition());
    if (this.isTopLeft) {
      this.moveToTopLeft();
    }
  }


}