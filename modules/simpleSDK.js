const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
  }
}

function simpleSDK (root, instanceOptions = {}) {
  root = root.replace(/\/+$/, "")

  const methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]

  const core = {
    headers: (headers) => instanceOptions.headers = headers,
  }

  return new Proxy(core, {
    get: function (target, method) {
      if (target[method]) return target[method]

      method = method.toUpperCase()
      
      if (!methods.includes(method)) {
        throw new Error(`Invalid method provided: ${method}`)
      }

      return (resource = "", requestOptions = {}) => fetch(`${root}${resource}`, {
          ...defaultOptions,
          ...instanceOptions,
          ...requestOptions,
          ...(requestOptions.body ? {body: JSON.stringify(requestOptions.body)} : {}),
          method,
        })
        .then((res) => res.json())
    },
  })
}

export default simpleSDK
