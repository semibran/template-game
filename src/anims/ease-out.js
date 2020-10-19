import { easeOut } from "../../lib/ease-expo"

export function create(duration, opts) {
	opts = Object.assign({ delay: 0 }, opts)
	return {
		id: "EaseOut",
		done: false,
		duration: duration,
		opts: opts,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	let time = Math.max(0, anim.time - anim.data.delay)
	anim.x = easeOut(time / anim.duration)
	if (time >= anim.duration) {
		anim.done = true
	}
}
