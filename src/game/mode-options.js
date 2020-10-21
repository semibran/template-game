import * as Button from "../comps/button"
import * as EaseLinear from "../anims/ease-linear"
import * as EaseOut from "../anims/ease-out"
import * as EaseIn from "../anims/ease-in"
import lerp from "lerp"

export { create, onenter, onexit, onremove, render }

const create = _ => ({
	type: "Options",
	exit: false,
	// private refs for rendering
	buttons: [],
	anims: []
})

const onenter = mode => {
	let option1 = Button.create("Opt1", { width: 80 })
	let option2 = Button.create("Opt2", { width: 80 })
	let option3 = Button.create("Opt3", { width: 80 })
	let back = Button.create("Back", { onclick: _ => [[ "nextmode", "Home" ]] })
	mode.buttons.push(option1, option2, option3)
	mode.back = back

	for (let i = 0; i < mode.buttons.length; i++) {
		let anim = EaseOut.create(10, { delay: i * 6 })
		mode.anims.push(anim)
	}

	let textanim = EaseLinear.create(10)
	mode.anims.push(textanim)

	let backanim = EaseOut.create(15)
	mode.anims.push(backanim)

	return [
		...[ ...mode.buttons, mode.back ].map(comp => [ "addcomp", comp ]),
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

	let backanim = EaseLinear.create(5)
	mode.anims.push(backanim)

	return [
		...[ ...mode.buttons, mode.back ].map(comp => [ "addcomp", comp ]),
		...mode.anims.map(anim => [ "startanim", anim ])
	]
}

const onremove = mode =>
	[ ...mode.buttons, mode.back ].map(button => [ "removecomp", button ])

const render = (mode, view) => {
	let nodes = []
	let { sprites, viewport } = view

	let text = sprites.Text("Option", { font: "seven", color: [ 0, 0, 0 ] })
	let textnode = {
		image: text,
		x: viewport.width / 2,
		y: 32,
		origin: "center"
	}
	let textanim = mode.anims[4]
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

	let backnode = Button.render(mode.back, view)
	backnode.x = 4
	backnode.y = viewport.height - 4
	backnode.origin = "bottomleft"
	let backanim = mode.anims[4]
	if (backanim) {
		const start = -backnode.image.width
		const goal = 4
		let t = mode.exit ? (1 - backanim.x) : backanim.x
		backnode.x = lerp(start, goal, t)
	}
	nodes.push(backnode)

	return nodes
}
