import lerp from "lerp"

export function create(duration, opts) {
	opts = Object.assign({ src: 0, dest: 1, delay: 0 }, opts)
	return {
		type: "EaseLinear",
		done: false,
		duration: duration,
		x: opts.src || 0,
		src: opts.src || 0,
		dest: opts.dest === undefined ? 1 : opts.dest,
		delay: opts.delay,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	let time = Math.max(0, anim.time - anim.delay)
	anim.x = lerp(anim.src, anim.dest, time / anim.duration)
	if (time >= anim.duration) {
		anim.done = true
	}
}
