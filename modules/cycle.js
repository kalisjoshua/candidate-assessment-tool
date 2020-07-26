function cycle (fn, throttle = 20000) {
  let awaiting

  function delay () {
    stop()
    awaiting = setTimeout(start, throttle)
  }
  
  function start () {
    fn()
    delay()
  }
  
  function stop () {
    clearTimeout(awaiting)
  }

  return {delay, start, stop}
}

export default cycle
