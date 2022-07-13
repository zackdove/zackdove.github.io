import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default function loadGLTF(url, options = {}) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    if (options.draco) {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
      loader.setDRACOLoader(dracoLoader)
    }

    loader.load(url, resolve, null, (err) =>
      reject(new Error(`Could not load GLTF asset ${url}:\n${err}`))
    )
  })
}
