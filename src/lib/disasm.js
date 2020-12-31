import extract from 'img-extract'

export default function disasm (sheet, srcmap) {
  const sprites = {}
  for (const id in srcmap) {
    if (Array.isArray(srcmap[id])) {
      const [x, y, w, h] = srcmap[id]
      sprites[id] = extract(sheet, x, y, w, h)
    } else {
      sprites[id] = disasm(sheet, srcmap[id])
    }
  }
  return sprites
}
