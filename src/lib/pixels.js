// fromImage(Image) -> ImageData
// this function creates a garbage canvas
// only use if you're sure you won't be needing it afterwards
export function fromImage (image) {
  const canvas = document.createElement('canvas')
  const context = image.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(canvas, 0, 0)
  return context.getImageData(0, 0, image.width, image.height)
}

export function fromCanvas (canvas) {
  return canvas
    .getContext('2d')
    .getImageData(0, 0, canvas.width, canvas.height)
}

export function toCanvas (data) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = data.width
  canvas.height = data.height
  context.putImageData(data, 0, 0)
  return canvas
}

export function get (image, x, y) {
  const i = (y * image.width + x) * 4
  const r = image.data[i]
  const g = image.data[i + 1]
  const b = image.data[i + 2]
  const a = image.data[i + 3]
  return [r, g, b, a]
}

export function set (image, x, y, color) {
  const i = (y * image.width + x) * 4
  image.data[i + 0] = color[0]
  image.data[i + 1] = color[1]
  image.data[i + 2] = color[2]
  image.data[i + 3] = color[3]
}

export function replace (image, oldColor, newColor) {
  if (oldColor.length === 3) oldColor = [...oldColor, 255]
  if (newColor.length === 3) newColor = [...newColor, 255]
  for (let i = 0; i < image.data.length; i += 4) {
    let c = 0
    while (image.data[i + c] === oldColor[c] && c < 4) {
      c++
    }

    if (c < 4) {
      continue
    }

    for (let c = 0; c < 4; c++) {
      image.data[i + c] = newColor[c]
    }
  }
  return image
}

export function recolor (image, newColor) {
  if (!newColor[3]) {
    newColor = newColor.slice()
    newColor[3] = 255
  }
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue
    for (let c = 0; c < 4; c++) {
      image.data[i + c] = newColor[c]
    }
  }
  return image
}
