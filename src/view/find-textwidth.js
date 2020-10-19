export default function findTextWidth(content, font, stroked) {
	let width = 0
	for (let char of content) {
		if (char === " ") {
			width += font.data.wordspace
			continue
		}
		let cache = font.cache.default
		let image = cache[char]
		if (!image) image = cache[char.toUpperCase()]
		if (!image) continue
		width += image.width + font.data.charspace
	}
	if (width) {
		width -= font.data.charspace
	}
	if (stroked) {
		width += 2
	}
	return width
}
