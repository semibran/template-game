import { create as Canvas } from "../lib/canvas"

const padx = 5
const pady = 3

export default function renderButton(content, width, sprites) {
	let text = sprites.Text(content)
	let w = width || text.width + padx * 2
	let h = text.height + pady * 2 - 2
	let button = Canvas(w, h)
	button.fillRect(1, 0, w - 2, h)
	button.fillRect(0, 1, w, h - 2)
	button.drawImage(text, width ? width / 2 - text.width / 2 : padx, pady)

	return button.canvas
}
