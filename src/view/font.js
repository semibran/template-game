import makeCharmap from "./charmap"

export default function Font(image, data) {
	let charmap = makeCharmap(image, data)
	return {
		image: image,
		data: data,
		cache: {
			default: charmap,
			[[ 255, 255, 255, 255 ]]: charmap
		}
	}
}

export function recolor(font, color) {
	if (!font.cache[color]) {
		font.cache[color] = makeCharmap(font.image, font.data, color)
	}
	return font.cache[color]
}
