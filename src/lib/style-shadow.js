import { create as Canvas, copy } from '../lib/canvas'
import recolor from '../lib/canvas-recolor'

export default function drawShadow (image, color) {
  const result = Canvas(image.width + 1, image.height + 1)
  const shadow = recolor(copy(image).canvas, color)
  result.drawImage(shadow, 0, 1)
  result.drawImage(shadow, 1, 0)
  result.drawImage(shadow, 1, 1)
  result.drawImage(image, 0, 0)
  return result.canvas
}
