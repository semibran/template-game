export default function Ease (fn, duration, data) {
  let done = false
  let time = 0
  return {
    data,
    update () {
      if (done) return -1
      const t = time / (duration - 1)
      const x = fn(t)
      if (++time === duration) {
        done = true
      }
      return x
    }
  }
}
