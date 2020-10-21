import { create as createGame } from "./game/game"
import loadImage from "img-load"
import disasm from "./disasm"

import * as Comps from "./view/comps"
import * as Screens from "./view/screens"
import * as Anims from "./view/anims"
import drawNodes from "./view/node-draw"
import bounds from "./view/node-bbox"
import findPos from "./view/find-eventpos"
import quadrance from "./lib/quadrance"
import contains from "./lib/box-contains"

loadImage("sprites.png").then(main)

function main(sprites) {
	let view = {
		native: { width: 160, height: 160 },
		element: document.createElement("canvas"),
		sprites: disasm(sprites),
		viewport: {
			width: window.innerWidth,
			height: window.innerHeight,
			scale: 1
		},
		pointer: {
			pos: null,
			presspos: null,
			presstime: 0,
			click: false
		},
		screen: null,
		nextscr: null,
		comps: [],
		anims: [],
		cmds: [],
		nodes: [],
		time: 0,
		dirty: false
	}
	let gamedata = createGame()
	transition(view, "Game", gamedata)
	mount(view, document.body)
}

function transition(view, scrtype, ...scrdata) {
	if (view.nextscr) return
	let sprites = view.sprites
	let screen = Screens[scrtype].create(...scrdata)
	view.screen = screen

	let onenter = Screens[scrtype].onenter
	if (onenter) {
		let cmds = onenter(screen, view)
		if (cmds) view.cmds.push(...cmds)
	}
}

function mount(view, element) {
	let { viewport, pointer } = view
	let device = null

	onresize()
	window.addEventListener("resize", onresize)
	window.addEventListener("mousedown", onpress)
	window.addEventListener("mousemove", onmove)
	window.addEventListener("mouseup", onrelease)
	window.addEventListener("touchstart", onpress)
	window.addEventListener("touchmove", onmove)
	window.addEventListener("touchend", onrelease)
	requestAnimationFrame(onupdate)
	element.appendChild(view.element)

	function switchDevice(event) {
		let device = "desktop"
		if (event.touches) {
			device = "mobile"
			window.removeEventListener("mousedown", onpress)
			window.removeEventListener("mousemove", onmove)
			window.removeEventListener("mouseup", onrelease)
		} else {
			window.removeEventListener("touchstart", onpress)
			window.removeEventListener("touchmove", onmove)
			window.removeEventListener("touchend", onrelease)
		}
		return device
	}

	function onresize() {
		// update cache to match window size
		let scaleX = Math.max(1, Math.floor(window.innerWidth / view.native.width))
		let scaleY = Math.max(1, Math.floor(window.innerHeight / view.native.height))
		viewport.scale = Math.min(scaleX, scaleY)
		viewport.width = Math.ceil(window.innerWidth / viewport.scale)
		viewport.height = Math.ceil(window.innerHeight / viewport.scale)

		// resize canvas
		let canvas = view.element
		canvas.width = viewport.width
		canvas.height = viewport.height
		canvas.style.transform = `scale(${ viewport.scale })`

		// call onresize hook
		let screen = view.screen
		if (Screens[screen.type].onresize) {
			let cmds = Screens[screen.type].onresize(screen, viewport)
			if (cmds) view.cmds.push(...cmds)
		}
		view.dirty = true
	}

	function onpress(event) {
		if (!device) device = switchDevice(event)
		if (pointer.presspos) return false

		// attempt to detect pointer position
		// if we fail, ignore the event
		pointer.pos = findPos(event)
		if (!pointer.pos) return false

		// click is within bounds, we can use it
		pointer.presspos = pointer.pos
		pointer.presstime = view.time
		pointer.click = true

		// call onpress hook
		let screen = view.screen
		if (Screens[screen.type].onpress) {
			let cmds = Screens[screen.type].onpress(screen, pointer)
			if (cmds) view.cmds.push(...cmds)
		}
	}

	function onmove(event) {
		pointer.pos = findPos(event)
		if (!pointer.pos || !pointer.presspos) return false
		if (pointer.click) {
			let cursor = pointer.pos
			let origin = pointer.presspos
			// check if distance from pressed pos is greater than threshold `maxdist`
			// uses quadrance instead of distance here for minor perf gains
			const maxdist = 3
			if (quadrance(origin, cursor) > Math.pow(maxdist, 2)) {
				pointer.click = false
			}
		}
		// call move hook
		let screen = view.screen
		if (Screens[screen.type].onmove) {
			let cmds = Screens[screen.type].onmove(screen, pointer)
			if (cmds) view.cmds.push(...cmds)
		}
	}

	function onrelease() {
		if (!pointer.presspos) return false

		// find component at pointer and call onclick if existent
		if (pointer.click) {
			let viewport = view.viewport
			let scaledpos = {
				x: pointer.pos.x / viewport.scale,
				y: pointer.pos.y / viewport.scale
			}
			let comp = view.comps.find(comp => comp.mode === view.screen.mode
				&& comp.node && contains(scaledpos, bounds(comp.node)))
			if (comp) {
				let cmds = Comps[comp.type].onclick(comp, pointer, view)
				if (cmds) view.cmds.push(...cmds)
				pointer.presspos = null
				pointer.click = false
				return
			}
		}

		// call screen onrelease hook (blocked if onclick succeeds)
		let screen = view.screen
		if (Screens[screen.type].onrelease) {
			let cmds = Screens[screen.type].onrelease(screen, pointer)
			if (cmds) view.cmds.push(...cmds)
		}

		// reset after hooks in case the data is used
		pointer.presspos = null
		pointer.click = false
	}

	function onupdate() {
		view.dirty |= updateanims(view)
		view.dirty |= resolvecmds(view)
		if (view.dirty) {
			view.dirty = false
			render(view)
		}

		// queue next frame
		// todo: limit raf usage?
		requestAnimationFrame(onupdate)

		// onupdate hook
		let screen = view.screen
		if (Screens[screen.type].onupdate) {
			let cmds = Screens[screen.type].onupdate(screen)
			if (cmds) view.cmds.push(...cmds)
		}
	}
}

function updateanims(view) {
	let dirty = false
	for (let anim of view.anims) {
		dirty = true
		if (anim.done) {
			stopanim(view, anim)
		} else {
			Anims[anim.type].update(anim)
		}
	}
	if (!dirty && view.screen.nextmode) {
		switchmode(view)
	}
	return dirty
}

function resolvecmds(view) {
	let dirty = false
	while (view.cmds.length && !view.anims.find(anim => anim.blocking)) {
		dirty = true
		let [ ctype, ...cdata ] = view.cmds.shift()
		if (ctype === "addcomp") {
			addcomp(view, ...cdata)
		} else if (ctype === "removecomp") {
			removecomp(view, ...cdata)
		} else if (ctype === "startanim") {
			startanim(view, ...cdata)
		} else if (ctype === "stopanim") {
			stopanim(view, ...cdata)
		} else if (ctype === "nextmode") {
			nextmode(view, ...cdata)
		} else {
			dirty = false
			console.warn("Warning: No command handler defined for command " + ctype + "."
				+ " Command has been dropped.")
		}
	}
	return dirty
}

function addcomp(view, comp) {
	comp.mode = view.screen.mode
	view.comps.push(comp)
}

function removecomp(view, comp) {
	let idx = view.comps.indexOf(comp)
	if (idx >= 0) {
		view.comps.splice(idx, 1)
	}
}

function startanim(view, anim) {
	view.anims.push(anim)
}

function stopanim(view, anim) {
	anim.done = true
	let idx = view.anims.indexOf(anim)
	if (idx >= 0) {
		view.anims.splice(idx, 1)
	}
}

function nextmode(view, next) {
	let screen = view.screen
	let mode = screen.mode
	let onexit = Screens[screen.type].Modes[mode.type].onexit
	if (onexit) {
		view.cmds.push(...onexit(mode))
	}
	screen.nextmode = next
}

function switchmode(view) {
	let screen = view.screen

	// remove old mode
	let mode = screen.mode
	let onremove = Screens[screen.type].Modes[mode.type].onremove
	if (onremove) {
		view.cmds.push(...onremove(mode))
	}

	// create new modedata, components, enter animations
	let nextmode = Screens[screen.type].Modes[screen.nextmode].create()
	let onenter = Screens[screen.type].Modes[screen.nextmode].onenter
	if (onenter) {
		view.cmds.push(...onenter(nextmode))
	}

	// switch to new mode
	screen.mode = nextmode
	screen.nextmode = null
}

function render(view) {
	let screen = view.screen

	// clear canvas
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	// clear screen
	let nodes = view.nodes
	nodes.length = 0

	// queue screen nodes
	let screennodes = Screens[screen.type].render(screen, view)
	nodes.push(...screennodes)

	// draw on canvas
	let layerseq = Screens[screen.type].layerseq
	if (!layerseq) {
		console.warn("Warning: No layer sequence defined for screen " + screen.type + "."
			+ " Layers will not be sorted.")
	}
	drawNodes(nodes, layerseq, context)
}
