import * as Button from "../comps/button"

export { create, onenter, onexit, render }

const create = _ => ({
	type: "Home",
	exit: false,
	buttons: [] // private button refs for rendering
})

const onenter = mode => {
	let select = Button.create("Map Select", {
		width: 80,
		// onclick: _ => [[ "switchmode", "Map" ]]
	})
	let option = Button.create("Option", {
		width: 80,
		onclick: _ => [[ "switchmode", "Options" ]]
	})
	mode.buttons.push(select, option)
	return [[ "addcomp", select ], [ "addcomp", option ]]
}

const onexit = mode =>
	mode.buttons.map(button => [ "removecomp", button ])

const render = (mode, view) => {
	let nodes = []
	let { sprites, viewport } = view

	let text = sprites.Text("{{project.name}}", { font: "seven", color: [ 0, 0, 0 ] })
	let textnode = {
		image: text,
		x: viewport.width / 2,
		y: 32,
		origin: "center"
	}
	nodes.push(textnode)

	for (let [ i, button ] of mode.buttons.entries()) {
		let node = Button.render(button, view)
		node.x = viewport.width / 2
		node.y = textnode.y + text.height + 15 * i
		node.origin = "topcenter"
		nodes.push(node)
	}

	return nodes
}
