import loadImage from "img-load"
import disasm from "./disasm"
import * as View from "./view"

let state = {}
loadImage("sprites.png").then(main)

function main(sprites) {
	let view = View.create(160, 160, disasm(sprites))
	View.change(view, "Game", state)
	View.mount(view, document.body)
}
