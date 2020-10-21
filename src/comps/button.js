export { create, onclick, render }

const create = (text, opts) => ({
	type: "Button",
	text: text,
	width: opts && opts.width,
	onclick: opts && opts.onclick,
	node: null
})

// onclick(button) -> cmdlist
// > passes over control to predefined click handler if existent
const onclick = button =>
	button.onclick && button.onclick()

// render(button, view) -> node
// > renders a drawable node and saves in component cache.
// > screen uses cached node to find bounding box for click detects
const render = (button, view) => {
	if (!button.node) {
		let sprite = view.sprites.Button(button.text, button.width)
		button.node = { image: sprite }
	}
	return button.node
}
