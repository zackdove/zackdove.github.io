import * as THREE from 'three'

function resizeImage(image) {
  const scale = 1
  const width = THREE.MathUtils.floorPowerOfTwo(scale * image.width)
  const height = THREE.MathUtils.floorPowerOfTwo(scale * image.height)
  if (width === image.width && height === image.height) {
    return image
  }
  if ((typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap)) {
    document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')

    const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, width, height)
    return canvas
  } else {
    return image
  }
}

export const generateTexture = (
  text,
  background = '#ffa1a1',
  textcolor = 'blue',
  size = 640
) => {
  const bitmapShift = 80
  const copyAmount = 4
  const canvasSize = size
  const fontSize = canvasSize / copyAmount

  const bitmap = document.createElement('canvas')
  bitmap.width = canvasSize
  bitmap.height = canvasSize

  const g = bitmap.getContext('2d')

  // background
  g.fillStyle = background
  g.fillRect(0, 0, bitmap.width + 80, bitmap.height)

  // text
  g.fillStyle = 'red'
  g.font = `${fontSize}px KareliaMedium`
  g.fillStyle = textcolor
  const textWidth = g.measureText(text).width
  g.scale(canvasSize / textWidth, 1)
  const fillAndShiftText = index => g.fillText(text, 0, fontSize * ++index - canvasSize / 48)

  Array(copyAmount + 1)
    .fill(0)
    .forEach((item, i) => {
      fillAndShiftText(i)
    })

  // document.body.appendChild(bitmap);
  return resizeImage(bitmap)
}

export const generateStripeTexture = (
  text,
  colors = {main: '#ffa1a1', second: 'blue'}
) => {
  const copyAmount = 2
  const canvasSize = 1024
  const fontSize = canvasSize / copyAmount
  const fontStyle = `${fontSize}px KareliaMedium`

  const bitmap = document.createElement('canvas')
  const g = bitmap.getContext('2d')
  g.font = fontStyle
  bitmap.width = g.measureText(text).width
  bitmap.height = fontSize * 2

  const generateTextRow = (shift, i) => {
    // background
    g.fillStyle = Object.values(colors)[i]
    g.fillRect(0, shift * i, bitmap.width, bitmap.height)

    // text
    g.font = `${fontSize}px KareliaMedium`
    // g.fillStyle = Object.values(colors)[i];
    g.fillText(text, 0, (shift * i / 2) + fontSize - canvasSize / 48)
    g.fillStyle = Object.values(colors)[0]
  }

  Array(copyAmount + 1)
    .fill(0)
    .forEach((item, i) => {
      generateTextRow(bitmap.height / 2, i)
    })

  // text
  // document.body.appendChild(bitmap);
  return resizeImage(bitmap)
}

export const generate4StripeTexture = (
  text,
  colors = {
    bg: '#FF00FF',
    text: '#ffffff',
    bg2: '#FFFFFF',
    text2: '#FFFFFF',
    bg3: '#ff0000',
    text3: '#FFFFFF',
    bg4: '#ff0000',
    text4: '#ff0000',
  }
) => {
  console.log(Object.values(colors))
  const copyAmount = 4
  const canvasSize = 1024
  const fontSize = canvasSize / copyAmount
  const fontStyle = `italic ${fontSize}px Maison Neue`

  const bitmap = document.createElement('canvas')
  const g = bitmap.getContext('2d')
  g.font = fontStyle
  bitmap.width = g.measureText(text).width
  bitmap.height = canvasSize

  const generateTextRow = (shift, i) => {
    // background
    g.fillStyle = Object.values(colors)[i]
    console.log(g.fillStyle)
    g.fillRect(0, shift * i / 2, bitmap.width, shift)

    // text
    g.font = `italic ${fontSize}px Maison Neue`
    g.fillStyle = Object.values(colors)[i + 1]
    console.log(g.fillStyle)
    console.log(shift * i / 2)
    g.fillText(text, 0, (shift * i / 2) + fontSize - canvasSize / 32)
  }
  for (let i = 0; i < copyAmount * 2; i += 2) {
    generateTextRow(fontSize, i)
  }

  // text
  // document.body.appendChild(bitmap);
  return resizeImage(bitmap)
}


