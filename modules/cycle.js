function cycle (fn, throttle = 20000) {
  let awaiting

  const schedule = () => setTimeout(() => {
    fn()
    clearTimeout(awaiting)
    awaiting = schedule()
  }, throttle)

  return {
    delay () {
      clearTimeout(awaiting)
      awaiting = schedule()
    },
    start () {
      awaiting = schedule()
      this.start = () => {
        throw new Error("Already started.")
      }
    },
    stop () {
      clearTimeout(awaiting)
      awaiting = null
    },
  }
}

export default cycle
