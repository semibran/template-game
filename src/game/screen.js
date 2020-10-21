import { create as Canvas } from "../lib/canvas"
import * as Button from "../comps/button"

export function create() {
	return {
		type: "Game",
		exit: false,
		subscr: null,
		nextscr: null,
		buttons: [] // private button refs for rendering
	}
}

export function onenter(game, view) {
	let select = Button.create("Map Select", { width: 80, onclick() {
		return [[ "switch-subscr", "map" ]]
	}})

	let option = Button.create("Option", { width: 80, onclick() {
		return [[ "switch-subscr", "options" ]]
	}})

	game.buttons.push(select, option)
	return [
		[ "addcomp", select ],
		[ "addcomp", option ]
	]
}

export function render(game, view) {
	let nodes = []

	let { sprites, viewport } = view
	let text = sprites.Text("{{project.name}}", { font: "seven", color: [ 0, 0, 0 ] })
	let bg = Canvas(viewport.width, viewport.height)
	bg.fillStyle = "white"
	bg.fillRect(0, 0, viewport.width, viewport.height)

	let bgnode = { image: bg.canvas }
	let textnode = {
		image: text,
		x: viewport.width / 2,
		y: 32,
		origin: "center"
	}
	nodes.push(bgnode, textnode)


	for (let [ i, button ] of game.buttons.entries()) {
		let node = Button.render(button, view)
		node.x = viewport.width / 2
		node.y = textnode.y + text.height + 15 * i
		node.origin = "topcenter"
		nodes.push(node)
	}

	return nodes
}
