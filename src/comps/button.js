export function create(text, width) {
	return {
		text: text,
		width: width,
		sprite: null
	}
}

export function onclick(button, pointer, view) {
	return [ "click" ]
}

export function render(button, view) {
	let { sprites } = view
	return { image: sprites.Button(button.text, button.width) }
}
