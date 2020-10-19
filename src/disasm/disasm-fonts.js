import Font from "../view/font"

export default function disasmFonts(images, fonts) {
	let result = {}
	for (let fontid in fonts) {
		let font = fonts[fontid]
		let image = images["font-" + font.id]
		result[font.id] = Font(image, font)
	}
	return result
}
