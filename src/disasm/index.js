import srcmap from "../../dist/tmp/sprites.json"
import fontdata from "../fonts"
import disasm from "./disasm"
import disasmFonts from "./disasm-fonts"
import renderText from "./render-text"
import renderButton from "./render-button"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let fonts = disasmFonts(images, fontdata)
	let sprites = {}

	const Text = (content, style) =>
		renderText(content, { ...style, font: fonts[style && style.font || "seven"] })

	const Button = (content, width) => renderButton(content, width, sprites)

	sprites = { Text, Button }
	return sprites
}
