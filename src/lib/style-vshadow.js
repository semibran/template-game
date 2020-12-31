import { create as Canvas, copy } from './canvas'
import recolor from './canvas-recolor'

export default function drawVShadow (image, color) {
  const result = Canvas(image.width + 1, image.height + 1)
  const shadow = recolor(copy(image).canvas, color)
  result.drawImage(shadow, 0, 1)
  result.drawImage(image, 0, 0)
  return result.canvas
}
