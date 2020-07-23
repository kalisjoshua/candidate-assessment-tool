function factory (methods) {
  function handler (req, res) {
    (methods[req.method] || NOT_FOUND)(req, res)
  }

  return handler
}

function NOT_FOUND (_, res) {
  res.status(404).json({message: "Not found."})
}

export default factory
