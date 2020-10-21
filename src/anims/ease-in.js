import { easeInOut } from "../lib/ease-expo"

export { create, update }

const create = (duration, opts) => ({
	type: "EaseIn",
	done: false,
	duration: duration,
	delay: opts ? opts.delay : 0,
	x: 0,
	time: 0
})

const update = anim => {
	if (anim.done) return
	anim.time++
	let time = Math.max(0, anim.time - anim.delay)
	anim.x = easeInOut(time / anim.duration)
	if (time >= anim.duration) {
		anim.done = true
	}
}
