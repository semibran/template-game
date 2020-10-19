import srcmap from "../../dist/tmp/sprites.json"
import fontdata from "../fonts"
import disasm from "./disasm"
import disasmFonts from "./disasm-fonts"
import renderText from "../view/render-text"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let fonts = disasmFonts(images, fontdata)
	return {
		Text: (content, style) =>
			renderText(content, { ...style, font: fonts[style.font] })
	}
}
