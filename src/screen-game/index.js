export function create() {
	return {
		type: "Game",
		parent: "View",
		children: [],
		exit: false,
		subscr: null,
		nextscr: null
	}
}

export function render(game, view) {
	let viewport = view.viewport
	let text = view.sprites.Text("Hello world!", { font: "seven" })
	let node = {
		image: text,
		x: viewport.width / 2,
		y: viewport.height / 2,
		origin: "center"
	}
	return [ node ]
}
