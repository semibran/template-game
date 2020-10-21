import * as Button from "../comps/button"
import * as EaseLinear from "../anims/ease-out"
import lerp from "lerp"

export { create, onenter, onexit, onremove, render }

const create = _ => ({
	type: "Home",
	exit: false,
	buttons: [],
	anims: []
})

const onenter = mode => {
	let select = Button.create("Map Select", {
		width: 80,
		// onclick: _ => [[ "nextmode", "Map" ]]
	})
	let option = Button.create("Option", {
		width: 80,
		onclick: _ => [[ "nextmode", "Options" ]]
	})
	mode.buttons.push(select, option)
	return [[ "addcomp", select ], [ "addcomp", option ]]
}

const onexit = mode => {
	mode.exit = true
	for (let i = 0; i < mode.buttons.length; i++) {
		let anim = EaseLinear.create(15, { delay: i * 3 })
		mode.anims.push(anim)
	}
	return mode.anims.map(anim => [ "startanim", anim ])
}

const onremove = mode =>
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

	for (let i = 0; i < mode.buttons.length; i++) {
		let button = mode.buttons[i]
		let node = Button.render(button, view)
		node.x = viewport.width / 2
		node.y = textnode.y + text.height + 15 * i
		node.origin = "topcenter"
		nodes.push(node)

		let anim = mode.anims[i]
		if (anim) {
			let start = viewport.width / 2
			let goal = -node.image.width / 2
			node.x = lerp(start, goal, anim.x)
		}
	}

	return nodes
}
