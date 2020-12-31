import { init as initViewport } from './viewport'
import { load as loadSprites } from './disasm'
import bbox from './node-bbox'
import drawNodes from './node-draw'
import scenedata from './scenes/test.json'

;(async function main (state, dispatch) {
  await loadSprites('./sprites.png')
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  initViewport(160, 160, (width, height, scale) => {
    canvas.width = width
    canvas.height = height
    canvas.style.transform = `scale(${scale})`
  })

  let nodes = [] // node cache for clearing previous render
  setTimeout(function update () {
    clearNodes(canvas, nodes)
    nodes = scene.render()
    drawNodes(canvas, nodes)
    window.requestAnimationFrame(update)
  }, 500)
})()
