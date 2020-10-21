import * as Button from "../comps/button"
import * as EaseLinear from "../anims/ease-linear"
import * as EaseOut from "../anims/ease-out"
import * as EaseIn from "../anims/ease-in"
import lerp from "lerp"

export { create, onenter, onexit, onremove, render }

const create = _ => ({
	type: "Home",
	exit: false,
	buttons: [],
	anims: []
})

const onenter = mode => {
	let campaign = Button.create("Campaign", { width: 80 })
	let vs = Button.create("VS. Mode", { width: 80 })
	let option = Button.create("Option", {
		width: 80,
		onclick: _ => [[ "nextmode", "Options" ]]
	})
	mode.buttons.push(campaign, vs, option)

	for (let i = 0; i < mode.buttons.length; i++) {
		let anim = EaseOut.create(10, { delay: i * 6 })
		mode.anims.push(anim)
	}

	let textanim = EaseLinear.create(10)
	mode.anims.push(textanim)

	return [
		...mode.buttons.map(comp => [ "addcomp", comp ]),
		...mode.anims.map(anim => [ "startanim", anim ])
	]
}

const onexit = mode => {
	mode.exit = true
	mode.anims.length = 0
	for (let i = 0; i < mode.buttons.length; i++) {
		let anim = EaseIn.create(8, { delay: i * 4 })
		mode.anims.push(anim)
	}
	let textanim = EaseLinear.create(10)
	mode.anims.push(textanim)
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
	let textanim = mode.anims[mode.anims.length - 1]
	if (textanim) textnode.opacity = mode.exit ? (1 - textanim.x) : textanim.x
	nodes.push(textnode)

	for (let i = 0; i < mode.buttons.length; i++) {
		let button = mode.buttons[i]
		let node = Button.render(button, view)
		node.x = viewport.width / 2
		node.y = textnode.y + text.height + 4 + i * 15
		node.origin = "center"
		nodes.push(node)

		let anim = mode.anims[i]
		if (anim) {
			if (mode.exit) {
				const start = viewport.width / 2
				const goal = -node.image.width / 2
				node.x = lerp(start, goal, anim.x)
			} else {
				node.height = node.image.height * anim.x
			}
		}
	}

	return nodes
}
