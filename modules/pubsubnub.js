function pubsubnub () {
  const events = {}
  
  return {
    pub (topic, ...data) {(events[topic] || []).forEach((fn) => fn(...data))},
    sub (topic, fn) {events[topic] = [...(events[topic] || []), fn]},
  }
}

export default pubsubnub
