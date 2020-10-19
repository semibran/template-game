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
	let text = view.sprites.Text("Hello world!", { font: "seven" })
	let node = { image: text }
	return [ node ]
}
