import { create as Canvas } from "../lib/canvas"
import * as Home from "./mode-home"
import * as Options from "./mode-options"
const Modes = { Home, Options }

export { Modes, create, onenter, render }

const create = _ => ({
	type: "Game",
	mode: Home.create(),
	nextmode: null,
	exit: false
})

const onenter = (game, view) => {
	return Home.onenter(game.mode, view)
}

const render = (game, view) => {
	let nodes = []

	let { viewport } = view
	let bg = Canvas(viewport.width, viewport.height)
	let bgnode = { image: bg.canvas }
	bg.fillStyle = "white"
	bg.fillRect(0, 0, viewport.width, viewport.height)
	nodes.push(bgnode)

	let render = Modes[game.mode.type].render
	if (render) {
		nodes.push(...render(game.mode, view))
	}

	return nodes
}
