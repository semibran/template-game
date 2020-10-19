import Screens from "./view/screens"
import drawNodes from "./view/node-draw"
import findPos from "./view/find-eventpos"
import quadrance from "../lib/quadrance"

export function create(width, height, sprites) {
	return {
		native: { width, height },
		sprites: sprites,
		element: document.createElement("canvas"),
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
		children: [],
		anims: [],
		cmds: [],
		nodes: [],
		time: 0,
		dirty: false
	}
}

export function mount(view, element) {
	let { viewport, sprites, pointer } = view
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
		if (pointer.mode === "click") {
			let cursor = pointer.pos
			let origin = pointer.presspos
			// check if distance from pressed pos is greater than threshold `maxdist`
			// uses quadrance instead of distance here for minor perf gains
			const maxdist = 3
			if (getQuadrance(origin, cursor) > Math.pow(maxdist, 2)) {
				pointer.mode = "drag"
			}
		}
		// call move hook
		let screen = view.screen
		if (Screens[screen.type].onmove) {
			let cmds = Screens[screen.type].onmove(screen, pointer)
			if (cmds) view.cmds.push(...cmds)
		}
	}

	function onrelease(event) {
		if (!pointer.presspos) return false
		// call screen onrelease hook
		let screen = view.screen
		if (Screens[screen.type].onrelease) {
			let cmds = Screens[screen.type].onrelease(screen, pointer)
			if (cmds) view.cmds.push(...cmds)
		}
		// reset after hook in case the data is used
		pointer.mode = null
		pointer.presspos = null
	}

	function onupdate() {
		if (view.dirty) {
			view.dirty = false
			render(view)
		}

		if (view.cmds.length) {
			// resolve commands
		}

		requestAnimationFrame(onupdate)

		// onupdate hook
		let screen = view.screen
		if (Screens[screen.type].onupdate) {
			let cmds = Screens[screen.type].onupdate(screen)
			if (cmds) view.cmds.push(...cmds)
		}
	}
}

export function change(view, scrtype, ...scrdata) {
	if (view.nextscr) return
	let sprites = view.sprites
	let screen = Screens[scrtype].create(...scrdata)
	view.screen = screen

	let onenter = Screens[scrtype].onenter
	if (onenter) {
		let cmds = onenter(screen, sprites)
		view.cmds.push(cmds)
	}
}

function render(view) {
	// clear canvas
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	// clear screen
	let nodes = view.nodes
	nodes.length = 0

	// queue nodes
	let screen = view.screen
	let screennodes = Screens[screen.type].render(screen, view)
	nodes.push(...screennodes)

	let nextscr = view.nextscr
	if (nextscr) {
		let nextnodes = Screens[screen.type].render(screen, view)
		nodes.push(...nextnodes)
	}

	// draw on canvas
	let layerseq = Screens[screen.type].layerseq
	if (!layerseq) {
		console.warn(`Warning: No layer sequence is defined for screen ${screen.type}.\ Layers will not be sorted.`)
	}
	drawNodes(nodes, layerseq, context)
}
