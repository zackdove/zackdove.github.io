import { EffectPass, VignetteEffect } from 'postprocessing'
import WebGLApp from './utils/WebGLApp'
import assets from './utils/AssetManager'
import Suzanne from './scene/Suzanne'
import { addNaturalLight } from './scene/lights'
import { addScreenshotButton, addRecordButton } from './scene/screenshot-record-buttons'
import Rock from './scene/Rock'
import Ribbons from './scene/Ribbons'
import * as THREE from 'three'
import MenuRibbons from './scene/MenuRibbons'
import Work from './scene/Work'
import WorkPills from './scene/WorkPills'
import RaycastHandler from './scene/RaycastHandler'
import CSSHandler from './scene/CSSHandler'
import { About } from './scene/About'
import { Contact } from './scene/Contact'
import TextHandler from './scene/TextHandler'
import CSSGroundHandler from './scene/CSSGround'

// true if the url has the `?debug` parameter, otherwise false
window.DEBUG = window.location.search.includes('debug')

// grab our canvas
const canvas = document.querySelector('#app')



// setup the WebGLRenderer
const webgl = new WebGLApp({
  canvas,
  // set the scene background color
  background: '#fff',
  backgroundAlpha: 0,
  // enable postprocessing
  postprocessing: false,
  // show the fps counter from stats.js
  showFps: window.DEBUG,
  // enable OrbitControls
  orbitControls: false,
  // Add the controls pane inputs
  // enable cannon-es
  // world: new CANNON.World(),
})

webgl.clickables = []
webgl.hoverables = []

// attach it to the window to inspect in the console
if (window.DEBUG) {
  window.webgl = webgl
}

// hide canvas
webgl.canvas.style.visibility = 'hidden'


console.log('loading')


// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
  console.log('loaded')


  // add any "WebGL components" here...
  // append them to the scene so you can
  // use them from other components easily
  // webgl.scene.suzanne = new Suzanne(webgl)
  // webgl.scene.add(webgl.scene.suzanne)

  webgl.scene.rotationGroup = new THREE.Group();

  webgl.cssHandler = new CSSHandler(webgl)
  webgl.scene.add(webgl.cssHandler)

  webgl.cssGroundHandler = new CSSGroundHandler(webgl)
  webgl.scene.add(webgl.cssGroundHandler)

  webgl.scene.add(webgl.scene.rotationGroup)

  webgl.scene.work = new WorkPills(webgl);
  webgl.scene.add(webgl.scene.work);

  webgl.scene.about = new About(webgl);
  webgl.scene.add(webgl.scene.about);

  webgl.scene.contact = new Contact(webgl);
  webgl.scene.add(webgl.scene.contact);

  webgl.scene.sections = [webgl.scene.work, webgl.scene.about, webgl.scene.contact]

  webgl.scene.rock = new Rock(webgl)
  webgl.scene.rotationGroup.add(webgl.scene.rock)
  webgl.camera.position.set(0, 0, 6);


  // landing, menu, work, about, play
  webgl.scene.currentScene = 'landing'


  // webgl.scene.menuRibbons = new MenuRibbons(webgl);
  // webgl.scene.menuGroup.add(webgl.scene.menuRibbons)


  webgl.renderer.shadowMap.enabled = true

  const raycastHandler = new RaycastHandler(webgl, webgl.hoverables, webgl.clickables)
  webgl.raycastHandler = raycastHandler;
  webgl.onPointerDown(raycastHandler.handlePointerDown);
  webgl.onPointerMove(raycastHandler.handlePointerMove)

  webgl.textHandler = new TextHandler(webgl)

  console.log(window.location.search)
  webgl.canvas.style.visibility = ''

  setTimeout(() => {
    switch (window.location.search) {
      case '?about':
        webgl.scene.rock.moveToTopLeft(true);
        webgl.scene.about.switchTo()
        break;
      case '?work':
        webgl.scene.rock.moveToTopLeft(true);
        webgl.scene.work.switchTo()
        break;
      case '?contact':
        webgl.scene.rock.moveToTopLeft(true);
        webgl.scene.contact.switchTo();
        break;
      default:
        webgl.scene.rock.animateIn();
        break;
    }
  }, 3000)

  setTimeout(() => {
    document.getElementById('svgTopContainer').classList.add('loaded');
    document.getElementById('svgBottomContainer').classList.add('loaded');
  }, 2000)

  // setTimeout( ( ) => {
  //   // Animate in rock
  //   webgl.scene.rock.animateIn();
  // }, 3000)


  // lights and other scene related stuff
  addNaturalLight(webgl)

  // postprocessing
  // add an existing effect from the postprocessing library
  // webgl.composer.addPass(new EffectPass(webgl.camera, new VignetteEffect()))

  // add the save screenshot and save gif buttons
  if (window.DEBUG) {
    addScreenshotButton(webgl)
    addRecordButton(webgl)
  }

  // show canvas


  // start animation loop
  webgl.start()
})
