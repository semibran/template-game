export function create(text, opts) {
	Object.assign({ width: 0, onclick: null }, opts)
	return {
		type: "Button",
		text: text,
		width: opts.width,
		onclick: opts.onclick,
		node: null
	}
}

export function onclick(button, pointer, view) {
	if (button.onclick) return button.onclick()
}

export function render(button, view) {
	let { sprites } = view
	if (!button.node) {
		let sprite = sprites.Button(button.text, button.width)
		button.node = { image: sprite }
	}
	return button.node
}
