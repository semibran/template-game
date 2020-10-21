import * as Button from "../comps/button"

export { create, onenter, onexit, render }

const create = _ => ({
	type: "Options",
	exit: false,
	// private refs for rendering
	buttons: [],

})

const onenter = mode => {
	let option1 = Button.create("Option 1", { width: 80 })
	let option2 = Button.create("Option 2", { width: 80 })
	let back = Button.create("Back", { onclick: _ => [[ "switchmode", "Home" ]] })
	mode.buttons.push(option1, option2)
	mode.back = back
	return [[ "addcomp", option1 ], [ "addcomp", option2 ], [ "addcomp", back ]]
}

const onexit = mode =>
	[ ...mode.buttons, mode.back ].map(button => [ "removecomp", button ])

const render = (mode, view) => {
	let nodes = []
	let { sprites, viewport } = view

	let text = sprites.Text("Options", { font: "seven", color: [ 0, 0, 0 ] })
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

	let backnode = Button.render(mode.back, view)
	backnode.x = 4
	backnode.y = viewport.height - 4
	backnode.origin = "bottomleft"
	nodes.push(backnode)

	return nodes
}
