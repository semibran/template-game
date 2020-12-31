export default function findTextWidth (content, font) {
  let width = 0
  for (const char of content) {
    if (char === ' ') {
      width += font.data.wordspace
      continue
    }
    const cache = font.cache['255,255,255,255']
    let image = cache[char]
    if (!image) image = cache[char.toUpperCase()]
    if (!image) continue
    width += image.width + font.data.charspace
  }
  if (width) {
    width -= font.data.charspace
  }
  return width
}
