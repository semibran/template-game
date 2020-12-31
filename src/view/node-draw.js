import bbox from './node-bbox'

// HACK: private vars to avoid function creation overhead
let _layerseq = []
let _canvas = null

// drawNodes(canvas, nodes, layerseq)
// > draws all nodes on the given canvas
// > layerseq determines order using node.layer
// > TODO: only draw nodes within camera bounds
export default function drawNodes (canvas, nodes, layerseq) {
  _layerseq = layerseq
  _canvas = canvas
  nodes.sort(zsort)
  const context = canvas.getContext('2d')
  for (const node of nodes) {
    const bounds = bbox(node)
    if (!bounds) continue
    const x = Math.round(bounds.left)
    const y = Math.round(bounds.top)
    const width = Math.round(bounds.width)
    const height = Math.round(bounds.height)
    const image = node.image
    if (node.opacity !== undefined) {
      context.globalAlpha = node.opacity
      context.drawImage(image, x, y, width, height)
      context.globalAlpha = 1
    } else {
      context.drawImage(image, x, y, width, height)
    }
  }
}

function zsort (a, b) {
  return zindex(a) - zindex(b)
}

function zindex (node) {
  const z = _layerseq.indexOf(node.layer)
  const h = node.height || node.image.height
  let y = node.y + h / 2
  if (node.layer === 'ui') {
    y = 0
  }
  return z * _canvas.height + y
}
