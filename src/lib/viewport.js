export let scale = 1
export let width = 0
export let height = 0
let nativewidth = 0
let nativeheight = 0
const debounce = 200

export function init (w, h, listen) {
  let timeout = null
  nativewidth = w
  nativeheight = h

  function resize () {
    const hscale = Math.floor(window.innerWidth / nativewidth)
    const vscale = Math.floor(window.innerHeight / nativeheight)
    scale = Math.max(1, Math.min(hscale, vscale))
    width = Math.ceil(window.innerWidth / scale)
    height = Math.ceil(window.innerHeight / scale)
    if (listen) listen(width, height, scale)
  }

  resize()

  window.addEventListener('resize', () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(resize, debounce)
  })
}
