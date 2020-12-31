import bbox from './node-bbox'

let _canvas = null
let _ctx = null

export default function clearNodes (canvas, nodes) {
  if (_canvas !== canvas) {
    _canvas = canvas
    _ctx = canvas.getContext('2d')
  }
  for (const node of nodes) {
    const bounds = bbox(node)
    const x = Math.round(bounds.left)
    const y = Math.round(bounds.top)
    const width = Math.round(bounds.width)
    const height = Math.round(bounds.height)
    _ctx.clearRect(x, y, width, height)
  }
}
