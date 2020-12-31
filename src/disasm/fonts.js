import { make as makeCharmap } from './charmap'

export default function disasmFonts (images, fonts) {
  const result = {}
  for (const fontid in fonts) {
    const font = fonts[fontid]
    const image = images['font-' + font.id]
    result[font.id] = {
      image,
      data: font,
      cache: { '255,255,255,255': makeCharmap(image, font) }
    }
  }
  return result
}
