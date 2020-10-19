import recolor from "../../lib/canvas-recolor"
import outline from "./style-outline"
import extract from "img-extract"

export default function makeCharmap(image, font, color, stroke) {
	if (!image) {
		throw new Error(`No image found for font ${font.id}. Try rebuilding your spritesheet.`)
	}
	let charmap = {}
	let cols = image.width / font.cellwidth
	let rows = image.height / font.cellheight
	if (color) {
		image = recolor(image, color)
	}
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			let char = font.layout[row][col]
			if (!char) continue
			let size = {
				width: font.charwidth,
				height: font.charheight
			}
			let offsets = font.exceptions[char]
			for (let axis in offsets) {
				size[axis] = offsets[axis]
			}
			let x = col * font.cellwidth
			let y = row * font.cellheight
			let base = extract(image, x, y, size.width, size.height)
			charmap[char] = stroke
				? outline(base, stroke)
				: base
		}
	}
	return charmap
}
