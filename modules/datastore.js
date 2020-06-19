const store = {}

export default {
  add: (key, record) => (store[key].push(record), store[key]),
  all: () => store,
  get: (key) => store[key],
  put: (key, data) => (store[key] = data, store[key]),
}
