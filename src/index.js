import { EffectPass, VignetteEffect } from 'postprocessing'
import WebGLApp from './utils/WebGLApp'
import assets from './utils/AssetManager'
import Bridge from './scene/Bridge'
import Logo from './scene/Logo'
import { addNaturalLight } from './scene/lights'
import { addScreenshotButton, addRecordButton } from './scene/screenshot-record-buttons'
import gsap from 'gsap';

// true if the url has the `?debug` parameter, otherwise false
window.DEBUG = window.location.search.includes('debug')

// grab our canvas
const canvas = document.querySelector('#app')

// setup the WebGLRenderer
const webgl = new WebGLApp({
    canvas,
    // set the scene background color
    // background: '#111',
    backgroundAlpha: 0,
    // enable postprocessing
    postprocessing: false,
    // show the fps counter from stats.js
    showFps: window.DEBUG,
    // enable OrbitControls
    orbitControls: false,
    // Add the controls pane inputs
    controls: {
        roughness: 0.5,
        movement: {
            speed: {
                value: 1.5,
                max: 100,
                scale: 'exp',
            },
            frequency: { value: 0.5, max: 5 },
            amplitude: { value: 0.7, max: 2 },
        },
    },
    hideControls: !window.DEBUG,
    antialias: true,
    // enable cannon-es
    // world: new CANNON.World(),
})

// attach it to the window to inspect in the console
if (window.DEBUG) {
    window.webgl = webgl
}

// hide canvas
webgl.canvas.style.visibility = 'hidden'

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
    // add any "WebGL components" here...
    // append them to the scene so you can
    // use them from other components easily
    webgl.camera.position.set(0, 0, -45)

    webgl.scene.bridge = new Bridge(webgl)

    webgl.scene.bridge.position.set(0, -8, 0);

    webgl.camera.lookAt(0, 0, 20)
    webgl.camera.near = 2.5;
    webgl.camera.updateProjectionMatrix();
    webgl.scene.add(webgl.scene.bridge)

    webgl.scene.logo = new Logo(webgl);
    webgl.scene.add(webgl.scene.logo);
    webgl.scene.logo.position.set(0, 0, -30)
    webgl.scene.logo.lookAt(webgl.camera.position);
    webgl.scene.logo.scale.set(0.1, 0.1, 0.1)

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

    function enterMenu(){
        document.removeEventListener('click', enterMenu)
        console.log('hey')
        webgl.scene.bridge.bringToFocus();
        gsap.to(webgl.camera.position, {
            z: -10,
            duration: 2,
            overwrite: false,
            ease: "power2.inOut",
            onStart: function () {
                setTimeout( () => {
                    document.getElementById('menuPopup').classList.remove('transparent')
                }, 1000)
            },
            onComplete: function () {

            }
        })
    }

    document.addEventListener('click', enterMenu)

    // show canvas
    webgl.canvas.style.visibility = ''

    // start animation loop
    webgl.start()
})
