import datastore from 'modules/datastore'
import factory from 'modules/handlerFactory'

const resource = 'candidates'
const hrefPath = ({id, name}) => ({href: `/${resource}/${id}`, name})
const candidates = () => (datastore.get(resource) || []).map(hrefPath)

export default factory({
  // returns a list of all candidates
  GET: (req, res) => {
    const data = candidates()

    data.length
      ? res.status(200).json(data)
      : res.status(404).json({})
  },

  // // adds a new candidate to the list
  // PUT: (req, res) => {},
})

export {
  candidates
}
