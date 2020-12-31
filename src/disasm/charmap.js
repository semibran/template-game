import recolor from '../lib/canvas-recolor'
import extract from 'img-extract'

export { get, make }

function get (font, color) {
  if (font.cache[color]) return font.cache[color]
  font.cache[color] = make(font.image, font.data, color)
  return font.cache[color]
}

function make (image, font, color, stroke) {
  if (!image) {
    throw new Error('No image found for font ' +
      font.id + '. Try rebuilding your spritesheet.')
  }
  const charmap = {}
  const cols = image.width / font.cellwidth
  const rows = image.height / font.cellheight
  if (color) {
    image = recolor(image, color)
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const char = font.layout[row][col]
      if (!char) continue
      const size = {
        width: font.charwidth,
        height: font.charheight
      }
      const offsets = font.exceptions[char]
      for (const axis in offsets) {
        size[axis] = offsets[axis]
      }
      const x = col * font.cellwidth
      const y = row * font.cellheight
      const base = extract(image, x, y, size.width, size.height)
      charmap[char] = base
    }
  }
  return charmap
}
